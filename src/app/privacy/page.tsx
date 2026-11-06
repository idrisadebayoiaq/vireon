"use client";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f3efe4]">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0e6b4f]">Privacy</p>
        <h1 className="mt-3 font-display text-4xl">What Vireon keeps, and what it does not send.</h1>
        <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-[#3d3832]">
          <p>The account holds your name, phone, state, city, skills, work history, result slips, resumes, and the letters you draft.</p>
          <p>A result slip is used to confirm grades and to fill a resume you chose. It is not sold, and checker PINs are not collected.</p>
          <p>An application email is sent only after you tap Send. In this build that connection is not live, so Send explains the next step and keeps the draft.</p>
          <p>This first release stores the desk in the browser session. The database tables exist for the next stage, when an account can be deleted for real.</p>
          <p>The model key used to draft a resume stays on the server. The browser asks for a draft and receives the text.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
