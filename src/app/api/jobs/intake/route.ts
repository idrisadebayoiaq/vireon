import { createHash } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = process.env.INTAKE_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Intake is not open." }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: sources } = await admin.from("job_sources").select("id,name,url").eq("enabled", true);
  let added = 0;
  for (const source of sources ?? []) {
    if (!source.url) continue;
    const target = new URL(source.url);
    if (!(await robotsAllow(target))) continue;
    const response = await fetch(target, { headers: { "User-Agent": "VireonBot/1.0" } });
    if (!response.ok) continue;
    const html = await response.text();
    const posting = readJobPosting(html);
    if (!posting) continue;
    const hash = createHash("sha256")
      .update(`${posting.company}|${posting.title}|${posting.city}`.trim().toLowerCase())
      .digest("hex");
    const { error } = await admin.from("jobs").upsert(
      {
        source: "page",
        source_url: target.toString(),
        dedupe_hash: hash,
        title: posting.title,
        company_name: posting.company,
        description: posting.description,
        state: posting.state,
        city: posting.city,
        category: "olevel",
        qualification_min: "olevel",
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
      },
      { onConflict: "dedupe_hash" },
    );
    if (!error) added += 1;
    await admin.from("job_sources").update({ last_run_at: new Date().toISOString() }).eq("id", source.id);
  }

  return NextResponse.json({
    added,
    note: (sources ?? []).length === 0 ? "No allowed sources are enabled. LinkedIn, Indeed, and Jobberman stay out." : "",
  });
}

async function robotsAllow(target: URL) {
  const response = await fetch(`${target.origin}/robots.txt`).catch(() => null);
  if (!response?.ok) return true;
  const text = await response.text();
  const lines = text.split(/\r?\n/);
  let star = false;
  for (const line of lines) {
    const agent = line.match(/^user-agent:\s*(.+)$/i);
    if (agent) {
      star = agent[1].trim() === "*";
      continue;
    }
    if (!star) continue;
    const rule = line.match(/^disallow:\s*(.*)$/i);
    if (!rule) continue;
    const path = rule[1].trim();
    if (path === "/") return false;
    if (path && target.pathname.startsWith(path)) return false;
  }
  return true;
}

function readJobPosting(html: string) {
  const blocks = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi) ?? [];
  for (const block of blocks) {
    const raw = block.replace(/<\/?script[^>]*>/gi, "");
    try {
      const json = JSON.parse(raw) as { "@type"?: string; title?: string; description?: string; hiringOrganization?: { name?: string }; jobLocation?: { address?: { addressLocality?: string; addressRegion?: string } } };
      if (json["@type"] !== "JobPosting" || !json.title) continue;
      return {
        title: json.title,
        company: json.hiringOrganization?.name || "Employer",
        description: json.description || "",
        city: json.jobLocation?.address?.addressLocality || "",
        state: json.jobLocation?.address?.addressRegion || "",
      };
    } catch {
      continue;
    }
  }
  return null;
}
