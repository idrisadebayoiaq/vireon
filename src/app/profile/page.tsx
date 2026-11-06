"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Field, PageHeader, controlClass } from "@/components/ui";
import { useStore } from "@/lib/store";
import { useLocations } from "@/lib/use-locations";
import type { Experience, NyscStatus, Profile } from "@/lib/types";

const blankExperience = (): Experience => ({
  id: crypto.randomUUID(),
  title: "",
  company: "",
  city: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
});

export default function ProfilePage() {
  const { state, saveProfile, addSkill, removeSkill, saveExperience, removeExperience } = useStore();
  const { states, fromSupabase } = useLocations();
  const [profile, setProfile] = useState<Profile>(state.profile);
  const [saved, setSaved] = useState(false);
  const [formError, setFormError] = useState("");
  const [skillName, setSkillName] = useState("");
  const [skillLevel, setSkillLevel] = useState("Comfortable");
  const [experience, setExperience] = useState<Experience>(blankExperience());

  useEffect(() => {
    setProfile(state.profile);
  }, [state.profile]);

  const lgas = states.find((item) => item.name === profile.state)?.lgas ?? [];

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    setSaved(false);
    setProfile((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Profile"
        lede="Your name, where you are, and the work you have already done. Resumes read from this page."
      />
      <p className="mb-4 text-xs uppercase tracking-[0.14em] text-[#5c564c]">
        {fromSupabase ? "States and LGAs loaded from Supabase" : "States and LGAs loaded from the local seed"}
      </p>
      <form
        className="grid gap-4 md:grid-cols-2"
        onSubmit={async (event) => {
          event.preventDefault();
          const message = await saveProfile(profile);
          setFormError(message ?? "");
          setSaved(!message);
        }}
      >
        <Field label="Full name">
          <input className={controlClass} value={profile.fullName} onChange={(event) => update("fullName", event.target.value)} />
        </Field>
        <Field label="Phone">
          <input className={controlClass} value={profile.phone} onChange={(event) => update("phone", event.target.value)} />
        </Field>
        <Field label="State">
          <select
            className={controlClass}
            value={profile.state}
            onChange={(event) => {
              setSaved(false);
              setProfile((current) => ({ ...current, state: event.target.value, lga: "" }));
            }}
          >
            <option value="">Choose a state</option>
            {states.map((item) => (
              <option key={item.name}>{item.name}</option>
            ))}
          </select>
        </Field>
        <Field label="LGA">
          <select className={controlClass} value={profile.lga} onChange={(event) => update("lga", event.target.value)}>
            <option value="">Choose an LGA</option>
            {lgas.map((lga) => (
              <option key={lga}>{lga}</option>
            ))}
          </select>
        </Field>
        <Field label="City">
          <input className={controlClass} value={profile.city} onChange={(event) => update("city", event.target.value)} />
        </Field>
        <Field label="NYSC">
          <select className={controlClass} value={profile.nysc} onChange={(event) => update("nysc", event.target.value as NyscStatus)}>
            <option value="none">Not started</option>
            <option value="serving">Serving</option>
            <option value="completed">Completed</option>
            <option value="exempt">Exempt</option>
          </select>
        </Field>
        <div className="md:col-span-2">
          <Field label="Headline">
            <input className={controlClass} value={profile.headline} onChange={(event) => update("headline", event.target.value)} />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Career interests">
            <input className={controlClass} value={profile.interests} onChange={(event) => update("interests", event.target.value)} />
          </Field>
        </div>
        <div className="md:col-span-2 flex items-center gap-3">
          <Button type="submit">Save profile</Button>
          {saved ? <p className="text-sm text-[#0e6b4f]">Saved to your account.</p> : null}
          {formError ? <p className="text-sm text-[#8a3d18]">{formError}</p> : null}
        </div>
      </form>

      <section className="mt-10">
        <h2 className="font-display text-2xl">Skills</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <input className={`${controlClass} max-w-xs`} placeholder="Skill" value={skillName} onChange={(event) => setSkillName(event.target.value)} />
          <select className={`${controlClass} max-w-[180px]`} value={skillLevel} onChange={(event) => setSkillLevel(event.target.value)}>
            <option>Beginner</option>
            <option>Comfortable</option>
            <option>Strong</option>
          </select>
          <Button
            onClick={() => {
              if (!skillName.trim()) return;
              addSkill({ id: crypto.randomUUID(), name: skillName.trim(), level: skillLevel });
              setSkillName("");
            }}
          >
            Add skill
          </Button>
        </div>
        <ul className="mt-3 space-y-2">
          {state.skills.map((skill) => (
            <li key={skill.id} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm">
              <span>
                {skill.name} · {skill.level}
              </span>
              <button type="button" onClick={() => removeSkill(skill.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl">Experience</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <Field label="Title">
            <input className={controlClass} value={experience.title} onChange={(event) => setExperience({ ...experience, title: event.target.value })} />
          </Field>
          <Field label="Company">
            <input className={controlClass} value={experience.company} onChange={(event) => setExperience({ ...experience, company: event.target.value })} />
          </Field>
          <Field label="City">
            <input className={controlClass} value={experience.city} onChange={(event) => setExperience({ ...experience, city: event.target.value })} />
          </Field>
          <Field label="Start">
            <input className={controlClass} type="date" value={experience.startDate} onChange={(event) => setExperience({ ...experience, startDate: event.target.value })} />
          </Field>
          <div className="md:col-span-2">
            <Field label="Description">
              <textarea className={`${controlClass} min-h-24 py-3`} value={experience.description} onChange={(event) => setExperience({ ...experience, description: event.target.value })} />
            </Field>
          </div>
        </div>
        <div className="mt-3">
          <Button
            onClick={() => {
              if (!experience.title.trim()) return;
              saveExperience(experience);
              setExperience(blankExperience());
            }}
          >
            Save experience
          </Button>
        </div>
        <ul className="mt-4 space-y-2">
          {state.experiences.map((item) => (
            <li key={item.id} className="rounded-xl bg-white px-3 py-3 text-sm">
              <p className="font-medium">
                {item.title} · {item.company}
              </p>
              <p className="text-[#5c564c]">{item.city}</p>
              <div className="mt-2 flex gap-3">
                <button type="button" onClick={() => setExperience(item)}>
                  Edit
                </button>
                <button type="button" onClick={() => removeExperience(item.id)}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-8 text-sm">
        <Link className="font-semibold text-[#0e6b4f]" href="/employer">
          Post a job as an employer
        </Link>
      </p>
    </div>
  );
}
