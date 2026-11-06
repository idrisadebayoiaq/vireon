"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, PageHeader } from "@/components/ui";
import { useStore } from "@/lib/store";
import { emptySections } from "@/lib/types";

const templates = [
  {
    id: "classic" as const,
    name: "Classic",
    preview: "Name centered, a rule under the headline, then sections in order.",
  },
  {
    id: "compact" as const,
    name: "Compact",
    preview: "Name and contact on one line. Short blocks, tight spacing.",
  },
  {
    id: "clean" as const,
    name: "Clean",
    preview: "A green rail on the left, sections stacked with lots of air.",
  },
];

export default function NewResumePage() {
  const router = useRouter();
  const { saveResume } = useStore();
  const [kind, setKind] = useState<"resume" | "cv">("resume");
  const [templateId, setTemplateId] = useState<"classic" | "compact" | "clean">("classic");

  return (
    <div>
      <PageHeader title="Choose a template" lede="Start with Resume or CV, then pick how it should look." />
      <div className="mb-4 flex gap-2">
        <button type="button" className={`rounded-full px-3 py-2 text-sm font-semibold ${kind === "resume" ? "bg-[#1c1915] text-white" : "bg-white"}`} onClick={() => setKind("resume")}>
          Resume
        </button>
        <button type="button" className={`rounded-full px-3 py-2 text-sm font-semibold ${kind === "cv" ? "bg-[#1c1915] text-white" : "bg-white"}`} onClick={() => setKind("cv")}>
          CV
        </button>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => setTemplateId(template.id)}
            className={`rounded-2xl border p-4 text-left ${templateId === template.id ? "border-[#0e6b4f] bg-[#e7f3ee]" : "border-[#e4dccb] bg-[#fffdf8]"}`}
          >
            <p className="font-display text-2xl">{template.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-[#5c564c]">{template.preview}</p>
            <div className={`mt-4 h-16 rounded-xl ${template.id === "classic" ? "bg-[#1c1915]" : template.id === "compact" ? "bg-[#8a3d18]" : "bg-[#0e6b4f]"}`} />
          </button>
        ))}
      </div>
      <div className="mt-6">
        <Button
          onClick={() => {
            const id = crypto.randomUUID();
            saveResume({
              id,
              kind,
              templateId,
              title: kind === "cv" ? "My CV" : "My resume",
              updatedAt: new Date().toLocaleString("en-NG", { timeZone: "Africa/Lagos" }),
              sections: emptySections(),
            });
            router.push(`/resumes/${id}`);
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
