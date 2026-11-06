"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, PageHeader } from "@/components/ui";
import { useStore } from "@/lib/store";
import { makeFields, resumeTemplates, scratchFields } from "@/lib/templates";

export default function NewResumePage() {
  const router = useRouter();
  const { saveResume } = useStore();
  const [mode, setMode] = useState<"template" | "scratch">("template");
  const [templateId, setTemplateId] = useState(resumeTemplates[0].id);

  function create() {
    const id = crypto.randomUUID();
    const template = resumeTemplates.find((item) => item.id === templateId) ?? resumeTemplates[0];
    const scratch = mode === "scratch";
    saveResume({
      id,
      kind: scratch ? "resume" : template.document,
      templateId: scratch ? "scratch" : template.id,
      title: scratch ? "Untitled document" : template.document === "cv" ? template.name : `${template.name} resume`,
      updatedAt: new Date().toLocaleString("en-NG", { timeZone: "Africa/Lagos" }),
      contactLine: "",
      fields: makeFields(scratch ? scratchFields : template.fields),
    });
    router.push(`/resumes/${id}`);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Resume"
        title="Start a resume or CV"
        lede="Use one of the ten ATS templates, or open a blank page and name every section yourself. Both can be written with AI after you open the editor."
      />
      <div className="mb-5 flex gap-2">
        <button type="button" className={`rounded-full px-3 py-2 text-sm font-semibold ${mode === "template" ? "bg-[#1c1915] text-white" : "bg-white"}`} onClick={() => setMode("template")}>
          Use a template
        </button>
        <button type="button" className={`rounded-full px-3 py-2 text-sm font-semibold ${mode === "scratch" ? "bg-[#1c1915] text-white" : "bg-white"}`} onClick={() => setMode("scratch")}>
          Start from scratch
        </button>
      </div>

      {mode === "scratch" ? (
        <div className="max-w-xl rounded-3xl border border-[#e4dccb] bg-[#fffdf8] p-5">
          <p className="font-display text-3xl">Blank page</p>
          <p className="mt-3 text-sm leading-relaxed text-[#5c564c]">
            You get a headline, a summary, and one empty section. Rename them, add the fields an employer asked for, and write every line yourself or with AI. The page stays one column so an applicant tracking system can read it.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>No columns, icons, or tables.</li>
            <li>Every heading is yours to rename.</li>
            <li>Add a field for salary, referees, or a portfolio link.</li>
          </ul>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {resumeTemplates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => setTemplateId(template.id)}
              className={`rounded-3xl border p-4 text-left ${templateId === template.id ? "border-[#0e6b4f] bg-[#e7f3ee]" : "border-[#e4dccb] bg-[#fffdf8]"}`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a3d18]">
                {template.document === "cv" ? "CV" : "Resume"} · {template.fields.length} sections
              </p>
              <p className="mt-1 font-display text-2xl">{template.name}</p>
              <p className="mt-2 text-sm leading-relaxed text-[#3d3832]">{template.audience}</p>
              <p className="mt-2 text-sm text-[#5c564c]">{template.ats}</p>
              <p className="mt-3 text-xs leading-relaxed text-[#5c564c]">{template.fields.map((field) => field.label).join(" · ")}</p>
            </button>
          ))}
        </div>
      )}

      <div className="mt-6">
        <Button onClick={create}>{mode === "scratch" ? "Open a blank page" : "Use this template"}</Button>
      </div>
    </div>
  );
}
