"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button, Field, PageHeader, controlClass } from "@/components/ui";
import { useStore } from "@/lib/store";
import { makeFields, resumeTemplates, scratchFields, templateById, templateName } from "@/lib/templates";
import type { ResumeDoc, ResumeField } from "@/lib/types";

export default function ResumeEditorPage() {
  const params = useParams<{ id: string }>();
  const { state, saveResume } = useStore();
  const record = state.resumes.find((item) => item.id === params.id);
  const [instruction, setInstruction] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!record) {
    return (
      <div>
        <PageHeader title="Document not found" />
        <Link href="/resumes" className="text-sm font-semibold text-[#0e6b4f]">
          Back to documents
        </Link>
      </div>
    );
  }

  const current: ResumeDoc = record;

  function stamp(next: ResumeDoc) {
    saveResume({
      ...next,
      updatedAt: new Date().toLocaleString("en-NG", { timeZone: "Africa/Lagos" }),
    });
  }

  function updateField(id: string, patch: Partial<ResumeField>) {
    stamp({
      ...current,
      fields: current.fields.map((field) => (field.id === id ? { ...field, ...patch } : field)),
    });
  }

  function retarget(nextId: string) {
    const source = nextId === "scratch" ? scratchFields : (templateById(nextId)?.fields ?? scratchFields);
    const template = templateById(nextId);
    stamp({
      ...current,
      templateId: nextId,
      kind: template?.document ?? current.kind,
      fields: makeFields(source).map((field) => {
        const match = current.fields.find((item) => item.label.trim().toLowerCase() === field.label.trim().toLowerCase());
        return match ? { ...field, value: match.value } : field;
      }),
    });
  }

  async function writeWithAi() {
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/resumes/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: current.kind,
          templateName: templateName(current.templateId),
          instruction,
          profile: state.profile,
          skills: state.skills,
          experiences: state.experiences,
          certificates: state.certificates.filter((item) => item.status === "confirmed"),
          fields: current.fields.map((field) => ({ label: field.label, hint: field.hint })),
        }),
      });
      const data = (await response.json()) as { values?: string[]; contactLine?: string; error?: string };
      if (!response.ok || !data.values) {
        throw new Error(data.error || "The draft did not come back.");
      }
      stamp({
        ...current,
        contactLine: data.contactLine || current.contactLine,
        fields: current.fields.map((field, index) => ({
          ...field,
          value: data.values?.[index] ?? field.value,
        })),
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The draft did not come back.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div>
        <PageHeader
          title={current.title}
          lede={`${current.kind === "cv" ? "CV" : "Resume"} · ${templateName(current.templateId)} · single column, standard headings`}
        />
        <div className="mb-4 grid gap-3 md:grid-cols-2">
          <Field label="Document title">
            <input className={controlClass} value={current.title} onChange={(event) => stamp({ ...current, title: event.target.value })} />
          </Field>
          <Field label="Contact line">
            <input
              className={controlClass}
              value={current.contactLine}
              placeholder="City, phone, email"
              onChange={(event) => stamp({ ...current, contactLine: event.target.value })}
            />
          </Field>
        </div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#5c564c]">Structure</p>
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          <button type="button" className={`whitespace-nowrap rounded-full px-3 py-2 text-sm ${current.templateId === "scratch" ? "bg-[#0e6b4f] text-white" : "bg-white"}`} onClick={() => retarget("scratch")}>
            From scratch
          </button>
          {resumeTemplates.map((template) => (
            <button
              key={template.id}
              type="button"
              className={`whitespace-nowrap rounded-full px-3 py-2 text-sm ${current.templateId === template.id ? "bg-[#0e6b4f] text-white" : "bg-white"}`}
              onClick={() => retarget(template.id)}
            >
              {template.name}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {current.fields.map((field, index) => (
            <div key={field.id} className="rounded-3xl border border-[#e4dccb] bg-[#fffdf8] p-4">
              <div className="mb-3 flex items-end gap-2">
                <div className="min-w-0 flex-1">
                  <Field label={`Field ${index + 1} heading`}>
                    <input className={controlClass} value={field.label} onChange={(event) => updateField(field.id, { label: event.target.value })} />
                  </Field>
                </div>
                <button
                  type="button"
                  className="mb-0.5 min-h-11 rounded-full px-3 text-sm text-[#8a3d18]"
                  onClick={() => stamp({ ...current, fields: current.fields.filter((item) => item.id !== field.id) })}
                  disabled={current.fields.length === 1}
                >
                  Remove
                </button>
              </div>
              {field.hint ? <p className="mb-2 text-xs leading-relaxed text-[#5c564c]">{field.hint}</p> : null}
              <textarea className={`${controlClass} min-h-28 py-3`} value={field.value} onChange={(event) => updateField(field.id, { value: event.target.value })} />
            </div>
          ))}
        </div>

        <div className="mt-4">
          <Button
            tone="secondary"
            onClick={() =>
              stamp({
                ...current,
                fields: [
                  ...current.fields,
                  { id: crypto.randomUUID(), label: "New section", value: "", hint: "Rename this heading. Write the content, or ask the AI to fill it." },
                ],
              })
            }
          >
            Add a field
          </Button>
        </div>

        <div className="mt-6 rounded-3xl border border-[#e4dccb] bg-white p-4">
          <Field label="Note for the AI">
            <textarea
              className={`${controlClass} min-h-20 py-3`}
              value={instruction}
              placeholder="Example: keep it to one page, mention the shop assistant role, and do not add a degree."
              onChange={(event) => setInstruction(event.target.value)}
            />
          </Field>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button disabled={busy} onClick={writeWithAi}>
              {busy ? "Writing…" : "Write with AI"}
            </Button>
            <Button tone="ghost" disabled>
              PDF download comes online in Part 2
            </Button>
          </div>
          {error ? <p className="mt-3 text-sm text-[#8a3d18]">{error}</p> : null}
          <p className="mt-3 text-xs leading-relaxed text-[#5c564c]">
            The draft uses only your profile, skills, experience, and confirmed certificates. It will not invent an employer or a grade. You can edit every line after it returns.
          </p>
        </div>
      </div>

      <aside className="h-fit rounded-3xl border border-[#d9d0c0] bg-white p-6 text-[#1c1915]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5c564c]">ATS preview · one column</p>
        <p className="mt-3 font-display text-3xl leading-tight">{state.profile.fullName || "Your name"}</p>
        <p className="mt-1 text-sm text-[#3d3832]">{current.contactLine || "Add a contact line"}</p>
        <div className="mt-4 space-y-4">
          {current.fields.map((field) => (
            <section key={field.id}>
              <h2 className="border-b border-[#1c1915] pb-1 text-xs font-semibold uppercase tracking-[0.12em]">{field.label || "Section"}</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{field.value || "This section is empty."}</p>
            </section>
          ))}
        </div>
      </aside>
    </div>
  );
}
