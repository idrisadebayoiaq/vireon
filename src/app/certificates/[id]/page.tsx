"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button, PageHeader, controlClass } from "@/components/ui";
import { useStore } from "@/lib/store";
import { KIND_LABEL, SAMPLE_SUBJECTS, type Certificate, type SubjectRow } from "@/lib/types";

export default function CertificateReviewPage() {
  const params = useParams<{ id: string }>();
  const { state, saveCertificate } = useStore();
  const record = state.certificates.find((item) => item.id === params.id);

  if (!record) {
    return (
      <div>
        <PageHeader title="Result not found" />
        <Link href="/certificates" className="text-sm font-semibold text-[#0e6b4f]">
          Back to certificates
        </Link>
      </div>
    );
  }

  const current: Certificate = record;

  function update(nextSubjects: SubjectRow[]) {
    saveCertificate({ ...current, subjects: nextSubjects });
  }

  return (
    <div className="max-w-3xl">
      <PageHeader
        title={`${KIND_LABEL[current.kind]} review`}
        lede={`${current.examBody} · ${current.year || "Year not set"}`}
      />
      <p className="mb-4 text-sm text-[#5c564c]">
        Grades A1–C6 count as credit, D7–E8 as pass, F9 as fail.
      </p>
      <div className="space-y-2">
        {current.subjects.map((subject) => (
          <div key={subject.id} className="grid grid-cols-[1fr_90px_auto] gap-2">
            <input
              className={controlClass}
              value={subject.subject}
              onChange={(event) =>
                update(
                  current.subjects.map((row) =>
                    row.id === subject.id ? { ...row, subject: event.target.value } : row,
                  ),
                )
              }
            />
            <input
              className={controlClass}
              value={subject.grade}
              onChange={(event) =>
                update(
                  current.subjects.map((row) =>
                    row.id === subject.id ? { ...row, grade: event.target.value } : row,
                  ),
                )
              }
            />
            <button
              type="button"
              className="min-h-11 rounded-xl px-3 text-sm"
              onClick={() => update(current.subjects.filter((row) => row.id !== subject.id))}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          tone="ghost"
          onClick={() =>
            update([...current.subjects, { id: crypto.randomUUID(), subject: "", grade: "" }])
          }
        >
          Add subject
        </Button>
        <Button
          tone="secondary"
          onClick={() =>
            update(SAMPLE_SUBJECTS.map((subject) => ({ ...subject, id: crypto.randomUUID() })))
          }
        >
          Scan again
        </Button>
        <Button onClick={() => saveCertificate({ ...current, status: "confirmed" })}>
          Confirm
        </Button>
        <Link href="/certificates" className="inline-flex min-h-11 items-center text-sm font-semibold text-[#0e6b4f]">
          Back to list
        </Link>
      </div>
      {current.status === "confirmed" ? (
        <p className="mt-4 text-sm text-[#0e6b4f]">Confirmed. This result is on your certificate list.</p>
      ) : null}
    </div>
  );
}
