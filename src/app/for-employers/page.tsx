import { MarketingLayout } from "@/components/marketing-layout";
import { employerSections } from "@/lib/marketing-copy";

export default function ForEmployersPage() {
  return (
    <MarketingLayout
      eyebrow="Employers"
      title="Post the role, the city, and the Gmail that should receive the letter."
      lede="Certificate rules are fields, so a cashier job and a graduate seat do not land in the same pile."
      sections={employerSections}
    />
  );
}
