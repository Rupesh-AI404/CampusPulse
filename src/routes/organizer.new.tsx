import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/campus/SiteChrome";
import { PageIntro } from "@/components/campus/PageIntro";
import { OpportunityForm } from "@/components/campus/OpportunityForm";

export const Route = createFileRoute("/organizer/new")({
  head: () => ({
    meta: [
      { title: "Create an opportunity — Campus Pulse organiser" },
      {
        name: "description",
        content:
          "Publish a new campus opportunity: describe the experience, set the deadline and requirements, and reach matched students.",
      },
      { property: "og:title", content: "Create an opportunity — Campus Pulse organiser" },
      {
        property: "og:description",
        content: "Describe the experience once — matched students see it in Explore immediately.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CreateOpportunity,
});

function CreateOpportunity() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <PageIntro
        eyebrow="Organiser"
        title="Create an opportunity."
        lede="Students decide from what you write here. Be concrete: what they do, when it closes, and what they leave with."
      />
      <section className="shell">
        <OpportunityForm />
      </section>
      <SiteFooter />
    </div>
  );
}
