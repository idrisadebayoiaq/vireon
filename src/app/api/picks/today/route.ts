import { mapJob } from "@/lib/map-rows";
import { lagosDate, lagosHour } from "@/lib/nigeria";
import { completeChat, readJson } from "@/lib/openrouter";
import { choosePicks, type PickJob } from "@/lib/picks";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getServerEnv } from "@/lib/env";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in again." }, { status: 401 });

  const today = lagosDate();
  if (lagosHour() < 6) {
    const jobs = await loadPicks(supabase, user.id, shiftDate(today, -1));
    return NextResponse.json({
      jobs,
      note: jobs.length ? "" : "The next list is prepared at 06:00 West Africa Time.",
    });
  }

  const existing = await loadPicks(supabase, user.id, today);
  if (existing.length > 0) return NextResponse.json({ jobs: existing, note: "" });

  const [profileRes, skillsRes, certificateRes, applicationRes, pickedRes, jobRes] = await Promise.all([
    supabase.from("profiles").select("full_name,state,city").eq("id", user.id).maybeSingle(),
    supabase.from("skills").select("name").eq("user_id", user.id),
    supabase.from("certificates").select("kind,status,certificate_subjects(subject,grade)").eq("user_id", user.id),
    supabase.from("applications").select("job_id").eq("user_id", user.id),
    supabase.from("daily_picks").select("job_id").eq("user_id", user.id),
    supabase.from("jobs").select("*").eq("is_active", true).neq("source", "curated"),
  ]);

  const profile = profileRes.data;
  if (!profile?.full_name || !profile.state) {
    return NextResponse.json({
      jobs: [],
      note: "Add your name and state on Profile. The morning list uses them.",
    });
  }

  const blocked = [
    ...(applicationRes.data ?? []).map((row) => String(row.job_id)),
    ...(pickedRes.data ?? []).map((row) => String(row.job_id)),
  ];
  const jobs = (jobRes.data ?? []).map(toPickJob);
  const chosen = choosePicks({
    state: String(profile.state),
    skills: (skillsRes.data ?? []).map((row) => String(row.name)),
    certificates: (certificateRes.data ?? []).map((row) => ({
      kind: String(row.kind),
      status: String(row.status),
      subjects: Array.isArray(row.certificate_subjects)
        ? row.certificate_subjects.map((subject) => ({
            subject: String(subject.subject),
            grade: String(subject.grade),
          }))
        : [],
    })),
    jobs,
    blockedJobIds: blocked,
  });

  const reasons = await matchLines(chosen.map((item) => item.job), {
    name: String(profile.full_name),
    city: String(profile.city ?? ""),
    state: String(profile.state),
    skills: (skillsRes.data ?? []).map((row) => String(row.name)),
  });

  if (chosen.length > 0) {
    const admin = createAdminClient();
    const { error } = await admin.from("daily_picks").insert(
      chosen.map((item, index) => ({
        user_id: user.id,
        job_id: item.job.id,
        pick_date: today,
        lane: item.lane,
        rank: index + 1,
        match_reason: reasons.get(item.job.id)?.matchReason ?? fallbackReason(item.job),
        missing_skills: item.missingSkills,
      })),
    );
    if (error) {
      console.error(error.message);
      return NextResponse.json({ error: "The morning list could not be saved." }, { status: 500 });
    }
  }

  const byId = new Map((jobRes.data ?? []).map((row) => [String(row.id), row]));
  return NextResponse.json({
    jobs: chosen.map((item) =>
      mapJob(byId.get(item.job.id) ?? {}, {
        matchReason: reasons.get(item.job.id)?.matchReason ?? fallbackReason(item.job),
        missingSkills: item.missingSkills.join(", ") || "None listed",
      }),
    ),
    note: chosen.length < 5 ? "Fewer roles today. Weak matches are left out." : "",
  });
}

async function loadPicks(supabase: Awaited<ReturnType<typeof createClient>>, userId: string, date: string) {
  const { data } = await supabase
    .from("daily_picks")
    .select("lane,rank,match_reason,missing_skills,jobs(*)")
    .eq("user_id", userId)
    .eq("pick_date", date)
    .order("rank");
  return (data ?? []).flatMap((row) => {
    const job = row.jobs;
    if (!job || Array.isArray(job)) return [];
    const missing = Array.isArray(row.missing_skills) ? row.missing_skills.map(String).join(", ") : "";
    return [mapJob(job, { matchReason: String(row.match_reason ?? ""), missingSkills: missing || "None listed" })];
  });
}

function toPickJob(row: Record<string, unknown>): PickJob {
  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    company: String(row.company_name ?? ""),
    city: String(row.city ?? ""),
    state: String(row.state ?? ""),
    workMode: String(row.work_mode ?? "onsite"),
    category: row.category === "profile" ? "profile" : "olevel",
    qualification: String(row.qualification_min ?? "olevel"),
    englishCredit: row.english_credit === true,
    mathsCredit: row.maths_credit === true,
    minCredits: typeof row.min_credits === "number" ? row.min_credits : 0,
    requiredSubjects: Array.isArray(row.required_subjects) ? row.required_subjects.map(String) : [],
    requiredSkills: Array.isArray(row.required_skills) ? row.required_skills.map(String) : [],
    expiresAt: typeof row.expires_at === "string" ? row.expires_at : null,
  };
}

function fallbackReason(job: PickJob) {
  if (job.qualification === "none") return `${job.title} in ${job.city} does not require a certificate.`;
  if (job.category === "olevel") return `${job.title} in ${job.city} matches the O'level rule on the posting.`;
  return `${job.title} in ${job.city} is within the certificate level on your profile.`;
}

async function matchLines(jobs: PickJob[], person: { name: string; city: string; state: string; skills: string[] }) {
  const lines = new Map<string, { matchReason: string }>();
  jobs.forEach((job) => lines.set(job.id, { matchReason: fallbackReason(job) }));
  if (jobs.length === 0) return lines;
  let key = "";
  try {
    key = getServerEnv().openRouterKey;
  } catch {
    return lines;
  }
  const content = await completeChat(
    "deepseek/deepseek-flash-latest",
    key,
    "You write one short match line for each job. Use only the facts given. Do not invent grades or employers. Respond with JSON only.",
    `${JSON.stringify({ person, jobs: jobs.map((job) => ({ id: job.id, title: job.title, city: job.city, qualification: job.qualification })) })}\nReturn {"lines":[{"id":"","matchReason":""}]} with one line per job.`,
  );
  const json = content ? readJson(content) : null;
  const returned = Array.isArray(json?.lines) ? json.lines : [];
  for (const line of returned) {
    const item = line as { id?: unknown; matchReason?: unknown };
    if (typeof item.id === "string" && typeof item.matchReason === "string" && item.matchReason.trim()) {
      lines.set(item.id, { matchReason: item.matchReason.trim() });
    }
  }
  return lines;
}

function shiftDate(iso: string, days: number) {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
