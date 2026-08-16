import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/campus/SiteChrome";
import { PageIntro } from "@/components/campus/PageIntro";
import { OpportunityForm } from "@/components/campus/OpportunityForm";
import { usePulse } from "@/lib/pulse-store";

export const Route = createFileRoute("/organizer/edit/$id")({
  head: () => ({
    meta: [
      { title: "Edit opportunity — Campus Pulse organiser" },
      {
        name: "description",
        content:
          "Update an opportunity you published on Campus Pulse. Applications already received are preserved.",
      },
      { property: "og:title", content: "Edit opportunity — Campus Pulse organiser" },
      {
        property: "og:description",
        content: "Change the details students see without losing the applicants you already have.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EditOpportunity,
});

function EditOpportunity() {
  const { id } = Route.useParams();
  const { getOpportunity, ready } = usePulse();
  const existing = getOpportunity(id);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <PageIntro
        eyebrow="Organiser"
        title={existing ? `Edit — ${existing.title}` : "Edit opportunity"}
        lede="Changes are saved to this browser and shown to students straight away. Applications stay attached."
      />
      <section className="shell">
        {!ready ? (
          <div className="loading-track h-40 rounded-md" />
        ) : existing ? (
          <OpportunityForm existing={existing} />
        ) : (
          <div className="panel p-8">
            <p className="font-display text-lg font-bold tracking-tight">
              That opportunity no longer exists.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              It may have been archived. Everything you still run is listed under My opportunities.
            </p>
            <Link to="/organizer/opportunities" className="btn btn-quiet mt-6">
              Back to my opportunities
            </Link>
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
