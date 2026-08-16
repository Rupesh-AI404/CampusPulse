import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/campus/SiteChrome";
import { PageIntro } from "@/components/campus/PageIntro";
import { OpportunityCard } from "@/components/campus/OpportunityCard";
import { categories, type OpportunityCategory } from "@/data/campus";
import { usePulse } from "@/lib/pulse-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore opportunities — Campus Pulse" },
      {
        name: "description",
        content:
          "Browse internships, hackathons, workshops, competitions, clubs and career events, sorted by how well they match your skills and interests.",
      },
      { property: "og:title", content: "Explore opportunities — Campus Pulse" },
      {
        property: "og:description",
        content: "Discovery that feels like exploration, not a database of postings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Explore,
});

type SortKey = "match" | "deadline";

function Explore() {
  const { publicOpportunities: opportunities } = usePulse();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<OpportunityCategory | "All">("All");
  const [sort, setSort] = useState<SortKey>("match");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return opportunities
      .filter((o) => (active === "All" ? true : o.category === active))
      .filter((o) =>
        q === ""
          ? true
          : [o.title, o.tagline, o.organizer.name, ...o.skills]
              .join(" ")
              .toLowerCase()
              .includes(q),
      )
      .sort((a, b) => (sort === "match" ? b.match - a.match : a.daysLeft - b.daysLeft));
  }, [query, active, sort, opportunities]);

  const [lead, ...others] = results;
  const strongCount = results.filter((o) => o.match >= 85).length;
  const closingCount = results.filter((o) => o.daysLeft <= 7).length;

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <PageIntro
        eyebrow="Stage one — Discover"
        title="Wander first. Decide second."
        lede="Every opportunity here was posted by the people running it. Filter by the shape of experience you want, not by a job title."
        aside={
          <div className="flex items-center gap-6 text-sm">
            <span className="text-muted-foreground">Sort by</span>
            {(["match", "deadline"] as SortKey[]).map((k) => (
              <button
                key={k}
                onClick={() => setSort(k)}
                className={cn(
                  "underline-sweep font-semibold transition-colors",
                  sort === k ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {k === "match" ? "Best match" : "Closing soonest"}
              </button>
            ))}
          </div>
        }
      />

      {/* Search + category filtering */}
      <div className="shell">
        <label className="field flex items-center gap-3 pb-4">
          <Search className="size-4 flex-none text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a skill, a society, an ambition — try “React” or “accessibility”"
            className="w-full bg-transparent font-display text-lg font-semibold tracking-tight placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:tracking-normal placeholder:text-muted-foreground focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="flex-none text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </label>

        <div className="mt-6 flex flex-wrap gap-2">
          <FilterPill
            label="Everything"
            count={opportunities.length}
            active={active === "All"}
            onClick={() => setActive("All")}
          />
          {categories.map((c) => (
            <FilterPill
              key={c.name}
              label={c.name}
              count={opportunities.filter((o) => o.category === c.name).length}
              active={active === c.name}
              onClick={() => setActive(c.name)}
            />
          ))}
        </div>

        {active !== "All" && (
          <p className="mt-6 max-w-md text-sm text-muted-foreground">
            {categories.find((c) => c.name === active)?.note}
          </p>
        )}
      </div>

      <section className="shell mt-12">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-b border-border pb-5">
          <p className="marker">
            {results.length} {results.length === 1 ? "opportunity" : "opportunities"} for you
          </p>
          {results.length > 0 && (
            <p className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-growth" />
                {strongCount} strong match{strongCount === 1 ? "" : "es"}
              </span>
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-energy" />
                {closingCount} closing this week
              </span>
            </p>
          )}
        </div>

        {results.length === 0 ? (
          <EmptyState onReset={() => { setQuery(""); setActive("All"); }} />
        ) : (
          <div className="mt-8 space-y-5">
            {lead && (
              <div className="animate-rise">
                <OpportunityCard opportunity={lead} emphasis />
              </div>
            )}
            <div className="grid gap-5 md:grid-cols-2">
              {others.map((o, i) => (
                <div
                  key={o.id}
                  className="animate-rise"
                  style={{ animationDelay: `${(i + 1) * 60}ms` }}
                >
                  <OpportunityCard opportunity={o} />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="panel panel-signal mt-8 flex flex-col items-start gap-6 p-10 md:flex-row md:items-center md:justify-between">
      <div className="max-w-md">
        <div className="flex items-end gap-1" aria-hidden>
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className="w-1 rounded-full bg-border-strong"
              style={{ height: `${5 + ((i * 3) % 9)}px` }}
            />
          ))}
        </div>
        <p className="mt-5 font-display text-lg font-bold tracking-tight">No signal on that one.</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Nothing matches your search yet. Organisers post new opportunities every week — try a
          broader term, or start from everything.
        </p>
      </div>
      <button onClick={onReset} className="btn btn-quiet">
        Show everything
      </button>
    </div>
  );
}

function FilterPill({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-200",
        active
          ? "border-primary/70 bg-primary/12 text-foreground"
          : "border-border text-muted-foreground hover:border-border-strong hover:bg-surface hover:text-foreground",
      )}
      aria-pressed={active}
    >
      {label}
      <span className="text-xs tabular-nums opacity-60">{count}</span>
    </button>
  );
}
