import { completeChat, readJson } from "@/lib/openrouter";
import { createClient } from "@/lib/supabase/server";
import { getServerEnv } from "@/lib/env";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in again." }, { status: 401 });

  let body: { jobId?: string; resumeId?: string };
  try {
    body = (await request.json()) as { jobId?: string; resumeId?: string };
  } catch {
    return NextResponse.json({ error: "The draft request was not readable." }, { status: 400 });
  }

  const [{ data: job }, { data: profile }, { data: resume }] = await Promise.all([
    supabase.from("jobs").select("title,company_name,city,description").eq("id", body.jobId ?? "").maybeSingle(),
    supabase.from("profiles").select("full_name,phone,city,state,headline,career_interests").eq("id", user.id).maybeSingle(),
    supabase.from("resumes").select("title,sections").eq("id", body.resumeId ?? "").maybeSingle(),
  ]);
  if (!job) return NextResponse.json({ error: "That job is not available." }, { status: 404 });

  let key = "";
  try {
    key = getServerEnv().openRouterKey;
  } catch {
    return NextResponse.json({ error: "The writing service is not configured." }, { status: 503 });
  }

  const content = await completeChat(
    "anthropic/claude-haiku-5.5",
    key,
    "You draft a short job application email for a seeker in Nigeria. Use only the facts given. Do not invent experience, grades, or employers. Respond with JSON only.",
    `Return {"subject":"","body":""}.\nJob: ${JSON.stringify(job)}\nPerson: ${JSON.stringify(profile)}\nResume: ${JSON.stringify(resume ?? {})}`,
  );
  const json = content ? readJson(content) : null;
  const subject = typeof json?.subject === "string" ? json.subject.trim() : "";
  const letter = typeof json?.body === "string" ? json.body.trim() : "";
  if (!subject || !letter) return NextResponse.json({ error: "The draft did not come back. You can write the letter yourself." }, { status: 502 });
  return NextResponse.json({ subject, body: letter });
}
