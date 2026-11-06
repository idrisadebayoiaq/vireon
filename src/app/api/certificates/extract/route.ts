import { readJson } from "@/lib/openrouter";
import { createClient } from "@/lib/supabase/server";
import { getServerEnv } from "@/lib/env";
import { NextResponse } from "next/server";

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
    return NextResponse.json({ error: "The slip request was not readable." }, { status: 400 });
  }
  if (!id) return NextResponse.json({ error: "Choose a certificate to read." }, { status: 400 });

  const { data: certificate } = await supabase.from("certificates").select("file_path,exam_body,year").eq("id", id).maybeSingle();
  if (!certificate?.file_path) return NextResponse.json({ error: "That slip is not on your account." }, { status: 404 });

  const downloaded = await supabase.storage.from("certificate-slips").download(certificate.file_path);
  if (downloaded.error || !downloaded.data) {
    return NextResponse.json({ error: "The slip file could not be opened." }, { status: 404 });
  }

  let key = "";
  try {
    key = getServerEnv().openRouterKey;
  } catch {
    return NextResponse.json({ error: "The reading service is not configured." }, { status: 503 });
  }

  const bytes = Buffer.from(await downloaded.data.arrayBuffer());
  const mime = mimeFor(certificate.file_path, downloaded.data.type);
  const filePart =
    mime === "application/pdf"
      ? { type: "file", file: { filename: "slip.pdf", file_data: `data:${mime};base64,${bytes.toString("base64")}` } }
      : { type: "image_url", image_url: { url: `data:${mime};base64,${bytes.toString("base64")}` } };

  const vision = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "inclusionai/ling-3.0-flash-vl",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: 'Read this Nigerian result slip. Return JSON {"examBody":"","year":"","subjects":[{"subject":"","grade":""}]}. Use the grade printed on the slip, such as A1, B3, C6, D7, or F9. Leave subjects empty if the file is unreadable. Do not invent rows and do not ask for a checker PIN.',
            },
            filePart,
          ],
        },
      ],
    }),
  });

  if (!vision.ok) {
    return NextResponse.json({
      examBody: certificate.exam_body,
      year: certificate.year,
      subjects: [],
      error: "The slip could not be read. Type the subjects yourself.",
    });
  }

  const payload = (await vision.json()) as { choices?: { message?: { content?: string } }[] };
  const json = readJson(payload.choices?.[0]?.message?.content ?? "");
  const subjects = Array.isArray(json?.subjects)
    ? json.subjects.flatMap((item) => {
        const row = item as { subject?: unknown; grade?: unknown };
        if (typeof row.subject !== "string" || !row.subject.trim()) return [];
        return [
          {
            id: crypto.randomUUID(),
            subject: row.subject.trim(),
            grade: typeof row.grade === "string" ? row.grade.trim().toUpperCase() : "",
          },
        ];
      })
    : [];

  return NextResponse.json({
    examBody: typeof json?.examBody === "string" && json.examBody.trim() ? json.examBody.trim() : certificate.exam_body,
    year: typeof json?.year === "string" && json.year.trim() ? json.year.trim() : certificate.year,
    subjects,
  });
}

function mimeFor(path: string, fallback: string) {
  const lower = path.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (fallback && fallback !== "application/octet-stream") return fallback;
  return "image/jpeg";
}
