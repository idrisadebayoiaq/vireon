"use client";

import { useState } from "react";
import { Button, PageHeader } from "@/components/ui";

export default function PrivacyPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-2xl">
      <PageHeader title="Privacy" />
      <div className="space-y-3 text-sm leading-relaxed text-[#3d3832]">
        <p>Vireon stores your profile, result slips, resumes, and application text.</p>
        <p>An application email is sent only after you tap Send.</p>
        <p>In this first build, that information stays in this browser session. The database tables are ready for the next stage.</p>
      </div>
      <div className="mt-6">
        <Button tone="secondary" onClick={() => setOpen(true)}>
          Delete my account
        </Button>
      </div>
      {open ? (
        <div className="mt-4 rounded-3xl border border-[#e4dccb] bg-white p-5">
          <h2 className="font-display text-2xl">Delete this account?</h2>
          <p className="mt-2 text-sm text-[#5c564c]">
            This confirmation is only a preview. Deleting the account is connected in the next stage.
          </p>
          <div className="mt-4">
            <Button tone="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
