"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { mapApplication, mapCertificate, mapExperience, mapJob, mapProfile, mapResume, mapSettings, mapSkill } from "@/lib/map-rows";
import { dedupeHash } from "@/lib/nigeria";
import { createClient } from "@/lib/supabase/client";
import {
  emptyProfile,
  emptySettings,
  type Application,
  type Certificate,
  type DeskSettings,
  type Experience,
  type Job,
  type Profile,
  type ResumeDoc,
  type Skill,
} from "@/lib/types";

type SessionState = {
  authed: boolean;
  email: string;
  profile: Profile;
  skills: Skill[];
  experiences: Experience[];
  certificates: Certificate[];
  resumes: ResumeDoc[];
  applications: Application[];
  settings: DeskSettings;
  jobs: Job[];
  todayJobs: Job[];
  todayNote: string;
};

type StoreValue = {
  ready: boolean;
  state: SessionState;
  jobs: Job[];
  signOut: () => Promise<void>;
  saveProfile: (profile: Profile) => Promise<string | null>;
  addSkill: (skill: Skill) => Promise<string | null>;
  removeSkill: (id: string) => Promise<void>;
  saveExperience: (experience: Experience) => Promise<string | null>;
  removeExperience: (id: string) => Promise<void>;
  createCertificate: (input: {
    kind: Certificate["kind"];
    examBody: string;
    year: string;
    examNumber: string;
    file: File;
  }) => Promise<{ id?: string; error?: string }>;
  saveCertificate: (certificate: Certificate) => Promise<string | null>;
  postJob: (job: Job) => Promise<string | null>;
  saveResume: (resume: ResumeDoc) => void;
  saveApplication: (application: Application) => Promise<string | null>;
  saveSettings: (settings: DeskSettings) => Promise<string | null>;
  ensureToday: () => Promise<string | null>;
};

const resumeWrites = new Map<string, ReturnType<typeof setTimeout>>();

const defaultState = (): SessionState => ({
  authed: false,
  email: "",
  profile: emptyProfile(),
  skills: [],
  experiences: [],
  certificates: [],
  resumes: [],
  applications: [],
  settings: emptySettings(),
  jobs: [],
  todayJobs: [],
  todayNote: "",
});

const StoreContext = createContext<StoreValue | null>(null);

function list(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function mergeDocs<T extends { id: string }>(saved: T[], local: T[]) {
  const ids = new Set(saved.map((item) => item.id));
  return [...local.filter((item) => !ids.has(item.id)), ...saved];
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<SessionState>(defaultState);
  const userId = useRef("");
  const employerId = useRef("");
  const loadId = useRef(0);

  useEffect(() => {
    const supabase = createClient();

    async function load(id: string, email: string) {
      const token = ++loadId.current;
      userId.current = id;
      setState((current) => ({ ...current, authed: true, email }));
      setReady(true);
      const [profileRes, skillsRes, experienceRes, certificateRes, resumeRes, applicationRes, jobRes, employerRes] =
        await Promise.all([
          supabase.from("profiles").select("*").eq("id", id).maybeSingle(),
          supabase.from("skills").select("*").eq("user_id", id).order("created_at"),
          supabase.from("experiences").select("*").eq("user_id", id).order("created_at"),
          supabase.from("certificates").select("*, certificate_subjects(*)").eq("user_id", id).order("created_at", { ascending: false }),
          supabase.from("resumes").select("*").eq("user_id", id).order("updated_at", { ascending: false }),
          supabase.from("applications").select("*").eq("user_id", id).order("created_at", { ascending: false }),
          supabase.from("jobs").select("*").eq("is_active", true).order("created_at", { ascending: false }),
          supabase.from("employers").select("id").eq("owner_id", id).maybeSingle(),
        ]);
      if (token !== loadId.current) return;

      let profileRow = profileRes.data;
      if (!profileRow) {
        const inserted = await supabase.from("profiles").insert({ id }).select("*").single();
        profileRow = inserted.data;
      }
      employerId.current = employerRes.data?.id ?? "";
      const jobs = (jobRes.data ?? []).map((row) => mapJob(row)).filter((job) => !job.sample);
      const emailByJob = new Map(jobs.map((job) => [job.id, job.applyEmail]));

      setState((current) => ({
        authed: true,
        email,
        profile: profileRow ? mapProfile(profileRow) : emptyProfile(),
        settings: profileRow ? mapSettings(profileRow) : emptySettings(),
        skills: (skillsRes.data ?? []).map(mapSkill),
        experiences: (experienceRes.data ?? []).map(mapExperience),
        certificates: (certificateRes.data ?? []).map(mapCertificate),
        resumes: mergeDocs((resumeRes.data ?? []).map(mapResume), current.resumes),
        applications: (applicationRes.data ?? []).map((row) => mapApplication(row, emailByJob.get(String(row.job_id)) ?? "")),
        jobs,
        todayJobs: current.todayJobs,
        todayNote: current.todayNote,
      }));
      setReady(true);
    }

    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        userId.current = "";
        setState(defaultState());
        setReady(true);
        return;
      }
      void load(data.user.id, data.user.email ?? "");
    });

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") return;
      if (!session?.user) {
        loadId.current += 1;
        userId.current = "";
        employerId.current = "";
        setState(defaultState());
        setReady(true);
        return;
      }
      void load(session.user.id, session.user.email ?? "");
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const value = useMemo<StoreValue>(() => {
    const supabase = createClient();

    async function replaceSubjects(certificate: Certificate) {
      await supabase.from("certificate_subjects").delete().eq("certificate_id", certificate.id);
      const rows = certificate.subjects.filter((subject) => subject.subject.trim());
      if (rows.length === 0) return null;
      const { error } = await supabase.from("certificate_subjects").insert(
        rows.map((subject) => ({
          id: subject.id,
          certificate_id: certificate.id,
          subject: subject.subject.trim(),
          grade: subject.grade.trim(),
        })),
      );
      return error?.message ?? null;
    }

    return {
      ready,
      state,
      jobs: state.jobs,
      signOut: async () => {
        await supabase.auth.signOut();
        userId.current = "";
        setState(defaultState());
      },
      saveProfile: async (profile) => {
        if (!profile.fullName.trim()) return "Add your full name.";
        if (profile.phone.replace(/\D/g, "").length < 10) return "Enter a phone number with at least 10 digits.";
        const { error } = await supabase
          .from("profiles")
          .update({
            full_name: profile.fullName.trim(),
            phone: profile.phone.trim(),
            state: profile.state,
            lga: profile.lga,
            city: profile.city.trim(),
            headline: profile.headline.trim(),
            career_interests: profile.interests.trim(),
            nysc_status: profile.nysc,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId.current);
        if (error) return error.message;
        setState((current) => ({ ...current, profile: { ...profile, fullName: profile.fullName.trim() } }));
        return null;
      },
      addSkill: async (skill) => {
        const { error } = await supabase.from("skills").insert({
          id: skill.id,
          user_id: userId.current,
          name: skill.name,
          level: skill.level,
        });
        if (error) return error.message;
        setState((current) => ({ ...current, skills: [...current.skills, skill] }));
        return null;
      },
      removeSkill: async (id) => {
        await supabase.from("skills").delete().eq("id", id);
        setState((current) => ({ ...current, skills: current.skills.filter((skill) => skill.id !== id) }));
      },
      saveExperience: async (experience) => {
        if (!experience.title.trim()) return "Add the job title.";
        const row = {
          id: experience.id,
          user_id: userId.current,
          title: experience.title.trim(),
          company: experience.company.trim(),
          city: experience.city.trim(),
          start_date: experience.startDate || null,
          end_date: experience.endDate || null,
          is_current: experience.current,
          description: experience.description.trim(),
        };
        const { error } = await supabase.from("experiences").upsert(row);
        if (error) return error.message;
        setState((current) => {
          const exists = current.experiences.some((item) => item.id === experience.id);
          return {
            ...current,
            experiences: exists
              ? current.experiences.map((item) => (item.id === experience.id ? experience : item))
              : [...current.experiences, experience],
          };
        });
        return null;
      },
      removeExperience: async (id) => {
        await supabase.from("experiences").delete().eq("id", id);
        setState((current) => ({ ...current, experiences: current.experiences.filter((item) => item.id !== id) }));
      },
      createCertificate: async (input) => {
        const id = crypto.randomUUID();
        const path = `${userId.current}/${id}`;
        const { error } = await supabase.from("certificates").insert({
          id,
          user_id: userId.current,
          kind: input.kind,
          exam_body: input.examBody,
          year: input.year,
          exam_number: input.examNumber,
          file_path: path,
          status: "pending_review",
        });
        if (error) return { error: error.message };
        const uploaded = await supabase.storage.from("certificate-slips").upload(path, input.file, {
          upsert: true,
          contentType: input.file.type || "application/octet-stream",
        });
        if (uploaded.error) return { error: uploaded.error.message, id };
        const response = await fetch("/api/certificates/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        const data = (await response.json()) as { subjects?: Certificate["subjects"]; examBody?: string; year?: string; error?: string };
        const certificate: Certificate = {
          id,
          kind: input.kind,
          examBody: data.examBody || input.examBody,
          year: data.year || input.year,
          examNumber: input.examNumber,
          fileName: input.file.name,
          status: "pending_review",
          subjects: Array.isArray(data.subjects) ? data.subjects : [],
        };
        await supabase
          .from("certificates")
          .update({ exam_body: certificate.examBody, year: certificate.year })
          .eq("id", id);
        const subjectError = await replaceSubjects(certificate);
        setState((current) => ({ ...current, certificates: [certificate, ...current.certificates] }));
        return { id, error: subjectError ?? (!response.ok ? data.error : undefined) };
      },
      saveCertificate: async (certificate) => {
        const { error } = await supabase
          .from("certificates")
          .update({
            kind: certificate.kind,
            exam_body: certificate.examBody,
            year: certificate.year,
            exam_number: certificate.examNumber,
            status: certificate.status,
          })
          .eq("id", certificate.id);
        if (error) return error.message;
        const subjectError = await replaceSubjects(certificate);
        if (subjectError) return subjectError;
        setState((current) => ({
          ...current,
          certificates: current.certificates.some((item) => item.id === certificate.id)
            ? current.certificates.map((item) => (item.id === certificate.id ? certificate : item))
            : [certificate, ...current.certificates],
        }));
        return null;
      },
      postJob: async (job) => {
        let owner = employerId.current;
        if (!owner) {
          const created = await supabase
            .from("employers")
            .insert({ owner_id: userId.current, company_name: job.company, contact_email: job.applyEmail })
            .select("id")
            .single();
          if (created.error || !created.data) return created.error?.message ?? "The employer record was not created.";
          owner = created.data.id;
          employerId.current = owner;
        }
        const hash = await dedupeHash(job.company, job.title, job.city);
        const row = {
          employer_id: owner,
          source: "employer",
          dedupe_hash: hash,
          title: job.title,
          company_name: job.company,
          description: job.description,
          state: job.state,
          city: job.city,
          work_mode: job.workMode,
          salary_text: job.salary,
          employment_type: job.employmentType,
          apply_email: job.applyEmail,
          apply_url: job.applyUrl || null,
          qualification_min: job.qualification,
          english_credit: job.englishCredit,
          maths_credit: job.mathsCredit,
          min_credits: job.minCredits,
          required_subjects: list(job.requiredSubjects),
          required_skills: list(job.requiredSkills),
          category: job.lane,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          is_active: true,
        };
        const inserted = await supabase.from("jobs").insert(row).select("*").single();
        if (inserted.error) {
          if (inserted.error.code === "23505") return "This company, title, and city are already listed.";
          return inserted.error.message;
        }
        const saved = mapJob(inserted.data);
        setState((current) => ({ ...current, jobs: [saved, ...current.jobs] }));
        return null;
      },
      saveResume: (resume) => {
        setState((current) => {
          const exists = current.resumes.some((item) => item.id === resume.id);
          return {
            ...current,
            resumes: exists
              ? current.resumes.map((item) => (item.id === resume.id ? resume : item))
              : [resume, ...current.resumes],
          };
        });
        const pending = resumeWrites.get(resume.id);
        if (pending) clearTimeout(pending);
        resumeWrites.set(
          resume.id,
          setTimeout(() => {
            const owner = userId.current;
            if (!owner) return;
            void supabase
              .from("resumes")
              .upsert({
                id: resume.id,
                user_id: owner,
                kind: resume.kind,
                template_id: resume.templateId,
                title: resume.title,
                sections: { contactLine: resume.contactLine, fields: resume.fields },
                updated_at: new Date().toISOString(),
              })
              .then(({ error }) => {
                if (error) console.error(error.message);
              });
          }, 400),
        );
      },
      saveApplication: async (application) => {
        const { error } = await supabase.from("applications").upsert({
          id: application.id,
          user_id: userId.current,
          job_id: application.jobId || null,
          resume_id: application.resumeId || null,
          channel: application.channel,
          status: application.status,
          subject: application.subject,
          body: application.body,
          sent_at: application.status === "sent" ? new Date().toISOString() : null,
        });
        if (error) return error.message;
        setState((current) => {
          const exists = current.applications.some((item) => item.id === application.id);
          return {
            ...current,
            applications: exists
              ? current.applications.map((item) => (item.id === application.id ? application : item))
              : [application, ...current.applications],
          };
        });
        return null;
      },
      saveSettings: async (settings) => {
        const { error } = await supabase
          .from("profiles")
          .update({ job_alerts: settings.jobAlerts, show_olevel_lane: settings.showOlevelLane })
          .eq("id", userId.current);
        if (error) return error.message;
        setState((current) => ({ ...current, settings }));
        return null;
      },
      ensureToday: async () => {
        const response = await fetch("/api/picks/today", { method: "POST" });
        const data = (await response.json()) as { jobs?: Job[]; note?: string; error?: string };
        if (!response.ok) return data.error || "The morning list did not load.";
        setState((current) => ({ ...current, todayJobs: data.jobs ?? [], todayNote: data.note ?? "" }));
        return null;
      },
    };
  }, [ready, state]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used inside StoreProvider");
  return value;
}
