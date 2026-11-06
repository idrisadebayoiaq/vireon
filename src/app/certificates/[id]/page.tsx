"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button, PageHeader, controlClass } from "@/components/ui";
import { useStore } from "@/lib/store";
import { KIND_LABEL, type Certificate, type SubjectRow } from "@/lib/types";

export default function CertificateReviewPage() {
  const params = useParams<{ id: string }>();
  const { state, saveCertificate } = useStore();
  const record = state.certificates.find((item) => item.id === params.id);
  const [draft, setDraft] = useState<Certificate | null>(record ?? null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmed, setConfirmed] = useState(record?.status === "confirmed");

  const loadedFor = useRef("");

  useEffect(() => {
    if (!record || loadedFor.current === record.id) return;
    loadedFor.current = record.id;
    setDraft(record);
    setConfirmed(record.status === "confirmed");
  }, [record]);

  if (!record || !draft) {
    return (
      <div>
        <PageHeader title="Result not found" />
        <Link href="/certificates" className="text-sm font-semibold text-[#0e6b4f]">
          Back to certificates
        </Link>
      </div>
    );
  }

  const current = draft;

  function update(nextSubjects: SubjectRow[]) {
    setDraft({ ...current, subjects: nextSubjects });
  }

  async function scanAgain() {
    setBusy(true);
    setError("");
    const response = await fetch("/api/certificates/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: current.id }),
    });
    const data = (await response.json()) as { subjects?: SubjectRow[]; examBody?: string; year?: string; error?: string };
    setBusy(false);
    if (!response.ok) {
      setError(data.error || "The slip could not be read again.");
      return;
    }
    const next = {
      ...current,
      examBody: data.examBody || current.examBody,
      year: data.year || current.year,
      subjects: data.subjects ?? [],
      status: current.status,
    };
    setDraft(next);
    if (record?.status !== "confirmed") {
      const message = await saveCertificate({ ...next, status: "pending_review" });
      if (message) setError(message);
    }
  }

  async function confirm() {
    setBusy(true);
    const message = await saveCertificate({ ...current, status: "confirmed" });
    setBusy(false);
    if (message) {
      setError(message);
      return;
    }
    setConfirmed(true);
  }

  return (
    <div className="max-w-3xl">
      <PageHeader title={`${KIND_LABEL[current.kind]} review`} lede={`${current.examBody} · ${current.year || "Year not set"}`} />
      <p className="mb-4 text-sm text-[#5c564c]">
        Grades A1–C6 count as credit, D7–E8 as pass, F9 as fail. Confirm saves this table. A new scan of a confirmed result stays here until you confirm it.
      </p>
      <div className="space-y-2">
        {current.subjects.map((subject) => (
          <div key={subject.id} className="grid grid-cols-[1fr_90px_auto] gap-2">
            <input
              className={controlClass}
              value={subject.subject}
              onChange={(event) =>
                update(current.subjects.map((row) => (row.id === subject.id ? { ...row, subject: event.target.value } : row)))
              }
            />
            <input
              className={controlClass}
              value={subject.grade}
              onChange={(event) =>
                update(current.subjects.map((row) => (row.id === subject.id ? { ...row, grade: event.target.value } : row)))
              }
            />
            <button type="button" className="min-h-11 rounded-xl px-3 text-sm" onClick={() => update(current.subjects.filter((row) => row.id !== subject.id))}>
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button tone="ghost" onClick={() => update([...current.subjects, { id: crypto.randomUUID(), subject: "", grade: "" }])}>
          Add subject
        </Button>
        <Button tone="secondary" disabled={busy} onClick={scanAgain}>
          {busy ? "Reading…" : "Scan again"}
        </Button>
        <Button disabled={busy} onClick={confirm}>
          Confirm
        </Button>
        <Link href="/certificates" className="inline-flex min-h-11 items-center text-sm font-semibold text-[#0e6b4f]">
          Back to list
        </Link>
      </div>
      {error ? <p className="mt-4 text-sm text-[#8a3d18]">{error}</p> : null}
      {confirmed ? <p className="mt-4 text-sm text-[#0e6b4f]">Confirmed. This result is saved on your account.</p> : null}
    </div>
  );
}
