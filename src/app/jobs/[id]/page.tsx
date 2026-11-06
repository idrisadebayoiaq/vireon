"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button, Field, PageHeader, controlClass } from "@/components/ui";
import { useStore } from "@/lib/store";
import { qualificationLine } from "@/lib/types";

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const { jobs, state, saveApplication } = useStore();
  const job = jobs.find((item) => item.id === params.id);
  const [panel, setPanel] = useState<"email" | "external" | null>(null);
  const [resumeId, setResumeId] = useState(state.resumes[0]?.id ?? "");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [notice, setNotice] = useState("");
  const [drafting, setDrafting] = useState(false);
  const [draftId] = useState(() => crypto.randomUUID());

  if (!job) {
    return (
      <div>
        <PageHeader title="Job not found" />
        <Link href="/jobs" className="text-sm font-semibold text-[#0e6b4f]">
          Back to jobs
        </Link>
      </div>
    );
  }

  async function draftFromProfile() {
    setDrafting(true);
    setNotice("");
    const response = await fetch("/api/applications/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: job!.id, resumeId }),
    });
    const data = (await response.json()) as { subject?: string; body?: string; error?: string };
    setDrafting(false);
    if (!response.ok || !data.subject || !data.body) {
      setNotice(data.error || "The draft did not come back.");
      return;
    }
    setSubject(data.subject);
    setBody(data.body);
  }

  async function saveDraft() {
    const message = await saveApplication({
      id: draftId,
      jobId: job!.id,
      resumeId,
      channel: "email",
      status: "draft",
      subject,
      body,
      to: job!.applyEmail,
    });
    setNotice(message ?? "Draft saved on your account.");
  }

  async function sendDraft() {
    const saved = await saveApplication({
      id: draftId,
      jobId: job!.id,
      resumeId,
      channel: "email",
      status: "draft",
      subject,
      body,
      to: job!.applyEmail,
    });
    if (saved) {
      setNotice(saved);
      return;
    }
    const response = await fetch("/api/applications/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: draftId }),
    });
    const data = (await response.json()) as { error?: string };
    setNotice(data.error || "Sent.");
  }

  return (
    <div className="max-w-3xl">
      <PageHeader eyebrow={job.company} title={job.title} lede={`${job.city}, ${job.state}`} />
      <div className="mb-4 flex flex-wrap gap-2 text-sm">
        <span className="rounded-full bg-[#efe8da] px-2 py-1">{job.lane === "olevel" ? "O'level" : "Profile"}</span>
        <span className="rounded-full bg-[#efe8da] px-2 py-1">{qualificationLine(job)}</span>
        <span className="rounded-full bg-[#efe8da] px-2 py-1">{job.salary}</span>
      </div>
      <p className="text-sm leading-relaxed">{job.description}</p>
      <p className="mt-4 text-sm">{job.matchReason}</p>
      <p className="mt-1 text-sm text-[#8a3d18]">Missing: {job.missingSkills}</p>
      <dl className="mt-4 space-y-1 text-sm text-[#3d3832]">
        <div>Work mode: {job.workMode}</div>
        <div>Type: {job.employmentType}</div>
        <div>Subjects: {job.requiredSubjects || "None listed"}</div>
        <div>Skills: {job.requiredSkills || "None listed"}</div>
      </dl>
      <div className="mt-6 flex flex-wrap gap-2">
        <Button onClick={() => setPanel("email")}>Apply by email</Button>
        <Button tone="ghost" onClick={() => setPanel("external")}>
          Open original posting
        </Button>
      </div>

      {panel === "email" ? (
        <section className="mt-6 rounded-3xl border border-[#e4dccb] bg-[#fffdf8] p-5">
          <h2 className="font-display text-2xl">Application email</h2>
          <div className="mt-4 space-y-4">
            <Field label="To">
              <input className={controlClass} value={job.applyEmail || "No email on this role"} readOnly />
            </Field>
            <Field label="Resume">
              <select className={controlClass} value={resumeId} onChange={(event) => setResumeId(event.target.value)}>
                <option value="">No resume yet</option>
                {state.resumes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Subject">
              <input className={controlClass} value={subject} onChange={(event) => setSubject(event.target.value)} />
            </Field>
            <Field label="Body">
              <textarea className={`${controlClass} min-h-40 py-3`} value={body} onChange={(event) => setBody(event.target.value)} />
            </Field>
            <div className="flex flex-wrap gap-2">
              <Button tone="secondary" disabled={drafting} onClick={draftFromProfile}>
                {drafting ? "Writing…" : "Draft with my details"}
              </Button>
              <Button onClick={saveDraft}>Save draft</Button>
              <Button tone="ghost" onClick={sendDraft}>
                Send
              </Button>
            </div>
            {notice ? <p className="text-sm text-[#0e6b4f]">{notice}</p> : null}
          </div>
        </section>
      ) : null}

      {panel === "external" ? (
        <section className="mt-6 rounded-3xl border border-[#e4dccb] bg-[#fffdf8] p-5">
          <h2 className="font-display text-2xl">Original posting</h2>
          <Field label="Resume to take with you">
            <select className={`${controlClass} mt-2`} value={resumeId} onChange={(event) => setResumeId(event.target.value)}>
              <option value="">No resume yet</option>
              {state.resumes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </Field>
          {job.applyUrl ? (
            <button
              type="button"
              className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-[#0e6b4f]"
              onClick={async () => {
                const message = await saveApplication({
                  id: crypto.randomUUID(),
                  jobId: job.id,
                  resumeId,
                  channel: "external",
                  status: "opened_external",
                  subject: "",
                  body: "",
                  to: "",
                });
                setNotice(message ?? "Recorded as opened on the company site.");
                window.open(job.applyUrl, "_blank", "noopener,noreferrer");
              }}
            >
              Open posting
            </button>
          ) : (
            <p className="mt-4 text-sm">This employer only left an email.</p>
          )}
        </section>
      ) : null}
    </div>
  );
}
