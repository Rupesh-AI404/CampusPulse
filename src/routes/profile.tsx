import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Pencil, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader, SiteFooter } from "@/components/campus/SiteChrome";
import { StageChip } from "@/components/campus/PageIntro";
import { StageTrack } from "@/components/campus/StageTrack";
import { ProfileEditor } from "@/components/campus/ProfileEditor";
import { journeyStages } from "@/data/campus";
import { usePulse } from "@/lib/pulse-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your student profile — Campus Pulse" },
      {
        name: "description",
        content:
          "A student identity built from evidence: skills strengthened, interests declared, achievements earned across campus experiences.",
      },
      { property: "og:title", content: "Your student profile — Campus Pulse" },
      {
        property: "og:description",
        content: "Skills, interests, achievements and progress — one record of a student's growth.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { profile, resetProfile } = usePulse();
  const [editing, setEditing] = useState(false);
  const currentIndex = journeyStages.findIndex((s) => s.stage === profile.stageNow);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Identity */}
      <header className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 grid-canvas" aria-hidden />
        <div className="shell relative pt-16 pb-14">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="animate-rise">
              <div className="flex items-center gap-5">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={`${profile.name}'s profile picture`}
                    className="size-16 flex-none rounded-lg border border-border-strong object-cover"
                  />
                ) : (
                  <span className="grid size-16 flex-none place-items-center rounded-lg border border-border-strong bg-surface font-display text-xl font-extrabold">
                    {profile.initials}
                  </span>
                )}
                <div>
                  <p className="marker">
                    {profile.year} · {profile.campus}
                  </p>
                  <h1 className="mt-3 type-heading">{profile.name}</h1>
                </div>
              </div>
              <p className="mt-7 max-w-xl type-lede">{profile.statement}</p>
              <p className="mt-4 text-sm text-muted-foreground">{profile.program}</p>
            </div>
            <div className="flex flex-col items-start gap-4 animate-rise md:items-end">
              <StageChip stage={`Currently — ${profile.stageNow}`} />
              <div className="flex flex-wrap gap-3">
                <button className="btn btn-primary" onClick={() => setEditing((v) => !v)}>
                  <Pencil className="size-4" />
                  {editing ? "Close editor" : "Edit profile"}
                </button>
                {profile.customized && (
                  <button
                    className="btn btn-quiet"
                    onClick={() => {
                      resetProfile();
                      setEditing(false);
                      toast("Profile reset", { description: "The demo record is back." });
                    }}
                  >
                    <RotateCcw className="size-4" />
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          <dl className="mt-14 grid gap-8 border-t border-border pt-8 sm:grid-cols-3">
            {profile.growth.map((g) => (
              <div key={g.label}>
                <dt className="type-figure text-4xl">{g.value}</dt>
                <dd className="mt-2 text-sm text-muted-foreground">{g.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      {editing ? (
        <section className="shell border-t border-border py-14">
          <p className="marker">Edit profile</p>
          <h2 className="mt-4 type-section">Your record, your words.</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Skills and interests are compared against every opportunity — saving here recalculates
            your Match % across Explore, saved items and applications.
          </p>
          <div className="mt-10">
            <ProfileEditor onDone={() => setEditing(false)} />
          </div>
        </section>
      ) : (
        <>
          {/* Journey position */}
          <section className="shell py-14">
            <p className="marker">Journey position</p>
            <StageTrack
              className="mt-8"
              dense
              items={journeyStages.map((s, i) => ({
                stage: s.stage,
                state: i < currentIndex ? "done" : i === currentIndex ? "active" : "upcoming",
              }))}
            />
          </section>

          <div className="shell grid gap-16 border-t border-border pt-14 lg:grid-cols-[1.05fr_0.95fr]">
            {/* Skills, tied to the experiences that produced them */}
            <section>
              <div className="flex items-baseline justify-between border-b border-border pb-5">
                <h2 className="type-section">Skills</h2>
                <span className="text-xs text-muted-foreground">Earned through experiences</span>
              </div>
              <div className="mt-8 space-y-9">
                {profile.skills.map((s) => (
                  <div key={s.name}>
                    <div className="flex items-baseline justify-between">
                      <span className="font-display text-base font-bold tracking-tight">
                        {s.name}
                      </span>
                      <span className="type-figure text-xs text-muted-foreground">{s.level}</span>
                    </div>
                    <div className="mt-3 flex items-end gap-1" aria-hidden>
                      {Array.from({ length: 24 }).map((_, i) => (
                        <span
                          key={i}
                          className={cn(
                            "flex-1 rounded-full",
                            i < Math.round((s.level / 100) * 24)
                              ? s.level >= 70
                                ? "bg-growth"
                                : "bg-primary"
                              : "bg-border-strong",
                          )}
                          style={{ height: `${6 + ((i * 5) % 11)}px` }}
                        />
                      ))}
                    </div>
                    {s.evidence.length > 0 && (
                      <ul className="mt-3.5 flex flex-wrap gap-x-4 gap-y-1.5">
                        {s.evidence.map((e) => (
                          <li
                            key={e}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground"
                          >
                            <span className="size-1 rounded-full bg-growth" />
                            {e}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-14">
                <h2 className="type-section">Interests</h2>
                <div className="mt-5 flex flex-wrap gap-2">
                  {profile.interests.map((i) => (
                    <span
                      key={i}
                      className="rounded-full border border-border px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
                    >
                      {i}
                    </span>
                  ))}
                </div>
                <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Interests shape your match scores. Change one and the explore page rearranges
                  itself.
                </p>
              </div>
            </section>

            {/* Achievements */}
            <section>
              <div className="flex items-baseline justify-between border-b border-border pb-5">
                <h2 className="type-section">Achievements</h2>
                <span className="text-xs text-muted-foreground">Evidence, not claims</span>
              </div>
              {profile.achievements.length > 0 ? (
                <ol className="mt-8 space-y-8">
                  {profile.achievements.map((a, i) => (
                    <li
                      key={`${a.title}-${i}`}
                      className="flex gap-4 animate-rise"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <span className="mt-0.5 grid size-9 flex-none place-items-center rounded-md border border-border-strong bg-surface">
                        <Award className="size-4 text-energy" />
                      </span>
                      <div>
                        <p className="font-display text-base font-bold tracking-tight">{a.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {a.issuer}
                          {a.when ? ` · ${a.when}` : ""}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-8 text-sm text-muted-foreground">
                  Nothing recorded yet. Complete an experience, or add achievements from the profile
                  editor.
                </p>
              )}

              <div className="panel panel-signal mt-12 p-6">
                <p className="font-display text-base font-bold tracking-tight">
                  Keep the record growing.
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Every opportunity you finish adds a line to this page — and every skill you add
                  here sharpens what Explore shows you.
                </p>
                <Link to="/explore" className="btn btn-primary mt-5">
                  Explore what fits
                </Link>
              </div>
            </section>
          </div>
        </>
      )}

      <SiteFooter />
    </div>
  );
}
