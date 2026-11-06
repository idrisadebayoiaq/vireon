"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui";

export default function EmployerPage() {
  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Post a role"
        lede="A company adds the job here and puts the Gmail that should receive applications. Seekers can draft that email inside Vireon."
      />
      <p className="text-sm leading-relaxed text-[#5c564c]">
        Roles that ask for O&apos;level, or no certificate, land in the O&apos;level lane. ND, HND, and degree roles land in the profile lane.
      </p>
      <Link href="/employer/jobs/new" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#0e6b4f] px-4 text-sm font-semibold text-[#f7f3ea]">
        New job
      </Link>
    </div>
  );
}
