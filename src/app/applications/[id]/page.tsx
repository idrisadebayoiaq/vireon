"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Field, PageHeader, controlClass } from "@/components/ui";
import { useStore } from "@/lib/store";
import { STATUS_LABEL, type ApplicationStatus } from "@/lib/types";

const statuses = Object.keys(STATUS_LABEL) as ApplicationStatus[];

export default function ApplicationDetailPage() {
  const params = useParams<{ id: string }>();
  const { state, jobs, saveApplication } = useStore();
  const application = state.applications.find((item) => item.id === params.id);
  const job = jobs.find((item) => item.id === application?.jobId);
  const resume = state.resumes.find((item) => item.id === application?.resumeId);

  if (!application) {
    return (
      <div>
        <PageHeader title="Application not found" />
        <Link href="/applications" className="text-sm font-semibold text-[#0e6b4f]">
          Back to applications
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <PageHeader title={job?.title || "Application"} lede={job ? `${job.company} · ${job.city}` : "Job removed from this session"} />
      <Field label="Status">
        <select
          className={controlClass}
          value={application.status}
          onChange={(event) =>
            saveApplication({ ...application, status: event.target.value as ApplicationStatus })
          }
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABEL[status]}
            </option>
          ))}
        </select>
      </Field>
      <dl className="mt-4 space-y-2 text-sm">
        <div>Resume: {resume?.title || "None selected"}</div>
        <div>To: {application.to || "No address"}</div>
        <div>Subject: {application.subject || "No subject"}</div>
      </dl>
      <p className="mt-4 whitespace-pre-wrap rounded-2xl bg-white p-4 text-sm leading-relaxed">
        {application.body || "No email text."}
      </p>
    </div>
  );
}
