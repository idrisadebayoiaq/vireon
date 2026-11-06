import type { Application, Certificate, DeskSettings, Experience, Job, Profile, ResumeDoc, ResumeField, Skill } from "@/lib/types";

type Row = Record<string, unknown>;

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

export function mapProfile(row: Row): Profile {
  return {
    fullName: text(row.full_name),
    phone: text(row.phone),
    state: text(row.state),
    lga: text(row.lga),
    city: text(row.city),
    headline: text(row.headline),
    interests: text(row.career_interests),
    nysc: (text(row.nysc_status) || "none") as Profile["nysc"],
  };
}

export function mapSettings(row: Row): DeskSettings {
  return {
    jobAlerts: row.job_alerts !== false,
    showOlevelLane: row.show_olevel_lane !== false,
  };
}

export function mapSkill(row: Row): Skill {
  return { id: text(row.id), name: text(row.name), level: text(row.level) };
}

export function mapExperience(row: Row): Experience {
  return {
    id: text(row.id),
    title: text(row.title),
    company: text(row.company),
    city: text(row.city),
    startDate: text(row.start_date).slice(0, 10),
    endDate: text(row.end_date).slice(0, 10),
    current: row.is_current === true,
    description: text(row.description),
  };
}

export function mapCertificate(row: Row): Certificate {
  const subjects = Array.isArray(row.certificate_subjects) ? row.certificate_subjects : [];
  return {
    id: text(row.id),
    kind: text(row.kind) as Certificate["kind"],
    examBody: text(row.exam_body),
    year: text(row.year),
    examNumber: text(row.exam_number),
    fileName: text(row.file_path).split("/").pop() ?? "",
    status: row.status === "confirmed" ? "confirmed" : "pending_review",
    subjects: subjects.map((subject) => {
      const item = subject as Row;
      return { id: text(item.id), subject: text(item.subject), grade: text(item.grade) };
    }),
  };
}

export function mapJob(row: Row, extra?: { matchReason?: string; missingSkills?: string }): Job {
  const subjects = Array.isArray(row.required_subjects) ? row.required_subjects.map(text) : [];
  const skills = Array.isArray(row.required_skills) ? row.required_skills.map(text) : [];
  const category = text(row.category) === "profile" ? "profile" : "olevel";
  return {
    id: text(row.id),
    sample: text(row.source) === "curated",
    title: text(row.title),
    company: text(row.company_name),
    description: text(row.description),
    state: text(row.state),
    city: text(row.city),
    workMode: (text(row.work_mode) || "onsite") as Job["workMode"],
    salary: text(row.salary_text),
    employmentType: text(row.employment_type),
    applyEmail: text(row.apply_email),
    applyUrl: text(row.apply_url),
    qualification: (text(row.qualification_min) || "olevel") as Job["qualification"],
    englishCredit: row.english_credit === true,
    mathsCredit: row.maths_credit === true,
    minCredits: typeof row.min_credits === "number" ? row.min_credits : 0,
    requiredSubjects: subjects.join(", "),
    requiredSkills: skills.join(", "),
    lane: category,
    matchReason: extra?.matchReason ?? "",
    missingSkills: extra?.missingSkills ?? "",
  };
}

export function mapResume(row: Row): ResumeDoc {
  const sections = (row.sections ?? {}) as Row;
  const fields = Array.isArray(sections.fields) ? sections.fields : [];
  return {
    id: text(row.id),
    kind: row.kind === "cv" ? "cv" : "resume",
    templateId: text(row.template_id) || "scratch",
    title: text(row.title) || "Resume",
    updatedAt: text(row.updated_at),
    contactLine: text(sections.contactLine),
    fields: fields.map((field) => {
      const item = field as Row;
      return {
        id: text(item.id) || crypto.randomUUID(),
        label: text(item.label) || "Section",
        value: text(item.value),
        hint: text(item.hint),
      } satisfies ResumeField;
    }),
  };
}

export function mapApplication(row: Row, email = ""): Application {
  return {
    id: text(row.id),
    jobId: text(row.job_id),
    resumeId: text(row.resume_id),
    channel: row.channel === "external" ? "external" : "email",
    status: text(row.status) as Application["status"],
    subject: text(row.subject),
    body: text(row.body),
    to: email,
  };
}
