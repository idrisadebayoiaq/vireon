import Link from "next/link";
import { qualificationLine, type Job } from "@/lib/types";

export function JobCard({ job }: { job: Job }) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="block rounded-2xl border border-[#e4dccb] bg-[#fffdf8] p-4 transition hover:border-[#0e6b4f]"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${job.lane === "olevel" ? "bg-[#f3e1d4] text-[#8a3d18]" : "bg-[#dceee6] text-[#0e6b4f]"}`}
        >
          {job.lane === "olevel" ? "O'level" : "Profile"}
        </span>
        {job.sample ? (
          <span className="rounded-full bg-[#efe8da] px-2 py-1 text-xs font-semibold text-[#5c564c]">
            Sample
          </span>
        ) : null}
      </div>
      <h2 className="font-display text-2xl leading-tight">{job.title}</h2>
      <p className="mt-1 text-sm text-[#5c564c]">
        {job.company} · {job.city}, {job.state}
      </p>
      <p className="mt-3 text-sm font-medium">{job.salary}</p>
      <p className="mt-1 text-sm text-[#3d3832]">{qualificationLine(job)}</p>
      <p className="mt-3 text-sm leading-relaxed text-[#3d3832]">{job.matchReason}</p>
      <p className="mt-1 text-sm text-[#8a3d18]">Missing: {job.missingSkills}</p>
    </Link>
  );
}
