"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Field, controlClass } from "@/components/ui";
import { useStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useStore();
  const [mode, setMode] = useState<"signin" | "create">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Enter both email and password.");
      setMessage("");
      return;
    }
    setError("");
    setMessage(
      mode === "create"
        ? "Account ready. This account will hold your certificates, resumes, and applications."
        : "Signed in. This account will hold your certificates, resumes, and applications.",
    );
    signIn(email.trim());
    router.push("/today");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <p className="font-display text-4xl tracking-tight">Vireon</p>
      <p className="mt-3 text-sm leading-relaxed text-[#5c564c]">
        This account will hold your certificates, resumes, and applications. Sign-in is local for now.
      </p>
      <div className="mt-6 flex gap-2">
        <button
          type="button"
          className={`rounded-full px-3 py-2 text-sm font-semibold ${mode === "signin" ? "bg-[#1c1915] text-white" : "bg-white"}`}
          onClick={() => setMode("signin")}
        >
          Sign in
        </button>
        <button
          type="button"
          className={`rounded-full px-3 py-2 text-sm font-semibold ${mode === "create" ? "bg-[#1c1915] text-white" : "bg-white"}`}
          onClick={() => setMode("create")}
        >
          Create account
        </button>
      </div>
      <form onSubmit={submit} className="mt-6 space-y-4 rounded-3xl border border-[#e4dccb] bg-[#fffdf8] p-5">
        <Field label="Email">
          <input className={controlClass} type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </Field>
        <Field label="Password">
          <input className={controlClass} type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </Field>
        {error ? <p className="text-sm text-[#8a3d18]">{error}</p> : null}
        {message ? <p className="text-sm text-[#0e6b4f]">{message}</p> : null}
        <Button type="submit">{mode === "create" ? "Create account" : "Sign in"}</Button>
      </form>
    </main>
  );
}
