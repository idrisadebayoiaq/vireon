"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { useStore } from "@/lib/store";
import { templateName } from "@/lib/templates";

export default function ResumesPage() {
  const { state } = useStore();

  return (
    <div>
      <PageHeader
        title="Resume and CV"
        lede="Ten ATS templates, or a document you build from scratch. Edit every field, add your own, and write with AI."
      />
      <Link href="/resumes/new" className="inline-flex min-h-11 items-center rounded-full bg-[#0e6b4f] px-4 text-sm font-semibold text-[#f7f3ea]">
        New document
      </Link>
      {state.resumes.length === 0 ? (
        <p className="mt-6 text-sm text-[#5c564c]">No documents yet.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {state.resumes.map((resume) => (
            <li key={resume.id}>
              <Link href={`/resumes/${resume.id}`} className="block rounded-2xl border border-[#e4dccb] bg-[#fffdf8] p-4">
                <p className="font-display text-2xl">{resume.title}</p>
                <p className="text-sm text-[#5c564c]">
                  {resume.kind === "cv" ? "CV" : "Resume"} · {templateName(resume.templateId)} · {resume.fields.length} fields · {resume.updatedAt}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
