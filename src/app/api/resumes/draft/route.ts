import { getServerEnv } from "@/lib/env";
import { NextResponse } from "next/server";

type DraftField = { label?: string; hint?: string };
type DraftBody = {
  kind?: string;
  templateName?: string;
  instruction?: string;
  profile?: Record<string, unknown>;
  skills?: unknown[];
  experiences?: unknown[];
  certificates?: unknown[];
  fields?: DraftField[];
};

export async function POST(request: Request) {
  let body: DraftBody;
  try {
    body = (await request.json()) as DraftBody;
  } catch {
    return NextResponse.json({ error: "The draft request was not readable." }, { status: 400 });
  }

  const fields = Array.isArray(body.fields) ? body.fields.slice(0, 24) : [];
  if (fields.length === 0) {
    return NextResponse.json({ error: "Add at least one field before asking for a draft." }, { status: 400 });
  }

  let openRouterKey: string;
  try {
    openRouterKey = getServerEnv().openRouterKey;
  } catch {
    return NextResponse.json({ error: "The writing service is not configured on the server." }, { status: 503 });
  }

  const labels = fields.map((field, index) => `${index + 1}. ${field.label || "Section"} — ${field.hint || "Plain sentences."}`);
  const prompt = [
    "Write an ATS resume or CV for a job seeker in Nigeria.",
    "Use only the facts in the profile JSON. Do not invent employers, dates, grades, schools, or certificates.",
    "If a section has no supporting fact, write one short honest line telling the user to fill it in. Do not fabricate.",
    "Plain text only. No markdown, bullets made of icons, tables, or columns.",
    `Return JSON with keys contactLine (string) and values (array of ${fields.length} strings, same order as the fields).`,
    `Document: ${body.kind === "cv" ? "CV" : "Resume"}. Structure: ${body.templateName || "Custom"}.`,
    body.instruction ? `User note: ${body.instruction}` : "",
    "Fields:",
    ...labels,
    "Facts:",
    JSON.stringify({
      profile: body.profile ?? {},
      skills: body.skills ?? [],
      experiences: body.experiences ?? [],
      certificates: body.certificates ?? [],
    }),
  ]
    .filter(Boolean)
    .join("\n");

  let response: Response;
  try {
    response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openRouterKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "anthropic/claude-haiku-5.5",
        messages: [
          {
            role: "system",
            content: "You write plain-text Nigerian resumes and CVs. You never invent work history. You respond with JSON only.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });
  } catch {
    return NextResponse.json({ error: "The writing service could not be reached." }, { status: 502 });
  }

  if (!response.ok) {
    return NextResponse.json({ error: "The writing service did not return a draft." }, { status: 502 });
  }

  const payload = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  const content = payload.choices?.[0]?.message?.content ?? "";
  const parsed = parseDraft(content, fields.length);
  if (!parsed) {
    return NextResponse.json({ error: "The draft came back in a shape that could not be used. Try again." }, { status: 502 });
  }

  return NextResponse.json(parsed);
}

function parseDraft(content: string, count: number) {
  const start = content.indexOf("{");
  const end = content.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  try {
    const json = JSON.parse(content.slice(start, end + 1)) as { values?: unknown; contactLine?: unknown };
    if (!Array.isArray(json.values)) return null;
    const values = json.values.map((value) => (typeof value === "string" ? value.trim() : "")).slice(0, count);
    while (values.length < count) values.push("");
    return {
      contactLine: typeof json.contactLine === "string" ? json.contactLine.trim() : "",
      values,
    };
  } catch {
    return null;
  }
}
