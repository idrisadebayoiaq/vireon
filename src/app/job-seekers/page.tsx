import { MarketingLayout } from "@/components/marketing-layout";
import { seekerSections } from "@/lib/marketing-copy";

export default function JobSeekersPage() {
  return (
    <MarketingLayout
      eyebrow="Job seekers"
      title="O'level is a real way in, not a placeholder until a degree arrives."
      lede="The desk, the grade rules, the city filter, and the resume editor are aimed at the jobs people in Nigeria actually apply for."
      sections={seekerSections}
    />
  );
}
