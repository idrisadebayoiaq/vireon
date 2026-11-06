"use client";

import { JobCard } from "@/components/job-card";
import { PageHeader } from "@/components/ui";
import { useStore } from "@/lib/store";

export default function TodayPage() {
  const { jobs } = useStore();
  const profileJobs = jobs.filter((job) => job.lane === "profile");
  const olevelJobs = jobs.filter((job) => job.lane === "olevel");
  const total = profileJobs.length + olevelJobs.length;
  const today = new Intl.DateTimeFormat("en-NG", {
    dateStyle: "full",
    timeZone: "Africa/Lagos",
  }).format(new Date());

  return (
    <div>
      <PageHeader
        eyebrow="Today"
        title="Your jobs for today"
        lede={`${today}. Five to seven roles, with simple O'level work kept in its own group.`}
      />
      {total < 5 ? (
        <p className="mb-6 rounded-2xl bg-[#efe8da] px-4 py-3 text-sm">
          Fewer roles today. Weak matches are left out.
        </p>
      ) : null}
      <section className="mb-8">
        <h2 className="mb-3 font-display text-2xl">Matches your profile</h2>
        {profileJobs.length === 0 ? (
          <p className="text-sm text-[#5c564c]">Fewer roles today. Weak matches are left out.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {profileJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>
      <section>
        <h2 className="mb-3 font-display text-2xl">You can apply with your O&apos;level</h2>
        {olevelJobs.length === 0 ? (
          <p className="text-sm text-[#5c564c]">Fewer roles today. Weak matches are left out.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {olevelJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
