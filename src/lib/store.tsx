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
  type Application,
  type Certificate,
  type Experience,
  type Job,
  type Profile,
  type ResumeDoc,
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
});

const StoreContext = createContext<StoreValue | null>(null);

function loadState(): SessionState {
  const saved = sessionStorage.getItem(STORAGE_KEY);
  if (!saved) return defaultState();
  try {
    return { ...defaultState(), ...JSON.parse(saved) };
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
