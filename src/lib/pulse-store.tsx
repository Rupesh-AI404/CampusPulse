import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  opportunities as seedOpportunities,
  studentProfile as seedProfile,
  type JourneyStage,
  type Opportunity,
  type OpportunityCategory,
} from "@/data/campus";

/* ------------------------------------------------------------------ *
 * Entities — Session (role) · Profile · Opportunity · Bookmark · Application
 * All persisted in localStorage. No backend, by design.
 * ------------------------------------------------------------------ */

export type Role = "student" | "organizer";

export type OpportunityStatus = "published" | "draft" | "archived";

export interface StoredOpportunity extends Opportunity {
  organizerId: string;
  status: OpportunityStatus;
  createdAt: string;
  deadlineISO?: string;
  requirements?: string[];
}

export type ApplicationStatus = "pending" | "accepted" | "rejected" | "completed";

export interface Application {
  id: string;
  opportunityId: string;
  studentId: string;
  studentName: string;
  studentYear: string;
  studentSkills: string[];
  studentInterests: string[];
  motivation: string;
  experience: string;
  note?: string | undefined;
  match: number;
  appliedAt: string;
  status: ApplicationStatus;
}

export interface ProfileSkill {
  name: string;
  level: number;
  evidence: string[];
}

export interface StudentProfileData {
  name: string;
  initials: string;
  avatar?: string | undefined;
  year: string;
  program: string;
  campus: string;
  statement: string;
  stageNow: JourneyStage;
  interests: string[];
  skills: ProfileSkill[];
  achievements: { title: string; issuer: string; when: string }[];
  growth: { label: string; value: string }[];
  /** True once the student has saved their own profile — demo values retire. */
  customized: boolean;
}

export interface Session {
  role: Role;
  email: string;
  name: string;
}

export interface PulseState {
  session: Session | null;
  profile: StudentProfileData;
  opportunities: StoredOpportunity[];
  bookmarks: string[];
  applications: Application[];
}

export const STUDENT_ID = "student-aarati";
export const ORGANIZER_ID = "college-it-department";
export const organizerProfile = {
  id: ORGANIZER_ID,
  name: "College IT Department",
  role: "Academic support programme",
  initials: "IT",
  contact: "itdepartment@campus.edu",
  about:
    "We support students through practical workshops, mentoring and campus technology events.",
};

/** Demo accounts for the university prototype — not security-grade, by design. */
export const demoAccounts: { role: Role; email: string; password: string; name: string }[] = [
  { role: "student", email: "student@campus.edu", password: "student123", name: seedProfile.name },
  {
    role: "organizer",
    email: "organiser@campus.edu",
    password: "organiser123",
    name: organizerProfile.name,
  },
];

const STORAGE_KEY = "campus-pulse-state-v1";

export function initialsFrom(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "ST";
  return (parts[0]![0]! + (parts[1]?.[0] ?? parts[0]![1] ?? "")).toUpperCase();
}

export const emptyProfile: StudentProfileData = {
  ...(seedProfile as Omit<StudentProfileData, "customized">),
  customized: false,
};


/* ---------------------------- helpers ---------------------------- */

export function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) || "opportunity"
  );
}

export function formatDeadline(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { month: "long", day: "numeric" });
}

export function daysUntil(iso: string) {
  const d = new Date(`${iso}T12:00:00`).getTime();
  if (Number.isNaN(d)) return 0;
  return Math.max(0, Math.round((d - Date.now()) / 86_400_000));
}

export function formatWhen(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { month: "short", day: "numeric" });
}

/**
 * Match is never a magic number — it is derived from the student's own profile.
 * Skills and interests come from the saved profile, so editing the profile
 * immediately changes every match percentage in the product.
 */
export function computeMatch(
  profile: StudentProfileData,
  input: {
    skills: string[];
    category: OpportunityCategory;
    tagline: string;
    title: string;
    requirements?: string[] | undefined;

  },
) {
  const mySkills = profile.skills.map((s) => s.name.toLowerCase()).filter(Boolean);
  const myInterests = profile.interests.map((i) => i.toLowerCase()).filter(Boolean);
  const text = `${input.title} ${input.tagline} ${(input.requirements ?? []).join(" ")}`.toLowerCase();

  const reasons: { label: string }[] = [];
  let score = 52;

  for (const skill of input.skills) {
    const s = skill.toLowerCase();
    if (mySkills.some((m) => m.includes(s) || s.includes(m))) {
      score += 11;
      reasons.push({ label: `${skill} is on your profile` });
    }
  }
  for (const interest of myInterests) {
    const head = interest.split(" ")[0] ?? interest;
    if (text.includes(head) || input.skills.some((s) => s.toLowerCase().includes(head))) {
      score += 7;
      reasons.push({ label: `Matches your interest in ${interest}` });
      break;
    }
  }
  if (input.category === "Internship" || input.category === "Hackathon") {
    score += 6;
    reasons.push({ label: `You engage most with ${input.category.toLowerCase()}s` });
  }
  if (mySkills.length === 0 && myInterests.length === 0) {
    reasons.push({ label: "Add skills to your profile to sharpen this score" });
  } else if (reasons.length === 0) {
    reasons.push({ label: "New on campus — outside your usual pattern" });
  }

  return { match: Math.max(38, Math.min(97, score)), matchReasons: reasons.slice(0, 4) };
}


function seedState(): PulseState {
  const owners: Record<string, string> = {
    "react-fullstack-workshop": ORGANIZER_ID,
    "nepal-ui-ux-design-challenge": "innovation-entrepreneurship-center",
    "kathmandu-valley-hackfest": "student-developer-community",
    "founders-case-cup": "enterprise-cell",
    "spring-industry-night": "careers-office",
    "robotics-build-collective": "robotics-collective",
  };

  const opportunities: StoredOpportunity[] = seedOpportunities.map((o) => ({
    ...o,
    organizerId: owners[o.id] ?? slugify(o.organizer.name),
    status: "published",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString(),
    requirements: ["A short motivation", "Relevant experience or coursework"],
  }));

  // Applicants from other students so the organiser has real work to review.
  const applications: Application[] = [
    {
      id: "app-seed-1",
      opportunityId: "react-fullstack-workshop",
      studentId: "student-tarek",
      studentName: "Tarek Aziz",
      studentYear: "Second year · BSc Software Engineering",
      studentSkills: ["React", "Node", "Testing"],
      studentInterests: ["Frontend engineering", "Developer tooling"],
      motivation:
        "I have shipped two side projects to real users and want to learn how a team decides what not to build.",
      experience: "Built the Student Developer Community events page and helped maintain it for a year.",
      match: 86,
      appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(),
      status: "pending",
    },
    {
      id: "app-seed-2",
      opportunityId: "react-fullstack-workshop",
      studentId: "student-lin",
      studentName: "Lin Hartley",
      studentYear: "Third year · BA Design & Computing",
      studentSkills: ["Figma", "Design systems", "CSS"],
      studentInterests: ["Product design", "Accessibility"],
      motivation:
        "I want to close the gap between the components I design and the ones that ship.",
      experience: "Worked on accessibility improvements during last year's Inter-College Coding Competition.",
      note: "Available from September 1.",
      match: 81,
      appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
      status: "pending",
    },
  ];

  return {
    session: null,
    profile: emptyProfile,
    opportunities,
    bookmarks: [],
    applications,
  };
}

function reviveState(raw: string | null): PulseState {
  const base = seedState();
  if (!raw) return base;
  try {
    const parsed = JSON.parse(raw) as Partial<PulseState>;
    const stored = Array.isArray(parsed.opportunities) ? parsed.opportunities : [];
    // Seeds stay available; stored copies win so organiser edits persist.
    const byId = new Map<string, StoredOpportunity>();
    for (const o of base.opportunities) byId.set(o.id, o);
    for (const o of stored) byId.set(o.id, o);
    const opportunities = [...byId.values()].map((o) =>
      o.deadlineISO
        ? { ...o, daysLeft: daysUntil(o.deadlineISO), deadline: formatDeadline(o.deadlineISO) }
        : o,
    );
    const session =
      parsed.session && (parsed.session.role === "student" || parsed.session.role === "organizer")
        ? parsed.session
        : null;
    return {
      session,
      profile: parsed.profile ? { ...emptyProfile, ...parsed.profile } : emptyProfile,
      opportunities,
      bookmarks: Array.isArray(parsed.bookmarks) ? parsed.bookmarks : [],
      applications: Array.isArray(parsed.applications) ? parsed.applications : base.applications,
    };
  } catch {
    return base;
  }
}


/* ---------------------------- context ---------------------------- */

export interface NewOpportunityInput {
  title: string;
  tagline: string;
  description: string;
  category: OpportunityCategory;
  skills: string[];
  deadlineISO: string;
  location: string;
  mode: Opportunity["mode"];
  commitment: string;
  seats: string;
  requirements: string[];
  outcomes: string[];
}

interface PulseContextValue {
  ready: boolean;
  session: Session | null;
  role: Role;
  login: (email: string, password: string) => { ok: boolean; message: string; role?: Role };
  logout: () => void;
  profile: StudentProfileData;
  updateProfile: (next: Partial<StudentProfileData>) => void;
  resetProfile: () => void;

  opportunities: StoredOpportunity[];
  publicOpportunities: StoredOpportunity[];
  organizerOpportunities: StoredOpportunity[];
  getOpportunity: (id: string) => StoredOpportunity | undefined;
  bookmarks: string[];
  savedOpportunities: StoredOpportunity[];
  isSaved: (id: string) => boolean;
  toggleSave: (id: string) => boolean;
  applications: Application[];
  myApplications: Application[];
  organizerApplications: Application[];
  applicationFor: (opportunityId: string) => Application | undefined;
  applicationsForOpportunity: (opportunityId: string) => Application[];
  submitApplication: (
    opportunityId: string,
    data: { motivation: string; experience: string; note?: string },
  ) => { ok: boolean; message: string };
  setApplicationStatus: (applicationId: string, status: ApplicationStatus) => void;
  createOpportunity: (input: NewOpportunityInput) => StoredOpportunity;
  updateOpportunity: (id: string, input: NewOpportunityInput) => void;
  setOpportunityStatus: (id: string, status: OpportunityStatus) => void;
}

const PulseContext = createContext<PulseContextValue | null>(null);

export function PulseProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PulseState>(() => seedState());
  const [ready, setReady] = useState(false);

  // Hydration-safe: read storage only after mount.
  useEffect(() => {
    setState(reviveState(window.localStorage.getItem(STORAGE_KEY)));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable — the session still works in memory */
    }
  }, [state, ready]);

  const buildOpportunity = useCallback(
    (input: NewOpportunityInput, existing?: StoredOpportunity): StoredOpportunity => {
      const { match, matchReasons } = computeMatch(state.profile, {
        skills: input.skills,
        category: input.category,
        tagline: input.tagline,
        title: input.title,
        requirements: input.requirements,
      });

      const story = input.description
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean);
      return {
        id: existing?.id ?? `${slugify(input.title)}-${Date.now().toString(36).slice(-4)}`,
        title: input.title.trim(),
        tagline: input.tagline.trim(),
        category: input.category,
        organizer: {
          name: organizerProfile.name,
          role: organizerProfile.role,
          initials: organizerProfile.initials,
          about: organizerProfile.about,
        },
        location: input.location.trim(),
        mode: input.mode,
        commitment: input.commitment.trim(),
        deadline: formatDeadline(input.deadlineISO),
        deadlineISO: input.deadlineISO,
        daysLeft: daysUntil(input.deadlineISO),
        match: existing?.match ?? match,
        matchReasons: existing?.matchReasons ?? matchReasons,
        story: story.length ? story : [input.tagline.trim()],
        outcomes: input.outcomes.length ? input.outcomes : ["Experience you can point to"],
        skills: input.skills,
        seats: input.seats.trim() || "Open intake",
        requirements: input.requirements,
        organizerId: ORGANIZER_ID,
        status: existing?.status ?? "published",
        createdAt: existing?.createdAt ?? new Date().toISOString(),
      };
    },
    [state.profile],
  );

  const value = useMemo<PulseContextValue>(() => {
    // Match is recomputed from the live profile so an edited profile
    // instantly re-scores every opportunity in the product.
    const scored = state.opportunities.map((o) => ({
      ...o,
      ...computeMatch(state.profile, {
        skills: o.skills,
        category: o.category,
        tagline: o.tagline,
        title: o.title,
        requirements: o.requirements,
      }),
    }));
    const publicOpportunities = scored.filter((o) => o.status === "published");
    const myApplications = state.applications.filter((a) => a.studentId === STUDENT_ID);
    const organizerOpportunities = scored.filter(
      (o) => o.organizerId === ORGANIZER_ID && o.status !== "archived",
    );
    const organizerIds = new Set(
      scored.filter((o) => o.organizerId === ORGANIZER_ID).map((o) => o.id),
    );

    return {
      ready,
      session: state.session,
      role: state.session?.role ?? "student",
      login: (email, password) => {
        const normalized = email.trim().toLowerCase();
        const account = demoAccounts.find(
          (a) => a.email === normalized && a.password === password,
        );
        if (!account) {
          return { ok: false, message: "Those details do not match a demo account." };
        }
        const session: Session = {
          role: account.role,
          email: account.email,
          name: account.role === "student" ? state.profile.name : account.name,
        };
        setState((s) => ({ ...s, session }));
        return { ok: true, message: `Signed in as ${session.name}.`, role: account.role };
      },
      logout: () => setState((s) => ({ ...s, session: null })),
      profile: state.profile,
      updateProfile: (next) =>
        setState((s) => {
          const profile = { ...s.profile, ...next, customized: true };
          return {
            ...s,
            profile,
            session: s.session
              ? { ...s.session, name: s.session.role === "student" ? profile.name : s.session.name }
              : s.session,
          };
        }),
      resetProfile: () => setState((s) => ({ ...s, profile: emptyProfile })),
      opportunities: scored,
      publicOpportunities,
      organizerOpportunities,
      getOpportunity: (id) => scored.find((o) => o.id === id),
      bookmarks: state.bookmarks,
      savedOpportunities: state.bookmarks
        .map((id) => scored.find((o) => o.id === id))
        .filter((o): o is StoredOpportunity => Boolean(o)),

      isSaved: (id) => state.bookmarks.includes(id),
      toggleSave: (id) => {
        const nowSaved = !state.bookmarks.includes(id);
        setState((s) => ({
          ...s,
          bookmarks: nowSaved ? [id, ...s.bookmarks] : s.bookmarks.filter((b) => b !== id),
        }));
        return nowSaved;
      },
      applications: state.applications,
      myApplications,
      organizerApplications: state.applications.filter((a) => organizerIds.has(a.opportunityId)),
      applicationFor: (opportunityId) =>
        myApplications.find((a) => a.opportunityId === opportunityId),
      applicationsForOpportunity: (opportunityId) =>
        state.applications.filter((a) => a.opportunityId === opportunityId),
      submitApplication: (opportunityId, data) => {
        const opportunity = scored.find((o) => o.id === opportunityId);
        if (!opportunity) return { ok: false, message: "That opportunity no longer exists." };
        if (myApplications.some((a) => a.opportunityId === opportunityId)) {
          return { ok: false, message: "You have already applied to this opportunity." };
        }
        const application: Application = {
          id: `app-${Date.now().toString(36)}`,
          opportunityId,
          studentId: STUDENT_ID,
          studentName: state.profile.name,
          studentYear: `${state.profile.year} · ${state.profile.program}`,
          studentSkills: state.profile.skills.map((s) => s.name),
          studentInterests: state.profile.interests,

          motivation: data.motivation.trim(),
          experience: data.experience.trim(),
          note: data.note?.trim() || undefined,
          match: opportunity.match,
          appliedAt: new Date().toISOString(),
          status: "pending",
        };
        setState((s) => ({ ...s, applications: [application, ...s.applications] }));
        return { ok: true, message: "Application submitted." };
      },
      setApplicationStatus: (applicationId, status) =>
        setState((s) => ({
          ...s,
          applications: s.applications.map((a) => (a.id === applicationId ? { ...a, status } : a)),
        })),
      createOpportunity: (input) => {
        const created = buildOpportunity(input);
        setState((s) => ({ ...s, opportunities: [created, ...s.opportunities] }));
        return created;
      },
      updateOpportunity: (id, input) =>
        setState((s) => ({
          ...s,
          opportunities: s.opportunities.map((o) =>
            o.id === id ? buildOpportunity(input, o) : o,
          ),
        })),
      setOpportunityStatus: (id, status) =>
        setState((s) => ({
          ...s,
          opportunities: s.opportunities.map((o) => (o.id === id ? { ...o, status } : o)),
        })),
    };
  }, [state, ready, buildOpportunity]);

  return <PulseContext.Provider value={value}>{children}</PulseContext.Provider>;
}

export function usePulse() {
  const ctx = useContext(PulseContext);
  if (!ctx) throw new Error("usePulse must be used inside PulseProvider");
  return ctx;
}

export const statusMeta: Record<
  ApplicationStatus,
  { label: string; tone: "primary" | "growth" | "energy" | "neutral"; help: string }
> = {
  pending: {
    label: "Under review",
    tone: "primary",
    help: "The organiser has your application and has not decided yet.",
  },
  accepted: {
    label: "Accepted",
    tone: "growth",
    help: "You are in. Watch for the organiser's briefing details.",
  },
  rejected: {
    label: "Not this time",
    tone: "energy",
    help: "This one did not go ahead. Your profile keeps the attempt.",
  },
  completed: {
    label: "Completed",
    tone: "growth",
    help: "Finished — this now counts as evidence on your profile.",
  },
};
