"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Field, PageHeader, controlClass } from "@/components/ui";
import { useStore } from "@/lib/store";
import { SAMPLE_SUBJECTS, type CertificateKind } from "@/lib/types";

const bodies = ["WAEC", "NECO", "NABTEB", "NBTE", "University", "Other"];

export default function NewCertificatePage() {
  const router = useRouter();
  const { saveCertificate } = useStore();
  const [examBody, setExamBody] = useState("WAEC");
  const [kind, setKind] = useState<CertificateKind>("olevel");
  const [year, setYear] = useState("");
  const [examNumber, setExamNumber] = useState("");
  const [fileName, setFileName] = useState("");

  function continueToReview(event: React.FormEvent) {
    event.preventDefault();
    const id = crypto.randomUUID();
    saveCertificate({
      id,
      kind,
      examBody,
      year,
      examNumber,
      fileName,
      status: "pending_review",
      subjects: SAMPLE_SUBJECTS.map((subject) => ({ ...subject, id: crypto.randomUUID() })),
    });
    router.push(`/certificates/${id}`);
  }

  return (
    <div className="max-w-xl">
      <PageHeader title="Add a result" lede="The file stays on this device for now. Review uses a fixed sample extraction." />
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
          <input
            className={controlClass}
            type="file"
            accept="image/*,.pdf"
            onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
          />
        </Field>
        <Button type="submit">Review subjects</Button>
      </form>
    </div>
  );
}
