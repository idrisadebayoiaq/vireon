import { MarketingLayout } from "@/components/marketing-layout";
import { pricingSections } from "@/lib/marketing-copy";

export default function PricingPage() {
  return (
    <MarketingLayout
      eyebrow="Pricing"
      title="Free while the desk is still being finished."
      lede="No plan to buy, no card to add. This page says what stays free and what a later paid extra would be."
      sections={pricingSections}
    />
  );
}
