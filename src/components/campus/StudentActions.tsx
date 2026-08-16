import { useState } from "react";
import { Bookmark, BookmarkCheck, Check } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePulse, type StoredOpportunity } from "@/lib/pulse-store";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBits";

interface FormErrors {
  motivation?: string;
  experience?: string;
  note?: string;
}

/** Save / unsave — persisted, reversible, and always says what happened. */
export function SaveButton({
  id,
  title,
  variant = "icon",
  className,
}: {
  id: string;
  title: string;
  variant?: "icon" | "full";
  className?: string;
}) {
  const { isSaved, toggleSave } = usePulse();
  const saved = isSaved(id);

  const onToggle = () => {
    const nowSaved = toggleSave(id);
    if (nowSaved) {
      toast.success("Saved", { description: `${title} is in your Saved list.` });
    } else {
      toast("Removed from Saved", { description: `${title} is no longer saved.` });
    }
  };

  if (variant === "full") {
    return (
      <button
        onClick={onToggle}
        aria-pressed={saved}
        className={cn("btn btn-quiet w-full", saved && "border-growth/60 text-growth", className)}
      >
        {saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
        {saved ? "Saved — remove" : "Save for later"}
      </button>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from saved` : `Save ${title}`}
      title={saved ? "Remove from Saved" : "Save for later"}
      className={cn(
        "relative z-10 grid size-9 place-items-center rounded-md border transition-colors",
        saved
          ? "border-growth/60 bg-growth/10 text-growth"
          : "border-border text-muted-foreground hover:border-border-strong hover:bg-surface-raised hover:text-foreground",
        className,
      )}
    >
      {saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
    </button>
  );
}

/**
 * The application itself — a real, validated submission that lands in the
 * organiser's review queue and the student's My Applications.
 */
export function ApplyPanel({ opportunity }: { opportunity: StoredOpportunity }) {
  const { applicationFor, submitApplication } = usePulse();
  const existing = applicationFor(opportunity.id);
  const [open, setOpen] = useState(false);
  const [motivation, setMotivation] = useState("");
  const [experience, setExperience] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  if (existing) {
    return (
      <div className="rounded-md border border-border-strong bg-surface p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold tracking-wide text-muted-foreground">
            Your application
          </span>
          <StatusBadge status={existing.status} />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Submitted {new Date(existing.appliedAt).toLocaleDateString("en-GB")}. You can only apply
          once — track it in Applications.
        </p>
      </div>
    );
  }

  const submit = () => {
    const next: FormErrors = {};
    if (motivation.trim().length < 30)
      next.motivation = "Tell the organiser why in at least 30 characters.";
    if (motivation.trim().length > 600) next.motivation = "Keep this under 600 characters.";
    if (experience.trim().length < 10)
      next.experience = "Add one line of relevant experience or coursework.";
    if (experience.trim().length > 400) next.experience = "Keep this under 400 characters.";
    if (note.trim().length > 200) next.note = "Keep the note under 200 characters.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    const result = submitApplication(opportunity.id, { motivation, experience, note });
    setSubmitting(false);
    if (!result.ok) {
      toast.error("Could not submit", { description: result.message });
      return;
    }
    setOpen(false);
    toast.success("Application submitted", {
      description: `${opportunity.title} is now under review. Find it in Applications.`,
    });
  };

  return (
    <>
      <button className="btn btn-primary w-full" onClick={() => setOpen(true)}>
        Apply for this
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg border-border-strong bg-surface">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-extrabold tracking-tight">
              Apply — {opportunity.title}
            </DialogTitle>
            <DialogDescription>
              {opportunity.organizer.name} reads every application. Closes {opportunity.deadline}.
            </DialogDescription>
          </DialogHeader>

          {opportunity.requirements && opportunity.requirements.length > 0 && (
            <ul className="space-y-1.5 rounded-md border border-border bg-background/40 p-3">
              {opportunity.requirements.map((r) => (
                <li key={r} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Check className="mt-0.5 size-3.5 flex-none text-growth" />
                  {r}
                </li>
              ))}
            </ul>
          )}

          <div className="space-y-5">
            <Field
              label="Why this opportunity?"
              hint="A short motivation — what you want from it."
              error={errors.motivation}
            >
              <textarea
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                rows={3}
                maxLength={600}
                className="w-full resize-none bg-transparent text-sm leading-relaxed focus:outline-none"
                placeholder="I want to learn how a product team decides what to build…"
              />
            </Field>
            <Field
              label="Relevant experience"
              hint="Coursework, projects, societies — anything real."
              error={errors.experience}
            >
              <textarea
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                rows={2}
                maxLength={400}
                className="w-full resize-none bg-transparent text-sm leading-relaxed focus:outline-none"
                placeholder="Built the society events site; shipped a component library."
              />
            </Field>
            <Field label="Anything else (optional)" error={errors.note}>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={200}
                className="w-full bg-transparent text-sm focus:outline-none"
                placeholder="Availability, accessibility needs…"
              />
            </Field>
          </div>

          <DialogFooter className="gap-2 sm:justify-between">
            <button className="btn btn-quiet" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={submit} disabled={submitting}>
              {submitting ? "Submitting…" : "Submit application"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
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
      <div
        className={cn(
          "field mt-2.5 pb-2",
          error && "border-energy",
        )}
      >
        {children}
      </div>
      {error ? (
        <span className="mt-2 block text-xs font-medium text-energy">{error}</span>
      ) : (
        hint && <span className="mt-2 block text-xs text-muted-foreground">{hint}</span>
      )}
    </label>
  );
}
