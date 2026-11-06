"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button, Field, PageHeader, controlClass } from "@/components/ui";
import { useStore } from "@/lib/store";
import { KIND_LABEL, TEMPLATE_LABEL, type ResumeSections } from "@/lib/types";

const templateOrder = ["classic", "compact", "clean"] as const;

export default function ResumeEditorPage() {
  const params = useParams<{ id: string }>();
  const { state, saveResume } = useStore();
  const resume = state.resumes.find((item) => item.id === params.id);

  if (!resume) {
    return (
      <div>
        <PageHeader title="Document not found" />
        <Link href="/resumes" className="text-sm font-semibold text-[#0e6b4f]">
          Back to documents
        </Link>
      </div>
    );
  }

  function updateSection(key: keyof ResumeSections, value: string) {
    saveResume({
      ...resume!,
      updatedAt: new Date().toLocaleString("en-NG", { timeZone: "Africa/Lagos" }),
      sections: { ...resume!.sections, [key]: value },
    });
  }

  function writeFromProfile() {
    const profile = state.profile;
    const name = profile.fullName || "Your name";
    const confirmed = state.certificates.filter((item) => item.status === "confirmed");
    saveResume({
      ...resume!,
      updatedAt: new Date().toLocaleString("en-NG", { timeZone: "Africa/Lagos" }),
      sections: {
        ...resume!.sections,
        headline: profile.headline || name,
        summary: `${name} is based in ${profile.city || "a Nigerian city"}, ${profile.state || "Nigeria"}. Interests: ${profile.interests || "open to entry-level work"}. NYSC: ${profile.nysc}.`,
        certificates: confirmed
          .map((item) => `${KIND_LABEL[item.kind]} · ${item.examBody} · ${item.year}`)
          .join("\n") || "No confirmed certificates yet.",
        skills: state.skills.map((skill) => `${skill.name} (${skill.level})`).join(", ") || "No skills yet.",
        experience:
          state.experiences
            .map((item) => `${item.title} at ${item.company}, ${item.city}. ${item.description}`)
            .join("\n") || "No experience yet.",
      },
    });
  }

  const frame =
    resume.templateId === "classic"
      ? "border-t-4 border-[#1c1915] text-center"
      : resume.templateId === "compact"
        ? "text-sm"
        : "border-l-4 border-[#0e6b4f] pl-4";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div>
        <PageHeader title={resume.title} lede={`${resume.kind === "cv" ? "CV" : "Resume"} · ${TEMPLATE_LABEL[resume.templateId]}`} />
        <div className="mb-4 flex flex-wrap gap-2">
          {templateOrder.map((templateId) => (
            <button
              key={templateId}
              type="button"
              className={`rounded-full px-3 py-2 text-sm ${resume.templateId === templateId ? "bg-[#0e6b4f] text-white" : "bg-white"}`}
              onClick={() => saveResume({ ...resume, templateId })}
            >
              {TEMPLATE_LABEL[templateId]}
            </button>
          ))}
        </div>
        <div className="space-y-4">
          {(
            [
              ["headline", "Headline"],
              ["summary", "Summary"],
              ["certificates", "Certificates"],
              ["skills", "Skills"],
              ["experience", "Experience"],
              ["custom", "Custom section"],
            ] as const
          ).map(([key, label]) => (
            <Field key={key} label={label}>
              <textarea className={`${controlClass} min-h-24 py-3`} value={resume.sections[key]} onChange={(event) => updateSection(key, event.target.value)} />
            </Field>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={writeFromProfile}>Write from my profile</Button>
          <Button tone="ghost" disabled>
            PDF download comes online in Part 2
          </Button>
        </div>
      </div>
      <aside className={`h-fit rounded-3xl bg-white p-5 ${frame}`}>
        <p className="font-display text-2xl">{resume.sections.headline || "Headline"}</p>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{resume.sections.summary}</p>
        <p className="mt-3 whitespace-pre-wrap text-sm">{resume.sections.certificates}</p>
        <p className="mt-3 whitespace-pre-wrap text-sm">{resume.sections.skills}</p>
        <p className="mt-3 whitespace-pre-wrap text-sm">{resume.sections.experience}</p>
        <p className="mt-3 whitespace-pre-wrap text-sm">{resume.sections.custom}</p>
      </aside>
    </div>
  );
}
