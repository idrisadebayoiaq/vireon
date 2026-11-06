"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, PageHeader } from "@/components/ui";
import { useStore } from "@/lib/store";

export default function SettingsPage() {
  const { state, saveSettings, signOut } = useStore();
  const [open, setOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const settings = state.settings;

  return (
    <div className="max-w-2xl">
      <PageHeader
        eyebrow="Settings"
        title="How this desk behaves"
        lede="These choices are saved on your account."
      />

      <section className="space-y-3 rounded-3xl border border-[#e4dccb] bg-[#fffdf8] p-5">
        <h2 className="font-display text-2xl">Account</h2>
        <p className="text-sm text-[#3d3832]">Signed in as {state.email || "this browser session"}.</p>
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/profile" className="text-[#0e6b4f]">Edit profile</Link>
          <Link href="/certificates" className="text-[#0e6b4f]">Certificates</Link>
          <Link href="/resumes" className="text-[#0e6b4f]">Resumes</Link>
        </div>
      </section>

      <section className="mt-4 space-y-4 rounded-3xl border border-[#e4dccb] bg-[#fffdf8] p-5">
        <h2 className="font-display text-2xl">Desk</h2>
        <label className="flex items-start gap-3 text-sm leading-relaxed">
          <input
            type="checkbox"
            className="mt-1"
            checked={settings.jobAlerts}
            onChange={(event) => saveSettings({ ...settings, jobAlerts: event.target.checked })}
          />
          <span>Job alerts. When the morning list is live, this is the preference for a 06:00 West Africa Time note. It does not send anything yet.</span>
        </label>
        <label className="flex items-start gap-3 text-sm leading-relaxed">
          <input
            type="checkbox"
            className="mt-1"
            checked={settings.showOlevelLane}
            onChange={(event) => saveSettings({ ...settings, showOlevelLane: event.target.checked })}
          />
          <span>Show the O&apos;level lane on Today. Turn this off if you only want roles that use your higher certificates.</span>
        </label>
      </section>

      <section className="mt-4 space-y-3 rounded-3xl border border-[#e4dccb] bg-[#fffdf8] p-5">
        <h2 className="font-display text-2xl">Privacy</h2>
        <p className="text-sm leading-relaxed text-[#3d3832]">
          Profile, result slips, resumes, and application text belong to this account. An email leaves Vireon only after you tap Send, and that connection is not live yet.
        </p>
        <Link href="/privacy" className="text-sm font-semibold text-[#0e6b4f]">Read the public privacy note</Link>
        <div>
          <Button tone="secondary" onClick={() => setOpen(true)}>Delete my account</Button>
        </div>
        {open ? (
          <div className="rounded-2xl bg-[#f3efe4] p-4">
            <p className="font-display text-2xl">Delete this account?</p>
            <p className="mt-2 text-sm text-[#5c564c]">
              This removes your profile, certificates, resumes, applications, and the sign-in. It cannot be undone.
            </p>
            <div className="mt-3 flex gap-2">
              <Button
                onClick={async () => {
                  const response = await fetch("/api/account/delete", { method: "POST" });
                  const data = (await response.json()) as { error?: string };
                  if (!response.ok) {
                    setDeleteError(data.error || "The account was not deleted.");
                    return;
                  }
                  await signOut();
                }}
              >
                Delete account
              </Button>
              <Button tone="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            </div>
            {deleteError ? <p className="mt-3 text-sm text-[#8a3d18]">{deleteError}</p> : null}
          </div>
        ) : null}
      </section>

      <div className="mt-6">
        <Button tone="ghost" onClick={signOut}>Sign out</Button>
      </div>
    </div>
  );
}
