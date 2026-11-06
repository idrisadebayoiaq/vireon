import { MarketingLayout } from "@/components/marketing-layout";
import { homeSections } from "@/lib/marketing-copy";

export default function HomePage() {
  return (
    <MarketingLayout
      eyebrow="Nigeria job desk"
      title="Work that fits the certificate you have today."
      lede="Vireon keeps an O'level shortlist beside the roles that need a higher qualification, then helps you write the resume and hold the application until you send it."
      sections={homeSections}
    />
  );
}
