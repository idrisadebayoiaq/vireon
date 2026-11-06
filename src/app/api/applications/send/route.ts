import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const DAILY_USER_CAP = 15;
const COMPANY_CAP = 20;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in again." }, { status: 401 });

  let id = "";
  try {
    id = String(((await request.json()) as { id?: string }).id ?? "");
  } catch {
    return NextResponse.json({ error: "The send request was not readable." }, { status: 400 });
  }

  const { data: application } = await supabase.from("applications").select("id,job_id,status").eq("id", id).maybeSingle();
  if (!application) return NextResponse.json({ error: "Save the draft before sending." }, { status: 404 });
  if (application.status === "sent") return NextResponse.json({ error: "This job was already sent." }, { status: 409 });

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.json(
      { error: "The draft is saved. Gmail sending needs a Google OAuth client on the server, so nothing was emailed." },
      { status: 503 },
    );
  }

  const { data: job } = await supabase.from("jobs").select("apply_email").eq("id", application.job_id).maybeSingle();
  const sentToday = await supabase
    .from("applications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "sent")
    .gte("sent_at", new Date(new Date().toISOString().slice(0, 10)).toISOString());
  if ((sentToday.count ?? 0) >= DAILY_USER_CAP) {
    return NextResponse.json({ error: "You have reached today's send limit." }, { status: 429 });
  }

  if (job?.apply_email) {
    const company = await supabase
      .from("applications")
      .select("id, jobs!inner(apply_email)", { count: "exact", head: true })
      .eq("status", "sent")
      .eq("jobs.apply_email", job.apply_email)
      .gte("sent_at", new Date(new Date().toISOString().slice(0, 10)).toISOString());
    if ((company.count ?? 0) >= COMPANY_CAP) {
      return NextResponse.json({ error: "That company inbox has reached today's Vireon limit." }, { status: 429 });
    }
  }

  return NextResponse.json(
    { error: "Connect Gmail before sending. The draft is saved and nothing was emailed." },
    { status: 409 },
  );
}
