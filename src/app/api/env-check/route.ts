import { NextResponse } from "next/server";
import { getServerEnv } from "@/lib/env";

export async function GET() {
  getServerEnv();
  return NextResponse.json({ ok: true });
}
