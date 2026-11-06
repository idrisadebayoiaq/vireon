const CREDIT_GRADES = new Set(["A1", "B2", "B3", "C4", "C5", "C6"]);

export function isCredit(grade: string) {
  return CREDIT_GRADES.has(grade.trim().toUpperCase());
}

export function creditCount(subjects: { subject: string; grade: string }[]) {
  return subjects.filter((subject) => isCredit(subject.grade)).length;
}

export function hasCreditSubject(subjects: { subject: string; grade: string }[], needle: string) {
  const name = needle.toLowerCase();
  return subjects.some((subject) => subject.subject.toLowerCase().includes(name) && isCredit(subject.grade));
}
