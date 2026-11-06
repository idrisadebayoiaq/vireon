"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { useStore } from "@/lib/store";
import { STATUS_LABEL, type ApplicationStatus } from "@/lib/types";

const order: ApplicationStatus[] = [
  "draft",
  "sent",
  "opened_external",
  "replied",
  "interview",
  "offer",
  "rejected",
];

export default function ApplicationsPage() {
  const { state, jobs } = useStore();

  return (
    <div>
      <PageHeader title="Applications" lede="Drafts stay on this device until mail is connected." />
      {order.map((status) => {
        const items = state.applications.filter((item) => item.status === status);
        return (
          <section key={status} className="mb-6">
            <h2 className="mb-2 font-display text-2xl">{STATUS_LABEL[status]}</h2>
            {items.length === 0 ? (
              <p className="text-sm text-[#5c564c]">None</p>
            ) : (
              <ul className="space-y-2">
                {items.map((item) => {
                  const job = jobs.find((jobItem) => jobItem.id === item.jobId);
                  return (
                    <li key={item.id}>
                      <Link href={`/applications/${item.id}`} className="block rounded-2xl border border-[#e4dccb] bg-[#fffdf8] p-4">
                        <p className="font-medium">{job?.title || "Job"}</p>
                        <p className="text-sm text-[#5c564c]">{item.subject || "No subject yet"}</p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
