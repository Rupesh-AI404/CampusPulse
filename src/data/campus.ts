export type OpportunityCategory =
  | "Internship"
  | "Workshop"
  | "Hackathon"
  | "Competition"
  | "Club"
  | "Career Event";

export type JourneyStage = "Discover" | "Apply" | "Participate" | "Achieve";

export interface MatchReason {
  label: string;
}

export interface Organizer {
  name: string;
  role: string;
  initials: string;
  about: string;
}

export interface Opportunity {
  id: string;
  title: string;
  tagline: string;
  category: OpportunityCategory;
  organizer: Organizer;
  location: string;
  mode: "On campus" | "Hybrid" | "Remote";
  commitment: string;
  deadline: string;
  daysLeft: number;
  match: number;
  matchReasons: MatchReason[];
  story: string[];
  outcomes: string[];
  skills: string[];
  seats: string;
  featured?: boolean;
}

export const categories: { name: OpportunityCategory; note: string; count: number }[] = [
  { name: "Internship", note: "Learn with a real team", count: 8 },
  { name: "Hackathon", note: "Build with fellow students", count: 4 },
  { name: "Workshop", note: "Develop practical skills", count: 12 },
  { name: "Competition", note: "Test your ideas with peers", count: 6 },
  { name: "Career Event", note: "Meet people in the field", count: 5 },
  { name: "Club", note: "Find your community", count: 9 },
];

export const journeyStages: { stage: JourneyStage; line: string; detail: string }[] = [
  {
    stage: "Discover",
    line: "Everything on campus, in one pulse.",
    detail:
      "No more scattered group chats and notice boards. Opportunities arrive sorted by what you are actually building toward.",
  },
  {
    stage: "Apply",
    line: "Apply with context, not guesswork.",
    detail:
      "Each opportunity tells you why it fits you — which skill, which interest, which next step it unlocks.",
  },
  {
    stage: "Participate",
    line: "Show up prepared.",
    detail:
      "Deadlines, briefings and teammates stay in one timeline so nothing quietly slips past you.",
  },
  {
    stage: "Achieve",
    line: "Watch the record of your growth build itself.",
    detail:
      "Every completed experience becomes proof — skills earned, projects shipped, people met.",
  },
];

export const opportunities: Opportunity[] = [
  {
    id: "react-fullstack-workshop",
    title: "React & Full-Stack Development Workshop",
    tagline: "Build a practical web project with guidance from student mentors.",
    category: "Internship",
    organizer: {
      name: "College IT Department",
      role: "Academic support programme",
      initials: "IT",
      about:
        "The department supports student-led technical learning through practical workshops, mentoring and project reviews.",
    },
    location: "Computer Lab, Main Block",
    mode: "Hybrid",
    commitment: "18 hrs / week · 6 weeks",
    deadline: "September 12",
    daysLeft: 24,
    match: 94,
    matchReasons: [
      { label: "React and TypeScript on your profile" },
      { label: "Interest in product design" },
      { label: "You have React and TypeScript on your profile" },
    ],
    story: [
      "Most internships hand students a spreadsheet. This one hands you a branch.",
      "The workshop covers component-based interfaces, APIs and deployment basics. Mentors review progress during each session and help teams work through common issues.",
      "By the final week you present what you built to the whole studio — and it stays in production after you leave.",
    ],
    outcomes: [
      "One production feature you can point to and explain",
      "Code review habits from a senior engineer",
      "A written reference from your pairing mentor",
    ],
    skills: ["React", "TypeScript", "Design systems", "Git"],
    seats: "30 places",
    featured: true,
  },
  {
    id: "kathmandu-valley-hackfest",
    title: "Kathmandu Valley HackFest",
    tagline: "A weekend hackathon for student teams solving campus challenges.",
    category: "Hackathon",
    organizer: {
      name: "Student Developer Community",
      role: "Student-run technical community",
      initials: "SD",
      about:
        "A student community that brings together learners for coding sessions, peer support and practical events.",
    },
    location: "Seminar Hall, Block B",
    mode: "On campus",
    commitment: "48 hrs · one weekend",
    deadline: "September 20",
    daysLeft: 32,
    match: 88,
    matchReasons: [
      { label: "You joined two hackathons this year" },
      { label: "Frontend skills fit the open team slots" },
    ],
    story: [
      "One prompt, forty-eight hours, and every accessibility problem students complain about but nobody fixes.",
      "Teams of four get a mentor, a floor of the library, and unreasonable amounts of coffee. Judging weighs whether a real student could use it on Monday — not how many frameworks you touched.",
    ],
    outcomes: [
      "A shipped prototype and a two-minute demo",
      "Team of four, matched if you come solo",
      "Feedback from alumni judges",
    ],
    skills: ["Rapid prototyping", "Teamwork", "Accessibility"],
    seats: "20 teams",
  },
  {
    id: "nepal-ui-ux-design-challenge",
    title: "Nepal UI/UX Design Challenge",
    tagline: "Design a clear digital experience for a student-focused service.",
    category: "Workshop",
    organizer: {
      name: "Innovation & Entrepreneurship Center",
      role: "Campus innovation programme",
      initials: "IE",
      about:
        "The centre helps students explore design thinking, practical problem-solving and early-stage ideas.",
    },
    location: "Innovation Lab, Main Block",
    mode: "On campus",
    commitment: "3 hrs · single session",
    deadline: "September 8",
    daysLeft: 20,
    match: 79,
    matchReasons: [
      { label: "Interest in product design" },
      { label: "Complements your frontend skills" },
    ],
    story: [
      "You already know how to make a chart. This session is about making a point.",
      "Bring a dataset — yours or ours. You leave with one visual and one paragraph strong enough to open a report with.",
    ],
    outcomes: ["A portfolio-ready case study", "Feedback from design mentors"],
    skills: ["Figma", "User research", "Prototyping"],
    seats: "24 places",
  },
  {
    id: "founders-case-cup",
    title: "Founders Case Cup",
    tagline: "Solve a live business problem for a real regional company.",
    category: "Competition",
    organizer: {
      name: "Enterprise Cell",
      role: "Campus entrepreneurship office",
      initials: "EC",
      about:
        "Connects student teams with regional companies. Past cases came from logistics, retail and fintech partners.",
    },
    location: "Business School Atrium",
    mode: "On campus",
    commitment: "2 weeks · part time",
    deadline: "October 3",
    daysLeft: 45,
    match: 71,
    matchReasons: [
      { label: "Strong presentation history" },
      { label: "You saved two strategy events" },
    ],
    story: [
      "The case is not hypothetical and the client is in the room.",
      "Teams get the real numbers, two weeks, and fifteen minutes in front of the company's leadership. Finalists present in the atrium to a live audience.",
    ],
    outcomes: ["A defended recommendation deck", "Direct feedback from company leadership"],
    skills: ["Strategy", "Financial modelling", "Presenting"],
    seats: "32 teams",
  },
  {
    id: "spring-industry-night",
    title: "Spring Industry Night",
    tagline: "Forty companies, one evening, no queue for the recruiters.",
    category: "Career Event",
    organizer: {
      name: "Careers Office",
      role: "Central university service",
      initials: "CO",
      about:
        "Runs on-campus recruitment. Industry Night uses timed rounds so every student gets three guaranteed conversations.",
    },
    location: "Great Hall",
    mode: "On campus",
    commitment: "One evening",
    deadline: "September 28",
    daysLeft: 40,
    match: 68,
    matchReasons: [{ label: "You are in your penultimate year" }],
    story: [
      "Career fairs usually reward whoever elbows fastest. This one runs on timetables.",
      "You pick three companies when you register and get a booked slot with each. The rest of the evening is yours to wander.",
    ],
    outcomes: ["Three booked recruiter conversations", "A reviewed one-page CV"],
    skills: ["Networking", "Interviewing"],
    seats: "600 students",
  },
  {
    id: "robotics-build-collective",
    title: "Robotics Build Collective",
    tagline: "A weekly workshop where the campus rover actually gets built.",
    category: "Club",
    organizer: {
      name: "Robotics Collective",
      role: "Student society, 140 members",
      initials: "RC",
      about:
        "Builds one competition rover per year plus smaller side rigs. Beginners are paired with a returning member.",
    },
    location: "Workshop 3, Engineering",
    mode: "On campus",
    commitment: "4 hrs / week · ongoing",
    deadline: "Rolling",
    daysLeft: 40,
    match: 62,
    matchReasons: [{ label: "Hardware curiosity flagged on your profile" }],
    story: [
      "Turn up on a Thursday, pick a subsystem, and learn it from someone who broke it first.",
      "No prior hardware experience needed — the collective assumes you are learning and pairs accordingly.",
    ],
    outcomes: ["Hands-on electronics and CAD time", "A place on the competition build team"],
    skills: ["Electronics", "CAD", "Embedded C"],
    seats: "Open intake",
  },
];

export function getOpportunity(id: string): Opportunity | undefined {
  return opportunities.find((o) => o.id === id);
}

export interface TimelineEntry {
  stage: JourneyStage;
  title: string;
  detail: string;
  when: string;
  state: "done" | "active" | "upcoming";
}

export const studentTimeline: TimelineEntry[] = [
  {
    stage: "Achieve",
    title: "Completed Campus Innovation Workshop",
    detail: "Practised design thinking and added Figma to your skill set.",
    when: "Aug 8",
    state: "done",
  },
  {
    stage: "Participate",
    title: "Kathmandu Valley HackFest — team confirmed",
    detail: "You are building with Ayesha, Tarek and Lin on the accessibility track.",
    when: "Mar 3",
    state: "done",
  },
  {
    stage: "Apply",
    title: "React & Full-Stack Development Workshop",
    detail: "Registration submitted. Confirmation is expected this week.",
    when: "Aug 19",
    state: "active",
  },
  {
    stage: "Discover",
    title: "Nepal UI/UX Design Challenge saved",
    detail: "Closes in 3 days — 24 places, 3 hours, one portfolio visual.",
    when: "Aug 20",
    state: "upcoming",
  },
];

export const studentProfile = {
  name: "Aarati Shrestha",
  initials: "AS",
  year: "Third year",
  program: "BSc Computer Science",
  campus: "Main Campus",
  statement:
    "Building interfaces that make complicated things feel obvious. Currently teaching myself design systems and looking for a product team to learn inside.",
  stageNow: "Apply" as JourneyStage,
  interests: ["Product design", "Frontend engineering", "Accessibility", "UI/UX design"],
  skills: [
    {
      name: "React",
      level: 82,
      evidence: ["HackFest prototype", "Campus Innovation Workshop", "Coding Circle mentoring"],
    },
    { name: "TypeScript", level: 74, evidence: ["HackFest prototype", "Personal component library"] },
    { name: "Design systems", level: 58, evidence: ["Campus Innovation Workshop"] },
    { name: "Data analysis", level: 41, evidence: ["Statistics coursework"] },
  ],
  achievements: [
    {
      title: "Inter-College Coding Competition — finalist",
      issuer: "Computer Science Society",
      when: "2026",
    },
    { title: "Campus Innovation Workshop", issuer: "Innovation & Entrepreneurship Center", when: "Aug 2026" },
    { title: "Peer mentor, First-Year Coding Circle", issuer: "Faculty of Computing", when: "2025 — now" },
  ],
  growth: [
    { label: "Opportunities explored", value: "48" },
    { label: "Experiences completed", value: "7" },
    { label: "Skills strengthened", value: "4" },
  ],
};
