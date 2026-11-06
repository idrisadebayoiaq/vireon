import { creditCount, hasCreditSubject } from "@/lib/grades";

export type PickCertificate = {
  kind: string;
  status: string;
  subjects: { subject: string; grade: string }[];
};

export type PickJob = {
  id: string;
  title: string;
  company: string;
  city: string;
  state: string;
  workMode: string;
  category: "olevel" | "profile";
  qualification: string;
  englishCredit: boolean;
  mathsCredit: boolean;
  minCredits: number;
  requiredSubjects: string[];
  requiredSkills: string[];
  expiresAt: string | null;
};

const RANK: Record<string, number> = {
  none: 0,
  olevel: 1,
  ond: 2,
  hnd: 3,
  bsc: 4,
  professional: 5,
};

export function choosePicks(input: {
  state: string;
  skills: string[];
  certificates: PickCertificate[];
  jobs: PickJob[];
  blockedJobIds: string[];
}) {
  const blocked = new Set(input.blockedJobIds);
  const confirmed = input.certificates.filter((item) => item.status === "confirmed");
  const rank = confirmed.reduce((highest, item) => Math.max(highest, RANK[item.kind] ?? 0), 0);
  const olevelSubjects = confirmed
    .filter((item) => item.kind === "olevel")
    .flatMap((item) => item.subjects);
  const hasOlevel = confirmed.some((item) => item.kind === "olevel");
  const skillSet = new Set(input.skills.map((skill) => skill.toLowerCase()));
  const home = input.state.trim().toLowerCase();

  const open = input.jobs.filter((job) => {
    if (blocked.has(job.id)) return false;
    if (job.expiresAt && new Date(job.expiresAt).getTime() < Date.now()) return false;
    if (job.workMode !== "remote" && home && job.state.trim().toLowerCase() !== home) return false;
    if (job.workMode !== "remote" && !home) return false;
    return true;
  });

  const profile = open
    .filter((job) => job.category === "profile" && (RANK[job.qualification] ?? 0) <= rank && rank > 0)
    .sort((a, b) => score(b, home, skillSet) - score(a, home, skillSet));

  const olevel = open.filter((job) => job.category === "olevel" && passesOlevel(job, hasOlevel, olevelSubjects));

  const chosen: PickJob[] = [];
  const companies = new Set<string>();
  take(chosen, profile, companies, 4);
  take(chosen, olevel, companies, 7);
  if (chosen.length < 7) take(chosen, olevel, companies, 7, true);
  return chosen.slice(0, 7).map((job) => ({
    job,
    lane: job.category,
    missingSkills: job.requiredSkills.filter((skill) => !skillSet.has(skill.toLowerCase())),
  }));
}

function score(job: PickJob, home: string, skills: Set<string>) {
  const city = job.city.trim().toLowerCase() === home ? 2 : 0;
  const skillHits = job.requiredSkills.filter((skill) => skills.has(skill.toLowerCase())).length;
  return city + skillHits;
}

function passesOlevel(job: PickJob, hasOlevel: boolean, subjects: { subject: string; grade: string }[]) {
  if (job.qualification === "none") return true;
  if (!hasOlevel) return false;
  if (job.englishCredit && !hasCreditSubject(subjects, "english")) return false;
  if (job.mathsCredit && !hasCreditSubject(subjects, "math")) return false;
  if (creditCount(subjects) < job.minCredits) return false;
  return job.requiredSubjects.every((subject) => hasCreditSubject(subjects, subject));
}

function take(chosen: PickJob[], pool: PickJob[], companies: Set<string>, limit: number, allowRepeatCompany = false) {
  for (const job of pool) {
    if (chosen.length >= limit) return;
    if (chosen.some((item) => item.id === job.id)) continue;
    const company = job.company.trim().toLowerCase();
    if (!allowRepeatCompany && companies.has(company)) continue;
    chosen.push(job);
    companies.add(company);
  }
}
