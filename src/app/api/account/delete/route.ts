import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in again." }, { status: 401 });

  const admin = createAdminClient();
  const [certificates, resumes] = await Promise.all([
    admin.from("certificates").select("file_path").eq("user_id", user.id),
    admin.from("resumes").select("pdf_path").eq("user_id", user.id),
  ]);
  const slips = (certificates.data ?? []).map((row) => row.file_path).filter((path): path is string => Boolean(path));
  const files = (resumes.data ?? []).map((row) => row.pdf_path).filter((path): path is string => Boolean(path));
  if (slips.length) await admin.storage.from("certificate-slips").remove(slips);
  if (files.length) await admin.storage.from("resumes").remove(files);

  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) return NextResponse.json({ error: "The account could not be deleted." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
