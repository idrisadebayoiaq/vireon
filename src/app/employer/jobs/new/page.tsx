"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Field, PageHeader, controlClass } from "@/components/ui";
import { useStore } from "@/lib/store";
import { laneForQualification, type Qualification, type WorkMode } from "@/lib/types";

export default function NewEmployerJobPage() {
  const router = useRouter();
  const { postJob } = useStore();
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [stateName, setStateName] = useState("Lagos");
  const [city, setCity] = useState("");
  const [workMode, setWorkMode] = useState<WorkMode>("onsite");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");
  const [applyUrl, setApplyUrl] = useState("");
  const [qualification, setQualification] = useState<Qualification>("olevel");
  const [englishCredit, setEnglishCredit] = useState(true);
  const [mathsCredit, setMathsCredit] = useState(true);
  const [minCredits, setMinCredits] = useState("5");
  const [requiredSubjects, setRequiredSubjects] = useState("English Language, Mathematics");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [error, setError] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim() || !company.trim() || !email.trim()) {
      setError("Add a title, company, and Gmail.");
      return;
    }
    const lane = laneForQualification(qualification);
    postJob({
      id: crypto.randomUUID(),
      sample: false,
      title: title.trim(),
      company: company.trim(),
      description,
      state: stateName,
      city,
      workMode,
      salary,
      employmentType,
      applyEmail: email.trim(),
      applyUrl,
      qualification,
      englishCredit,
      mathsCredit,
      minCredits: Number(minCredits) || 0,
      requiredSubjects,
      requiredSkills,
      lane,
      matchReason:
        lane === "olevel"
          ? "Posted in this session. The certificate rule is O'level or none."
          : "Posted in this session. This role asks for more than O'level.",
      missingSkills: requiredSkills || "None listed",
    });
    router.push("/jobs");
  }

  return (
    <div className="max-w-3xl">
      <PageHeader title="New job" lede="This role stays in the current browser session and shows on Jobs and Today." />
      <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
        <Field label="Title">
          <input className={controlClass} value={title} onChange={(event) => setTitle(event.target.value)} />
        </Field>
        <Field label="Company">
          <input className={controlClass} value={company} onChange={(event) => setCompany(event.target.value)} />
        </Field>
        <Field label="Gmail for applications">
          <input className={controlClass} type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </Field>
        <Field label="State">
          <input className={controlClass} value={stateName} onChange={(event) => setStateName(event.target.value)} />
        </Field>
        <Field label="City">
          <input className={controlClass} value={city} onChange={(event) => setCity(event.target.value)} />
        </Field>
        <Field label="Work mode">
          <select className={controlClass} value={workMode} onChange={(event) => setWorkMode(event.target.value as WorkMode)}>
            <option value="onsite">On-site</option>
            <option value="hybrid">Hybrid</option>
            <option value="remote">Remote</option>
          </select>
        </Field>
        <Field label="Employment type">
          <select className={controlClass} value={employmentType} onChange={(event) => setEmploymentType(event.target.value)}>
            <option>Full-time</option>
            <option>Internship</option>
            <option>NYSC</option>
            <option>Apprenticeship</option>
            <option>Contract</option>
          </select>
        </Field>
        <Field label="Salary">
          <input className={controlClass} value={salary} onChange={(event) => setSalary(event.target.value)} />
        </Field>
        <div className="md:col-span-2">
          <Field label="Description">
            <textarea className={`${controlClass} min-h-28 py-3`} value={description} onChange={(event) => setDescription(event.target.value)} />
          </Field>
        </div>
        <Field label="Apply link">
          <input className={controlClass} value={applyUrl} onChange={(event) => setApplyUrl(event.target.value)} />
        </Field>
        <Field label="Qualification">
          <select className={controlClass} value={qualification} onChange={(event) => setQualification(event.target.value as Qualification)}>
            <option value="none">None</option>
            <option value="olevel">O&apos;level</option>
            <option value="ond">ND</option>
            <option value="hnd">HND</option>
            <option value="bsc">Degree</option>
            <option value="professional">Professional certificate</option>
          </select>
        </Field>
        <Field label="Minimum credits">
          <input className={controlClass} value={minCredits} onChange={(event) => setMinCredits(event.target.value)} />
        </Field>
        <Field label="Required subjects">
          <input className={controlClass} value={requiredSubjects} onChange={(event) => setRequiredSubjects(event.target.value)} />
        </Field>
        <div className="md:col-span-2">
          <Field label="Required skills">
            <input className={controlClass} value={requiredSkills} onChange={(event) => setRequiredSkills(event.target.value)} />
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={englishCredit} onChange={(event) => setEnglishCredit(event.target.checked)} />
          English credit
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={mathsCredit} onChange={(event) => setMathsCredit(event.target.checked)} />
          Mathematics credit
        </label>
        {error ? <p className="text-sm text-[#8a3d18] md:col-span-2">{error}</p> : null}
        <div className="md:col-span-2">
          <Button type="submit">Publish in this session</Button>
        </div>
      </form>
    </div>
  );
}
