import { useRef, useState } from "react";
import { Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import type { JourneyStage } from "@/data/campus";
import {
  initialsFrom,
  usePulse,
  type ProfileSkill,
  type StudentProfileData,
} from "@/lib/pulse-store";
import { cn } from "@/lib/utils";

const stages: JourneyStage[] = ["Discover", "Apply", "Participate", "Achieve"];

interface Errors {
  name?: string;
  year?: string;
  program?: string;
  statement?: string;
  skills?: string;
  interests?: string;
}

/** Edit every part of the student record. Skills and interests feed Match %. */
export function ProfileEditor({ onDone }: { onDone: () => void }) {
  const { profile, updateProfile } = usePulse();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState<string | undefined>(profile.avatar);
  const [year, setYear] = useState(profile.year);
  const [program, setProgram] = useState(profile.program);
  const [campus, setCampus] = useState(profile.campus);
  const [statement, setStatement] = useState(profile.statement);
  const [stageNow, setStageNow] = useState<JourneyStage>(profile.stageNow);
  const [interests, setInterests] = useState(profile.interests.join(", "));
  const [skills, setSkills] = useState<ProfileSkill[]>(
    profile.skills.length ? profile.skills : [{ name: "", level: 50, evidence: [] }],
  );
  const [achievements, setAchievements] = useState(
    profile.achievements.map((a) => `${a.title} | ${a.issuer} | ${a.when}`).join("\n"),
  );
  const [errors, setErrors] = useState<Errors>({});

  const pickAvatar = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("That file is not an image");
      return;
    }
    if (file.size > 1_500_000) {
      toast.error("Picture too large", { description: "Use an image under 1.5 MB." });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(file);
  };

  const setSkill = (index: number, patch: Partial<ProfileSkill>) =>
    setSkills((list) => list.map((s, i) => (i === index ? { ...s, ...patch } : s)));

  const save = () => {
    const next: Errors = {};
    const skillList = skills
      .filter((s) => s.name.trim())
      .map((s) => ({
        name: s.name.trim(),
        level: Math.max(1, Math.min(100, Math.round(s.level))),
        evidence: s.evidence.map((e) => e.trim()).filter(Boolean),
      }));
    const interestList = interests
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);

    if (name.trim().length < 2) next.name = "Enter your full name.";
    if (year.trim().length < 2) next.year = "Which year are you in?";
    if (program.trim().length < 3) next.program = "Add your programme of study.";
    if (statement.trim().length < 20) next.statement = "Write at least 20 characters about you.";
    if (skillList.length === 0) next.skills = "Add at least one skill — this drives your matches.";
    if (interestList.length === 0) next.interests = "Add at least one interest, comma separated.";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error("Check the highlighted fields");
      return;
    }

    const patch: Partial<StudentProfileData> = {
      name: name.trim(),
      initials: initialsFrom(name),
      year: year.trim(),
      program: program.trim(),
      campus: campus.trim() || "Campus",
      statement: statement.trim(),
      stageNow,
      interests: interestList,
      skills: skillList,
      achievements: achievements
        .split("\n")
        .map((line) => line.split("|").map((p) => p.trim()))
        .filter((parts) => parts[0])
        .map((parts) => ({
          title: parts[0] ?? "",
          issuer: parts[1] ?? "Campus Pulse",
          when: parts[2] ?? "",
        })),
      growth: [
        { label: "Skills on your profile", value: String(skillList.length) },
        { label: "Interests declared", value: String(interestList.length) },
        {
          label: "Achievements recorded",
          value: String(achievements.split("\n").filter((l) => l.trim()).length),
        },
      ],
    };
    if (avatar) patch.avatar = avatar;
    else patch.avatar = undefined;

    updateProfile(patch);
    toast.success("Profile saved", {
      description: "Your match percentages have been recalculated from your new skills.",
    });
    onDone();
  };

  return (
    <div className="space-y-12">
      {/* Identity */}
      <section>
        <p className="marker">Identity</p>
        <div className="mt-6 flex flex-wrap items-center gap-6">
          {avatar ? (
            <img
              src={avatar}
              alt="Your profile picture"
              className="size-16 rounded-lg border border-border-strong object-cover"
            />
          ) : (
            <span className="grid size-16 place-items-center rounded-lg border border-border-strong bg-surface font-display text-xl font-extrabold">
              {initialsFrom(name)}
            </span>
          )}
          <div className="flex flex-wrap gap-3">
            <button className="btn btn-quiet" onClick={() => fileRef.current?.click()}>
              <Upload className="size-4" />
              {avatar ? "Replace picture" : "Upload picture"}
            </button>
            {avatar && (
              <button className="btn btn-quiet" onClick={() => setAvatar(undefined)}>
                Remove
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) pickAvatar(file);
                e.target.value = "";
              }}
            />
          </div>
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <Field label="Full name" error={errors.name}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              className="w-full bg-transparent font-display text-lg font-bold tracking-tight focus:outline-none"
            />
          </Field>
          <Field label="Current journey stage">
            <select
              value={stageNow}
              onChange={(e) => setStageNow(e.target.value as JourneyStage)}
              className="w-full bg-transparent text-sm focus:outline-none"
            >
              {stages.map((s) => (
                <option key={s} value={s} className="bg-surface">
                  {s}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Bio" hint="One or two sentences on what you are building toward." error={errors.statement}>
          <textarea
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            rows={3}
            className="mt-0 w-full resize-y bg-transparent text-sm leading-relaxed focus:outline-none"
          />
        </Field>
      </section>

      {/* Education */}
      <section className="border-t border-border pt-10">
        <p className="marker">Education</p>
        <div className="mt-6 grid gap-8 sm:grid-cols-3">
          <Field label="Year" error={errors.year}>
            <input
              value={year}
              onChange={(e) => setYear(e.target.value)}
              maxLength={30}
              placeholder="Third year"
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </Field>
          <Field label="Programme" error={errors.program}>
            <input
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              maxLength={60}
              placeholder="BSc Computer Science"
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </Field>
          <Field label="Campus">
            <input
              value={campus}
              onChange={(e) => setCampus(e.target.value)}
              maxLength={40}
              placeholder="North Campus"
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </Field>
        </div>
      </section>

      {/* Skills */}
      <section className="border-t border-border pt-10">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="marker">Skills</p>
          <span className="text-xs text-muted-foreground">
            Compared against every opportunity to produce your Match %
          </span>
        </div>

        <div className="mt-6 space-y-5">
          {skills.map((s, i) => (
            <div key={i} className="panel p-5">
              <div className="grid gap-6 sm:grid-cols-[1.1fr_0.9fr]">
                <Field label="Skill">
                  <input
                    value={s.name}
                    onChange={(e) => setSkill(i, { name: e.target.value })}
                    maxLength={40}
                    placeholder="React"
                    className="w-full bg-transparent text-sm focus:outline-none"
                  />
                </Field>
                <label className="block">
                  <span className="marker">Confidence · {s.level}</span>
                  <input
                    type="range"
                    min={1}
                    max={100}
                    value={s.level}
                    onChange={(e) => setSkill(i, { level: Number(e.target.value) })}
                    className="mt-4 w-full accent-[var(--color-primary)]"
                  />
                </label>
              </div>
              <div className="mt-5">
                <Field label="Evidence" hint="Comma separated — the experiences that prove it.">
                  <input
                    value={s.evidence.join(", ")}
                    onChange={(e) => setSkill(i, { evidence: e.target.value.split(",") })}
                    placeholder="HackFest prototype, Campus Innovation Workshop"
                    className="w-full bg-transparent text-sm focus:outline-none"
                  />
                </Field>
              </div>
              {skills.length > 1 && (
                <button
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-energy"
                  onClick={() => setSkills((list) => list.filter((_, idx) => idx !== i))}
                >
                  <Trash2 className="size-3.5" />
                  Remove skill
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.skills && <p className="mt-3 text-xs font-medium text-energy">{errors.skills}</p>}
        <button
          className="btn btn-quiet mt-5"
          onClick={() => setSkills((list) => [...list, { name: "", level: 50, evidence: [] }])}
        >
          <Plus className="size-4" />
          Add skill
        </button>
      </section>

      {/* Interests + achievements */}
      <section className="border-t border-border pt-10">
        <Field
          label="Interests"
          hint="Comma separated. Interests also shape your Match %."
          error={errors.interests}
        >
          <input
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="Product design, Frontend engineering, Accessibility"
            className="w-full bg-transparent text-sm focus:outline-none"
          />
        </Field>

        <div className="mt-8">
          <Field
            label="Achievements"
            hint="One per line, as: title | issuer | when"
          >
            <textarea
              value={achievements}
              onChange={(e) => setAchievements(e.target.value)}
              rows={4}
              className="w-full resize-y bg-transparent text-sm leading-relaxed focus:outline-none"
              placeholder={"Campus Innovation Workshop | Innovation & Entrepreneurship Center | Aug 2026"}
            />
          </Field>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-8">
        <button className="btn btn-primary" onClick={save}>
          Save profile
        </button>
        <button className="btn btn-quiet" onClick={onDone}>
          Cancel
        </button>
        <span className="text-xs text-muted-foreground">
          Saved in this browser — it survives a refresh.
        </span>
      </div>
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
    <label className="mt-8 block first:mt-0 sm:mt-0">
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
