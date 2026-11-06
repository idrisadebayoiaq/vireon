"use client";

import { useEffect, useRef } from "react";
import { JobCard } from "@/components/job-card";
import { PageHeader } from "@/components/ui";
import { useStore } from "@/lib/store";

export default function TodayPage() {
  const { state, ensureToday } = useStore();
  const profileJobs = state.todayJobs.filter((job) => job.lane === "profile");
  const olevelJobs = state.settings.showOlevelLane ? state.todayJobs.filter((job) => job.lane === "olevel") : [];
  const confirmed = state.certificates.filter((item) => item.status === "confirmed").length;
  const drafts = state.applications.filter((item) => item.status === "draft").length;
  const sent = state.applications.filter((item) => item.status === "sent").length;
  const today = new Intl.DateTimeFormat("en-NG", { dateStyle: "full", timeZone: "Africa/Lagos" }).format(new Date());
  const place = [state.profile.city, state.profile.state].filter(Boolean).join(", ");

  const started = useRef(false);

  useEffect(() => {
    if (!state.authed || started.current) return;
    started.current = true;
    void ensureToday();
  }, [state.authed, ensureToday]);

  const facts = [
    ["Name", state.profile.fullName || "Not set"],
    ["Location", place || "Not set"],
    ["NYSC", state.profile.nysc],
    ["Confirmed certificates", String(confirmed)],
    ["Skills", String(state.skills.length)],
    ["Experience", String(state.experiences.length)],
    ["Resumes and CVs", String(state.resumes.length)],
    ["Draft applications", String(drafts)],
    ["Sent applications", String(sent)],
    ["Roles on this desk", String(profileJobs.length + olevelJobs.length)],
  ];

  return (
    <div>
      <PageHeader eyebrow="Today" title="Your jobs for today" lede={`${today}. The list is saved for this Lagos day.`} />
      <dl className="mb-8 grid grid-cols-2 gap-2 md:grid-cols-5">
        {facts.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-[#e4dccb] bg-[#fffdf8] px-3 py-3">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8a3d18]">{label}</dt>
            <dd className="mt-1 text-sm font-medium capitalize">{value}</dd>
          </div>
        ))}
      </dl>
      {state.todayNote ? <p className="mb-6 rounded-2xl bg-[#efe8da] px-4 py-3 text-sm">{state.todayNote}</p> : null}
      <section className="mb-8">
        <h2 className="mb-3 font-display text-2xl">Matches your profile</h2>
        {profileJobs.length === 0 ? (
          <p className="text-sm text-[#5c564c]">No profile-lane roles in this list.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {profileJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>
      {state.settings.showOlevelLane ? (
        <section>
          <h2 className="mb-3 font-display text-2xl">You can apply with your O&apos;level</h2>
          {olevelJobs.length === 0 ? (
            <p className="text-sm text-[#5c564c]">No O&apos;level roles in this list.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {olevelJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </section>
      ) : (
        <p className="text-sm text-[#5c564c]">The O&apos;level lane is hidden. Turn it back on in Settings.</p>
      )}
    </div>
  );
}
