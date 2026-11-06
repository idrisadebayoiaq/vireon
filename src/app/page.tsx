"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useStore } from "@/lib/store";

export default function HomePage() {
  const router = useRouter();
  const { ready, state } = useStore();

  useEffect(() => {
    if (!ready) return;
    router.replace(state.authed ? "/today" : "/login");
  }, [ready, state.authed, router]);

  return <main className="min-h-screen bg-[#f3efe4]" />;
}
