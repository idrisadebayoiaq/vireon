"use client";

import { useMemo, useState } from "react";
import { JobCard } from "@/components/job-card";
import { Field, PageHeader, controlClass } from "@/components/ui";
import { useStore } from "@/lib/store";

export default function JobsPage() {
  const { jobs } = useStore();
  const [stateName, setStateName] = useState("all");
  const [workMode, setWorkMode] = useState("all");
  const [lane, setLane] = useState("all");

  const states = useMemo(
    () => Array.from(new Set(jobs.map((job) => job.state))).sort(),
    [jobs],
  );

  const visible = jobs.filter((job) => {
    if (stateName !== "all" && job.state !== stateName) return false;
    if (workMode !== "all" && job.workMode !== workMode) return false;
    if (lane !== "all" && job.lane !== lane) return false;
    return true;
  });

  return (
    <div>
      <PageHeader
        title="Jobs"
        lede="Sample roles are marked. Jobs you post in this session show up here too."
      />
      <div className="mb-5 grid gap-3 md:grid-cols-3">
        <Field label="State">
          <select className={controlClass} value={stateName} onChange={(event) => setStateName(event.target.value)}>
            <option value="all">All states</option>
            {states.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Work mode">
          <select className={controlClass} value={workMode} onChange={(event) => setWorkMode(event.target.value)}>
            <option value="all">All</option>
            <option value="onsite">On-site</option>
            <option value="hybrid">Hybrid</option>
            <option value="remote">Remote</option>
          </select>
        </Field>
        <Field label="Lane">
          <select className={controlClass} value={lane} onChange={(event) => setLane(event.target.value)}>
            <option value="all">All lanes</option>
            <option value="olevel">O&apos;level</option>
            <option value="profile">Profile</option>
          </select>
        </Field>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {visible.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
      {visible.length === 0 ? <p className="text-sm text-[#5c564c]">No roles match these filters.</p> : null}
    </div>
  );
}
