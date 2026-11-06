export type NyscStatus = "none" | "serving" | "completed" | "exempt";

export type Profile = {
  fullName: string;
  phone: string;
  state: string;
  lga: string;
  city: string;
  headline: string;
  interests: string;
  nysc: NyscStatus;
};

export type Skill = {
  id: string;
  name: string;
  level: string;
};

export type Experience = {
  id: string;
  title: string;
  company: string;
  city: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
};

export type CertificateKind = "olevel" | "ond" | "hnd" | "bsc" | "professional";

export type SubjectRow = {
  id: string;
  subject: string;
  grade: string;
};

export type Certificate = {
  id: string;
  kind: CertificateKind;
  examBody: string;
  year: string;
  examNumber: string;
  fileName: string;
  status: "pending_review" | "confirmed";
  subjects: SubjectRow[];
};

export type WorkMode = "onsite" | "remote" | "hybrid";
export type Qualification = "none" | "olevel" | "ond" | "hnd" | "bsc" | "professional";

export type Job = {
  id: string;
  sample: boolean;
  title: string;
  company: string;
  description: string;
  state: string;
  city: string;
  workMode: WorkMode;
  salary: string;
  employmentType: string;
  applyEmail: string;
  applyUrl: string;
  qualification: Qualification;
  englishCredit: boolean;
  mathsCredit: boolean;
  minCredits: number;
  requiredSubjects: string;
  requiredSkills: string;
  lane: "olevel" | "profile";
  matchReason: string;
  missingSkills: string;
};

export type ResumeSections = {
  headline: string;
  summary: string;
  certificates: string;
  skills: string;
  experience: string;
  custom: string;
};

export type ResumeDoc = {
  id: string;
  kind: "resume" | "cv";
  templateId: "classic" | "compact" | "clean";
  title: string;
  updatedAt: string;
  sections: ResumeSections;
};

export type ApplicationStatus =
  | "draft"
  | "sent"
  | "opened_external"
  | "replied"
  | "interview"
  | "offer"
  | "rejected";

export type Application = {
  id: string;
  jobId: string;
  resumeId: string;
  channel: "email" | "external";
  status: ApplicationStatus;
  subject: string;
  body: string;
  to: string;
};

export const emptyProfile = (): Profile => ({
  fullName: "",
  phone: "",
  state: "",
  lga: "",
  city: "",
  headline: "",
  interests: "",
  nysc: "none",
});

export const emptySections = (): ResumeSections => ({
  headline: "",
  summary: "",
  certificates: "",
  skills: "",
  experience: "",
  custom: "",
});

export const SAMPLE_SUBJECTS: Omit<SubjectRow, "id">[] = [
  { subject: "English Language", grade: "C6" },
  { subject: "Mathematics", grade: "C5" },
  { subject: "Economics", grade: "C4" },
  { subject: "Civic Education", grade: "B3" },
  { subject: "Biology", grade: "C6" },
];

export const KIND_LABEL: Record<CertificateKind, string> = {
  olevel: "O'level",
  ond: "ND",
  hnd: "HND",
  bsc: "Degree",
  professional: "Professional certificate",
};

export const STATUS_LABEL: Record<ApplicationStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  opened_external: "Opened on company site",
  replied: "Replied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
};

export const TEMPLATE_LABEL = {
  classic: "Classic",
  compact: "Compact",
  clean: "Clean",
} as const;

export function qualificationLine(job: Job) {
  if (job.qualification === "none") return "No certificate required";
  if (job.qualification === "olevel") {
    const parts: string[] = [];
    if (job.minCredits) parts.push(`${job.minCredits} credits`);
    if (job.englishCredit) parts.push("English");
    if (job.mathsCredit) parts.push("Mathematics");
    return parts.length ? `O'level · ${parts.join(", ")}` : "O'level";
  }
  return KIND_LABEL[job.qualification];
}

export function laneForQualification(qualification: Qualification): Job["lane"] {
  return qualification === "none" || qualification === "olevel" ? "olevel" : "profile";
}
