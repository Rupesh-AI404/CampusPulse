import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { categories, type Opportunity, type OpportunityCategory } from "@/data/campus";
import {
  usePulse,
  type NewOpportunityInput,
  type StoredOpportunity,
} from "@/lib/pulse-store";
import { cn } from "@/lib/utils";

interface Errors {
  title?: string;
  tagline?: string;
  description?: string;
  skills?: string;
  deadlineISO?: string;
  location?: string;
  commitment?: string;
}

const modes: Opportunity["mode"][] = ["On campus", "Hybrid", "Remote"];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

/** One form for both create and edit, so the two flows behave identically. */
export function OpportunityForm({ existing }: { existing?: StoredOpportunity }) {
  const { createOpportunity, updateOpportunity, applicationsForOpportunity } = usePulse();
  const navigate = useNavigate();

  const [title, setTitle] = useState(existing?.title ?? "");
  const [tagline, setTagline] = useState(existing?.tagline ?? "");
  const [description, setDescription] = useState(existing?.story.join("\n\n") ?? "");
  const [category, setCategory] = useState<OpportunityCategory>(existing?.category ?? "Workshop");
  const [skills, setSkills] = useState(existing?.skills.join(", ") ?? "");
  const [deadlineISO, setDeadlineISO] = useState(existing?.deadlineISO ?? "");
  const [location, setLocation] = useState(existing?.location ?? "");
  const [mode, setMode] = useState<Opportunity["mode"]>(existing?.mode ?? "On campus");
  const [commitment, setCommitment] = useState(existing?.commitment ?? "");
  const [seats, setSeats] = useState(existing?.seats ?? "");
  const [requirements, setRequirements] = useState(
    (existing?.requirements ?? ["A short motivation", "Relevant experience or coursework"]).join("\n"),
  );
  const [outcomes, setOutcomes] = useState((existing?.outcomes ?? []).join("\n"));
  const [errors, setErrors] = useState<Errors>({});

  const existingApplications = existing ? applicationsForOpportunity(existing.id).length : 0;

  const validate = (): NewOpportunityInput | null => {
    const next: Errors = {};
    const skillList = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (title.trim().length < 4) next.title = "Give the opportunity a real title (4+ characters).";
    if (title.trim().length > 80) next.title = "Keep the title under 80 characters.";
    if (tagline.trim().length < 15) next.tagline = "One line that tells a student what this is.";
    if (tagline.trim().length > 140) next.tagline = "Keep the short description under 140 characters.";
    if (description.trim().length < 60)
      next.description = "Describe the experience — at least 60 characters.";
    if (skillList.length === 0) next.skills = "Add at least one skill, comma separated.";
    if (!deadlineISO) next.deadlineISO = "Pick an application deadline.";
    else if (deadlineISO < todayISO()) next.deadlineISO = "The deadline cannot be in the past.";
    if (location.trim().length < 3) next.location = "Where does this happen?";
    if (commitment.trim().length < 3) next.commitment = "How much time does it take?";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error("Check the highlighted fields", {
        description: "A few required details are missing or invalid.",
      });
      return null;
    }

    return {
      title,
      tagline,
      description,
      category,
      skills: skillList,
      deadlineISO,
      location,
      mode,
      commitment,
      seats,
      requirements: requirements.split("\n").map((r) => r.trim()).filter(Boolean),
      outcomes: outcomes.split("\n").map((r) => r.trim()).filter(Boolean),
    };
  };

  const submit = () => {
    const input = validate();
    if (!input) return;

    if (existing) {
      updateOpportunity(existing.id, input);
      toast.success("Opportunity updated", {
        description:
          existingApplications > 0
            ? `Changes saved. ${existingApplications} application${existingApplications === 1 ? "" : "s"} kept.`
            : "Students see the updated version in Explore.",
      });
      void navigate({ to: "/organizer/opportunities" });
      return;
    }

    const created = createOpportunity(input);
    toast.success("Opportunity published", {
      description: `${created.title} is now live in Explore for students.`,
    });
    void navigate({ to: "/organizer/opportunities" });
  };

  return (
    <div className="grid gap-12 lg:grid-cols-[1.4fr_0.6fr]">
      <div className="space-y-8">
        <Field label="Title" error={errors.title}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
            placeholder="Orbit Frontend Residency"
            className="w-full bg-transparent font-display text-xl font-bold tracking-tight placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:text-muted-foreground focus:outline-none"
          />
        </Field>

        <Field
          label="Short description"
          hint="Appears on the card in Explore."
          error={errors.tagline}
        >
          <input
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            maxLength={140}
            placeholder="Six weeks inside a product team shipping to real students."
            className="w-full bg-transparent text-sm focus:outline-none"
          />
        </Field>

        <Field
          label="Full description"
          hint="Blank line between paragraphs. This becomes the opportunity story."
          error={errors.description}
        >
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full resize-y bg-transparent text-sm leading-relaxed focus:outline-none"
            placeholder={"What happens, week by week.\n\nWhat a student walks into on day one."}
          />
        </Field>

        <div className="grid gap-8 sm:grid-cols-2">
          <Field label="Category">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as OpportunityCategory)}
              className="w-full bg-transparent text-sm focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c.name} value={c.name} className="bg-surface">
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Format">
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as Opportunity["mode"])}
              className="w-full bg-transparent text-sm focus:outline-none"
            >
              {modes.map((m) => (
                <option key={m} value={m} className="bg-surface">
                  {m}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Application deadline" error={errors.deadlineISO}>
            <input
              type="date"
              value={deadlineISO}
              min={todayISO()}
              onChange={(e) => setDeadlineISO(e.target.value)}
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </Field>

          <Field label="Available seats" hint="e.g. 6 residents, 24 places">
            <input
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
              maxLength={40}
              placeholder="24 places"
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </Field>

          <Field label="Location" error={errors.location}>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              maxLength={80}
              placeholder="Studio 2, Sciences Wing"
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </Field>

          <Field label="Commitment" error={errors.commitment}>
            <input
              value={commitment}
              onChange={(e) => setCommitment(e.target.value)}
              maxLength={60}
              placeholder="3 hrs · single session"
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </Field>
        </div>

        <Field
          label="Skills involved"
          hint="Comma separated. These drive the student match signal."
          error={errors.skills}
        >
          <input
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="React, TypeScript, Design systems"
            className="w-full bg-transparent text-sm focus:outline-none"
          />
        </Field>

        <Field label="Application requirements" hint="One per line. Shown before a student applies.">
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            rows={3}
            className="w-full resize-y bg-transparent text-sm leading-relaxed focus:outline-none"
          />
        </Field>

        <Field label="What students walk away with" hint="One per line (optional).">
          <textarea
            value={outcomes}
            onChange={(e) => setOutcomes(e.target.value)}
            rows={3}
            className="w-full resize-y bg-transparent text-sm leading-relaxed focus:outline-none"
            placeholder={"One production feature you can explain\nA written reference"}
          />
        </Field>

        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
          <button className="btn btn-primary" onClick={submit}>
            {existing ? "Save changes" : "Publish opportunity"}
          </button>
          <button
            className="btn btn-quiet"
            onClick={() => void navigate({ to: "/organizer/opportunities" })}
          >
            Cancel
          </button>
          <span className="text-xs text-muted-foreground">
            {existing
              ? "Applications already received are preserved."
              : "Published immediately — students see it in Explore."}
          </span>
        </div>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="panel panel-signal p-6">
          <p className="marker">Organiser</p>
          <p className="mt-3 font-display text-base font-bold tracking-tight">Orbit Labs</p>
          <p className="mt-1 text-xs text-muted-foreground">Campus partner since 2022</p>
          <p className="mt-5 border-t border-border pt-5 text-sm leading-relaxed text-muted-foreground">
            Students see the short description first, then the story. Be specific about what they
            will actually do — vague postings get vague applicants.
          </p>
          {existing && existingApplications > 0 && (
            <p className="mt-5 rounded-md border border-border bg-background/40 p-3 text-xs text-muted-foreground">
              {existingApplications} application{existingApplications === 1 ? "" : "s"} received.
              Editing does not remove them.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string | undefined;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="marker">{label}</span>
      <div className={cn("field mt-2.5 pb-2", error && "border-energy")}>{children}</div>
      {error ? (
        <span className="mt-2 block text-xs font-medium text-energy">{error}</span>
      ) : (
        hint && <span className="mt-2 block text-xs text-muted-foreground">{hint}</span>
      )}
    </label>
  );
}
