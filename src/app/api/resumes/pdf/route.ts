import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in again." }, { status: 401 });

  let body: {
    id?: string;
    title?: string;
    kind?: string;
    templateId?: string;
    contactLine?: string;
    fields?: { label?: string; value?: string }[];
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "The document request was not readable." }, { status: 400 });
  }
  const id = body.id ?? "";
  if (!id) return NextResponse.json({ error: "That document is not on your account." }, { status: 404 });

  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle();
  const sections = { contactLine: body.contactLine ?? "", fields: body.fields ?? [] };
  await supabase.from("resumes").upsert({
    id,
    user_id: user.id,
    title: body.title || "Resume",
    kind: body.kind === "cv" ? "cv" : "resume",
    template_id: body.templateId || "scratch",
    sections,
    updated_at: new Date().toISOString(),
  });
  const title = body.title || "resume";
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let page = pdf.addPage([595, 842]);
  let y = 800;
  const left = 54;
  const width = 487;

  function nextLine(size: number) {
    y -= size + 6;
    if (y < 54) {
      page = pdf.addPage([595, 842]);
      y = 800;
    }
  }

  function draw(text: string, size: number, face: typeof font) {
    const words = plain(text).split(/\s+/).filter(Boolean);
    let line = "";
    for (const word of words) {
      const trial = line ? `${line} ${word}` : word;
      if (face.widthOfTextAtSize(trial, size) > width) {
        page.drawText(line, { x: left, y, size, font: face, color: rgb(0.11, 0.1, 0.08) });
        nextLine(size);
        line = word;
      } else {
        line = trial;
      }
    }
    if (line) {
      page.drawText(line, { x: left, y, size, font: face, color: rgb(0.11, 0.1, 0.08) });
      nextLine(size);
    }
  }

  draw(profile?.full_name || "Your name", 18, bold);
  if (sections.contactLine) draw(sections.contactLine, 10, font);
  for (const field of sections.fields ?? []) {
    y -= 6;
    draw((field.label || "Section").toUpperCase(), 11, bold);
    draw(field.value || "", 10, font);
  }

  const bytes = await pdf.save();
  const path = `${user.id}/${id}.pdf`;
  await supabase.storage.from("resumes").upload(path, bytes, { upsert: true, contentType: "application/pdf" });
  await supabase.from("resumes").update({ pdf_path: path }).eq("id", id);

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${plain(title)}.pdf"`,
    },
  });
}

function plain(value: string) {
  return value.replaceAll("₦", "NGN ").replace(/[^\x09\x0A\x0D\x20-\xFF]/g, "");
}
