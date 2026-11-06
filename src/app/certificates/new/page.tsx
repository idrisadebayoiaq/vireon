"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Field, PageHeader, controlClass } from "@/components/ui";
import { useStore } from "@/lib/store";
import type { CertificateKind } from "@/lib/types";

const bodies = ["WAEC", "NECO", "NABTEB", "NBTE", "University", "Other"];

export default function NewCertificatePage() {
  const router = useRouter();
  const { createCertificate } = useStore();
  const [examBody, setExamBody] = useState("WAEC");
  const [kind, setKind] = useState<CertificateKind>("olevel");
  const [year, setYear] = useState("");
  const [examNumber, setExamNumber] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function continueToReview(event: React.FormEvent) {
    event.preventDefault();
    if (!file) {
      setError("Choose the result slip photo or PDF.");
      return;
    }
    setBusy(true);
    setError("");
    const result = await createCertificate({ kind, examBody, year, examNumber, file });
    setBusy(false);
    if (!result.id) {
      setError(result.error || "The slip was not saved.");
      return;
    }
    if (result.error) setError(result.error);
    router.push(`/certificates/${result.id}`);
  }

  return (
    <div className="max-w-xl">
      <PageHeader title="Add a result" lede="The slip is stored on your account. You review the reading before it counts." />
      <form onSubmit={continueToReview} className="space-y-4">
        <Field label="Exam body">
          <select className={controlClass} value={examBody} onChange={(event) => setExamBody(event.target.value)}>
            {bodies.map((body) => (
              <option key={body}>{body}</option>
            ))}
          </select>
        </Field>
        <Field label="Kind">
          <select className={controlClass} value={kind} onChange={(event) => setKind(event.target.value as CertificateKind)}>
            <option value="olevel">O&apos;level</option>
            <option value="ond">ND</option>
            <option value="hnd">HND</option>
            <option value="bsc">Degree</option>
            <option value="professional">Professional certificate</option>
          </select>
        </Field>
        <Field label="Year">
          <input className={controlClass} value={year} onChange={(event) => setYear(event.target.value)} />
        </Field>
        <Field label="Exam number">
          <input className={controlClass} value={examNumber} onChange={(event) => setExamNumber(event.target.value)} />
        </Field>
        <Field label="Result slip">
          <input className={controlClass} type="file" accept="image/*,.pdf" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
        </Field>
        {error ? <p className="text-sm text-[#8a3d18]">{error}</p> : null}
        <Button type="submit" disabled={busy}>{busy ? "Reading the slip…" : "Review subjects"}</Button>
      </form>
    </div>
  );
}
