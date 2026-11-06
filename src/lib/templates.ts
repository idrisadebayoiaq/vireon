import type { ResumeField } from "@/lib/types";

export type ResumeTemplate = {
  id: string;
  name: string;
  document: "resume" | "cv";
  audience: string;
  ats: string;
  fields: { label: string; hint: string }[];
};

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: "entry-one-page",
    name: "Entry role",
    document: "resume",
    audience: "O'level and first-job applicants in retail, front desk, warehouse, and support.",
    ats: "One column. Standard headings. No tables, icons, or text boxes.",
    fields: [
      { label: "Target role", hint: "The job title you want, such as Cashier or Front desk officer." },
      { label: "Professional summary", hint: "Three or four lines: where you live, your certificate, and the work you can do." },
      { label: "Certificates", hint: "Exam body, year, and credits that matter, especially English and Mathematics." },
      { label: "Skills", hint: "Plain list. Customer service, cash handling, spoken English." },
      { label: "Experience", hint: "Role, place, city, dates, and what you actually did. School duties count." },
      { label: "Availability", hint: "City, shift preference, and when you can start." },
    ],
  },
  {
    id: "graduate-trainee",
    name: "Graduate trainee",
    document: "resume",
    audience: "Degree holders applying to trainee seats in banks, telecoms, and FMCG.",
    ats: "Degree and NYSC sit in their own headings so a screen can find them.",
    fields: [
      { label: "Target programme", hint: "Name the trainee seat or department." },
      { label: "Summary", hint: "Degree, class of degree if you want it, NYSC status, and one strength." },
      { label: "Education", hint: "Institution, course, dates, and grade." },
      { label: "NYSC", hint: "State, place of primary assignment, and one result from the year." },
      { label: "Certificates", hint: "O'level and any professional paper." },
      { label: "Experience and projects", hint: "Internships, SIWES, and projects with a result in each bullet." },
      { label: "Skills", hint: "Tools and working skills, separated by commas." },
    ],
  },
  {
    id: "nysc-service",
    name: "NYSC year",
    document: "resume",
    audience: "Corps members applying during service or just after passing out.",
    ats: "Service year is a normal experience block, not a graphic timeline.",
    fields: [
      { label: "Headline", hint: "Course and the kind of role you want after service." },
      { label: "Summary", hint: "Where you are serving and what you want next." },
      { label: "Education", hint: "Degree or HND, school, and year." },
      { label: "Primary assignment", hint: "Organisation, state, dates, and duties." },
      { label: "Community development", hint: "What the CDS group did and your part in it." },
      { label: "O'level", hint: "WAEC, NECO, or NABTEB with the credits employers ask for." },
      { label: "Skills", hint: "Skills you used on the assignment." },
    ],
  },
  {
    id: "career-switch",
    name: "Career switch",
    document: "resume",
    audience: "People moving from one kind of work into another without hiding the old jobs.",
    ats: "Old job titles stay literal. The summary explains the move in plain language.",
    fields: [
      { label: "Role you want now", hint: "The new title, not the old one." },
      { label: "Why you are switching", hint: "Four lines. Name the overlap between the old work and the new role." },
      { label: "Transferable skills", hint: "Skills the new employer can use on day one." },
      { label: "Work history", hint: "Keep real titles and dates. Add a line on what carries over." },
      { label: "Training", hint: "Short courses, certificates, and the year." },
      { label: "Tools", hint: "Software and equipment you can already use." },
    ],
  },
  {
    id: "operations",
    name: "Operations",
    document: "resume",
    audience: "Warehouse, logistics, admin, and dispatch roles.",
    ats: "Numbers stay in the sentence: volumes, shifts, and error rates.",
    fields: [
      { label: "Target role", hint: "Operations assistant, dispatcher, storekeeper, or similar." },
      { label: "Summary", hint: "Years or months of floor work, city, and the certificate level." },
      { label: "Operations experience", hint: "What moved, how many, and what you recorded." },
      { label: "Tools and records", hint: "Spreadsheets, waybills, stock cards, radios." },
      { label: "Certificates", hint: "O'level, ND, or a safety card." },
      { label: "Shift and location", hint: "States you can work in and whether you can do nights." },
    ],
  },
  {
    id: "sales",
    name: "Sales",
    document: "resume",
    audience: "Shop sales, field sales, and business development.",
    ats: "Targets and products are written out. No chart images.",
    fields: [
      { label: "Target role", hint: "Sales associate, merchandiser, or business development." },
      { label: "Summary", hint: "What you sold, where, and the kind of customer." },
      { label: "Sales experience", hint: "Product, territory or shop, and a result you can stand behind." },
      { label: "Customer handling", hint: "How you open, follow up, and close." },
      { label: "Certificates", hint: "O'level or higher, plus any sales training." },
      { label: "Tools", hint: "POS, WhatsApp catalogues, spreadsheets." },
    ],
  },
  {
    id: "full-cv",
    name: "Full CV",
    document: "cv",
    audience: "A longer record for schools, NGOs, and roles that ask for a CV rather than a one-page resume.",
    ats: "Same headings a parser expects. The extra length is more history, not columns.",
    fields: [
      { label: "Profile", hint: "A short account of your field and the work you want." },
      { label: "Education", hint: "Every completed programme, newest first." },
      { label: "Certificates and licences", hint: "Exam bodies, professional papers, and expiry dates if any." },
      { label: "Employment", hint: "Each role with dates, city, and duties." },
      { label: "Projects or publications", hint: "Only work you can describe. Leave this blank if you have none." },
      { label: "Skills", hint: "Grouped in one paragraph or a comma list." },
      { label: "Referees", hint: "Name, role, organisation, phone. Or write 'Available on request'." },
    ],
  },
  {
    id: "care-support",
    name: "Care and support",
    document: "resume",
    audience: "Hospital attendants, caregivers, school aides, and clinic front desks.",
    ats: "Duties are concrete. Certificates and any health-and-safety training are separate.",
    fields: [
      { label: "Target role", hint: "The care or support title." },
      { label: "Summary", hint: "Who you have supported and in what setting." },
      { label: "Care experience", hint: "Duties, the kind of people, and the shift pattern." },
      { label: "Training", hint: "First aid, infection control, or on-the-job training." },
      { label: "Certificates", hint: "O'level or a health-related certificate." },
      { label: "Languages", hint: "Languages you can use with patients or families." },
    ],
  },
  {
    id: "teaching",
    name: "Teaching",
    document: "resume",
    audience: "Classroom assistants, lesson teachers, and lesson-note roles in schools.",
    ats: "Subject, class level, and school name are easy to scan.",
    fields: [
      { label: "Subject and level", hint: "For example, Mathematics, JSS 1 to JSS 3." },
      { label: "Summary", hint: "Years or months in a classroom and the certificate you hold." },
      { label: "Teaching experience", hint: "School, city, classes, and what improved." },
      { label: "Education and certificates", hint: "NCE, degree, or O'level, with the teaching subjects." },
      { label: "Classroom skills", hint: "Lesson notes, marking, parent communication." },
      { label: "Tools", hint: "Board work, worksheets, any learning app you actually use." },
    ],
  },
  {
    id: "professional-compact",
    name: "Professional compact",
    document: "resume",
    audience: "People with a few years of work who need a tight two-page resume.",
    ats: "Tight spacing, still one column, headings unchanged.",
    fields: [
      { label: "Headline", hint: "Title plus the industry." },
      { label: "Summary", hint: "Five lines. Scope of work, sector, and one outcome." },
      { label: "Experience", hint: "Two or three roles. Dates on the same line as the title." },
      { label: "Selected results", hint: "Three results with numbers or a clear before and after." },
      { label: "Education and certificates", hint: "Highest certificate first, then O'level if the role asks for it." },
      { label: "Skills", hint: "Only skills you can use without a handover." },
    ],
  },
];

export const scratchFields: { label: string; hint: string }[] = [
  { label: "Headline", hint: "Your name's line under the contact details. Say the work you want." },
  { label: "Summary", hint: "Write this yourself, or leave it for the AI." },
  { label: "New section", hint: "Rename this heading. Add more sections with the button below." },
];

export function templateById(id: string) {
  return resumeTemplates.find((template) => template.id === id);
}

export function templateName(id: string) {
  if (id === "scratch") return "From scratch";
  return templateById(id)?.name ?? "Custom";
}

export function makeFields(source: { label: string; hint: string }[]): ResumeField[] {
  return source.map((field) => ({
    id: crypto.randomUUID(),
    label: field.label,
    value: "",
    hint: field.hint,
  }));
}
