import { MarketingLayout } from "@/components/marketing-layout";
import { howSections } from "@/lib/marketing-copy";

export default function HowItWorksPage() {
  return (
    <MarketingLayout
      eyebrow="How it works"
      title="From a result slip to a letter you still get to edit."
      lede="Six steps, in the order the dashboard uses them. The live mail connection and the morning scheduler come after this build."
      sections={howSections}
    />
  );
}
