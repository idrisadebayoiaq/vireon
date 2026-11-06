"use client";

import { useMemo, useState } from "react";
import { JobCard } from "@/components/job-card";
import { Button, Field, PageHeader, controlClass } from "@/components/ui";
import { useStore } from "@/lib/store";

export default function JobsPage() {
  const { state, ensureToday } = useStore();
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [stateName, setStateName] = useState("all");
  const [workMode, setWorkMode] = useState("all");
  const [lane, setLane] = useState("all");

  const states = useMemo(
    () => Array.from(new Set(state.todayJobs.map((job) => job.state))).sort(),
    [state.todayJobs],
  );

  const visible = state.todayJobs.filter((job) => {
    if (stateName !== "all" && job.state !== stateName) return false;
    if (workMode !== "all" && job.workMode !== workMode) return false;
    if (lane !== "all" && job.lane !== lane) return false;
    if (!state.settings.showOlevelLane && job.lane === "olevel") return false;
    return true;
  });

  async function search() {
    setSearching(true);
    setSearchError("");
    const message = await ensureToday();
    setSearching(false);
    setSearched(true);
    if (message) setSearchError(message);
  }

  return (
    <div>
      <PageHeader
        title="Jobs"
        lede="Search jobs to see roles that fit your state, certificates, and skills. The list stays empty until you do."
      />
      <Button disabled={searching} onClick={search}>
        {searching ? "Searching…" : "Search jobs"}
      </Button>
      {searchError ? <p className="mt-4 text-sm text-[#8a3d18]">{searchError}</p> : null}
      {!searched ? <p className="mt-4 text-sm text-[#5c564c]">No roles are shown yet.</p> : null}
      {searched ? (
        <>
          {state.todayNote ? <p className="mt-4 rounded-2xl bg-[#efe8da] px-4 py-3 text-sm">{state.todayNote}</p> : null}
          <div className="my-5 grid gap-3 md:grid-cols-3">
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
          {visible.length === 0 ? <p className="text-sm text-[#5c564c]">No roles match your details.</p> : null}
        </>
      ) : null}
    </div>
  );
}
