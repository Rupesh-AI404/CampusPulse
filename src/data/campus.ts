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
  { name: "Internship", note: "Real teams, real shipping", count: 42 },
  { name: "Hackathon", note: "48 hours of momentum", count: 18 },
  { name: "Workshop", note: "Learn a skill in one sitting", count: 63 },
  { name: "Competition", note: "Test yourself against peers", count: 27 },
  { name: "Career Event", note: "Meet the people who hire", count: 21 },
  { name: "Club", note: "Find your people", count: 34 },
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
    id: "orbit-frontend-residency",
    title: "Orbit Frontend Residency",
    tagline: "Six weeks inside a product team shipping to 40,000 students.",
    category: "Internship",
    organizer: {
      name: "Orbit Labs",
      role: "Campus partner since 2022",
      initials: "OL",
      about:
        "A twelve-person product studio that builds student software. Residents pair with a senior engineer and own a real surface of the app.",
    },
    location: "Innovation Block, North Campus",
    mode: "Hybrid",
    commitment: "18 hrs / week · 6 weeks",
    deadline: "March 14",
    daysLeft: 6,
    match: 94,
    matchReasons: [
      { label: "React and TypeScript on your profile" },
      { label: "Interest in product design" },
      { label: "You completed the UI Systems workshop" },
    ],
    story: [
      "Most internships hand students a spreadsheet. This one hands you a branch.",
      "Residents join the Orbit product team in week one, pick up a scoped feature from the roadmap, and ship it behind a flag by week three. You will sit in the same standups, the same design reviews, and the same release calls as the full-time engineers.",
      "By the final week you present what you built to the whole studio — and it stays in production after you leave.",
    ],
    outcomes: [
      "One production feature you can point to and explain",
      "Code review habits from a senior engineer",
      "A written reference from your pairing mentor",
    ],
    skills: ["React", "TypeScript", "Design systems", "Git"],
    seats: "6 residents",
    featured: true,
  },
  {
    id: "nightshift-hackathon",
    title: "Nightshift 48",
    tagline: "A two-night build sprint on campus accessibility.",
    category: "Hackathon",
    organizer: {
      name: "Computing Society",
      role: "Student-run, 900 members",
      initials: "CS",
      about:
        "The oldest technical society on campus. Nightshift is its flagship build weekend, judged by alumni engineers.",
    },
    location: "Central Library, Level 4",
    mode: "On campus",
    commitment: "48 hrs · one weekend",
    deadline: "March 22",
    daysLeft: 14,
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
    seats: "40 teams",
  },
  {
    id: "data-storytelling-lab",
    title: "Data Storytelling Lab",
    tagline: "Turn a messy dataset into an argument people believe.",
    category: "Workshop",
    organizer: {
      name: "Dr. Nadia Rahman",
      role: "Faculty of Statistics",
      initials: "NR",
      about:
        "Teaches applied statistics and runs the campus data clinic. Her workshops are capped small so everyone leaves with finished work.",
    },
    location: "Studio 2, Sciences Wing",
    mode: "On campus",
    commitment: "3 hrs · single session",
    deadline: "March 11",
    daysLeft: 3,
    match: 79,
    matchReasons: [
      { label: "Analytics listed as a growing skill" },
      { label: "Complements your research interest" },
    ],
    story: [
      "You already know how to make a chart. This session is about making a point.",
      "Bring a dataset — yours or ours. You leave with one visual and one paragraph strong enough to open a report with.",
    ],
    outcomes: ["One portfolio-ready visual", "A reusable critique checklist"],
    skills: ["Data analysis", "Visualization", "Writing"],
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
    deadline: "April 2",
    daysLeft: 25,
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
    deadline: "March 30",
    daysLeft: 22,
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
    title: "Completed UI Systems Workshop",
    detail: "Earned a design-systems credit and added Figma to your skill set.",
    when: "Feb 24",
    state: "done",
  },
  {
    stage: "Participate",
    title: "Nightshift 48 — team confirmed",
    detail: "You are building with Ayesha, Tarek and Lin on the accessibility track.",
    when: "Mar 3",
    state: "done",
  },
  {
    stage: "Apply",
    title: "Orbit Frontend Residency",
    detail: "Application submitted. Portfolio review happens this week.",
    when: "Mar 6",
    state: "active",
  },
  {
    stage: "Discover",
    title: "Data Storytelling Lab saved",
    detail: "Closes in 3 days — 24 places, 3 hours, one portfolio visual.",
    when: "Mar 8",
    state: "upcoming",
  },
];

export const studentProfile = {
  name: "Amara Okonjo",
  initials: "AO",
  year: "Third year",
  program: "BSc Computer Science",
  campus: "North Campus",
  statement:
    "Building interfaces that make complicated things feel obvious. Currently teaching myself design systems and looking for a product team to learn inside.",
  stageNow: "Apply" as JourneyStage,
  interests: ["Product design", "Frontend engineering", "Accessibility", "Data storytelling"],
  skills: [
    {
      name: "React",
      level: 82,
      evidence: ["Nightshift 48 prototype", "UI Systems Workshop", "Coding Circle mentoring"],
    },
    { name: "TypeScript", level: 74, evidence: ["Nightshift 48 prototype", "Personal component library"] },
    { name: "Design systems", level: 58, evidence: ["UI Systems Workshop credit"] },
    { name: "Data analysis", level: 41, evidence: ["Statistics coursework"] },
  ],
  achievements: [
    {
      title: "Nightshift 48 — Accessibility track finalist",
      issuer: "Computing Society",
      when: "2025",
    },
    { title: "UI Systems Workshop credit", issuer: "Orbit Labs", when: "Feb 2026" },
    { title: "Peer mentor, First-Year Coding Circle", issuer: "Faculty of Computing", when: "2025 — now" },
  ],
  growth: [
    { label: "Opportunities explored", value: "48" },
    { label: "Experiences completed", value: "7" },
    { label: "Skills strengthened", value: "4" },
  ],
};
