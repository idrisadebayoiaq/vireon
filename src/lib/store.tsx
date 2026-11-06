"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { sampleJobs } from "@/lib/sample-jobs";
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
  type ResumeField,
  type Skill,
} from "@/lib/types";

const STORAGE_KEY = "vireon-session-v1";

type SessionState = {
  authed: boolean;
  email: string;
  profile: Profile;
  skills: Skill[];
  experiences: Experience[];
  certificates: Certificate[];
  postedJobs: Job[];
  resumes: ResumeDoc[];
  applications: Application[];
  settings: DeskSettings;
};

type StoreValue = {
  ready: boolean;
  state: SessionState;
  jobs: Job[];
  signIn: (email: string) => void;
  signOut: () => void;
  saveProfile: (profile: Profile) => void;
  addSkill: (skill: Skill) => void;
  removeSkill: (id: string) => void;
  saveExperience: (experience: Experience) => void;
  removeExperience: (id: string) => void;
  saveCertificate: (certificate: Certificate) => void;
  postJob: (job: Job) => void;
  saveResume: (resume: ResumeDoc) => void;
  saveApplication: (application: Application) => void;
  saveSettings: (settings: DeskSettings) => void;
};

const defaultState = (): SessionState => ({
  authed: false,
  email: "",
  profile: emptyProfile(),
  skills: [],
  experiences: [],
  certificates: [],
  postedJobs: [],
  resumes: [],
  applications: [],
  settings: emptySettings(),
});

const legacyTemplates: Record<string, string> = {
  classic: "entry-one-page",
  compact: "professional-compact",
  clean: "full-cv",
};

function migrateResume(raw: unknown): ResumeDoc | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const id = typeof item.id === "string" ? item.id : crypto.randomUUID();
  const kind = item.kind === "cv" ? "cv" : "resume";
  const title = typeof item.title === "string" ? item.title : kind === "cv" ? "My CV" : "My resume";
  const updatedAt = typeof item.updatedAt === "string" ? item.updatedAt : "";
  const contactLine = typeof item.contactLine === "string" ? item.contactLine : "";

  if (Array.isArray(item.fields)) {
    const fields: ResumeField[] = item.fields.map((field) => {
      const row = field as Record<string, unknown>;
      return {
        id: typeof row.id === "string" ? row.id : crypto.randomUUID(),
        label: typeof row.label === "string" ? row.label : "Section",
        value: typeof row.value === "string" ? row.value : "",
        hint: typeof row.hint === "string" ? row.hint : "",
      };
    });
    return {
      id,
      kind,
      templateId: typeof item.templateId === "string" ? legacyTemplates[item.templateId] ?? item.templateId : "scratch",
      title,
      updatedAt,
      contactLine,
      fields,
    };
  }

  const sections = (item.sections ?? {}) as Record<string, unknown>;
  const text = (key: string) => {
    const value = sections[key];
    return typeof value === "string" ? value : "";
  };
  return {
    id,
    kind,
    templateId: legacyTemplates[String(item.templateId)] ?? "entry-one-page",
    title,
    updatedAt,
    contactLine,
    fields: [
      ["Headline", text("headline")],
      ["Summary", text("summary")],
      ["Certificates", text("certificates")],
      ["Skills", text("skills")],
      ["Experience", text("experience")],
      ["Custom", text("custom")],
    ].map(([label, value]) => ({
      id: crypto.randomUUID(),
      label,
      value,
      hint: "",
    })),
  };
}

const StoreContext = createContext<StoreValue | null>(null);

function loadState(): SessionState {
  const saved = sessionStorage.getItem(STORAGE_KEY);
  if (!saved) return defaultState();
  try {
    const parsed = JSON.parse(saved) as Partial<SessionState>;
    return {
      ...defaultState(),
      ...parsed,
      settings: { ...emptySettings(), ...(parsed.settings ?? {}) },
      resumes: Array.isArray(parsed.resumes) ? parsed.resumes.map(migrateResume).filter((item) => item !== null) : [],
    };
  } catch {
    return defaultState();
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<SessionState>(defaultState);

  useEffect(() => {
    setState(loadState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [ready, state]);

  const value = useMemo<StoreValue>(() => {
    const patch = (partial: Partial<SessionState>) =>
      setState((current) => ({ ...current, ...partial }));

    return {
      ready,
      state,
      jobs: [...state.postedJobs, ...sampleJobs],
      signIn: (email) => patch({ authed: true, email }),
      signOut: () => patch({ authed: false }),
      saveProfile: (profile) => patch({ profile }),
      addSkill: (skill) => patch({ skills: [...state.skills, skill] }),
      removeSkill: (id) => patch({ skills: state.skills.filter((skill) => skill.id !== id) }),
      saveExperience: (experience) => {
        const exists = state.experiences.some((item) => item.id === experience.id);
        patch({
          experiences: exists
            ? state.experiences.map((item) => (item.id === experience.id ? experience : item))
            : [...state.experiences, experience],
        });
      },
      removeExperience: (id) =>
        patch({ experiences: state.experiences.filter((item) => item.id !== id) }),
      saveCertificate: (certificate) => {
        const exists = state.certificates.some((item) => item.id === certificate.id);
        patch({
          certificates: exists
            ? state.certificates.map((item) => (item.id === certificate.id ? certificate : item))
            : [...state.certificates, certificate],
        });
      },
      postJob: (job) => patch({ postedJobs: [job, ...state.postedJobs] }),
      saveResume: (resume) => {
        const exists = state.resumes.some((item) => item.id === resume.id);
        patch({
          resumes: exists
            ? state.resumes.map((item) => (item.id === resume.id ? resume : item))
            : [resume, ...state.resumes],
        });
      },
      saveSettings: (settings) => patch({ settings }),
      saveApplication: (application) => {
        const exists = state.applications.some((item) => item.id === application.id);
        patch({
          applications: exists
            ? state.applications.map((item) => (item.id === application.id ? application : item))
            : [application, ...state.applications],
        });
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
