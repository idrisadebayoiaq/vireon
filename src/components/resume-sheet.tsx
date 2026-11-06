import type { CSSProperties } from "react";
import type { ResumeDoc } from "@/lib/types";
import type { ResumeTemplate } from "@/lib/templates";

export type SheetLayout =
  | "classic"
  | "sidebar"
  | "band"
  | "split"
  | "minimal"
  | "executive"
  | "compact"
  | "serif"
  | "contrast"
  | "ruled";

export type SheetStyle = {
  layout: SheetLayout;
  accent: string;
  accentText: string;
  paper: string;
  ink: string;
  muted: string;
  rule: string;
  serif: boolean;
};

const sans = 'Arial, Helvetica, sans-serif';
const serif = 'Georgia, "Times New Roman", serif';

export const sheetStyles: Record<string, SheetStyle> = {
  scratch: { layout: "classic", accent: "#1f2933", accentText: "#ffffff", paper: "#ffffff", ink: "#1c1915", muted: "#5c564c", rule: "#1c1915", serif: false },
  "entry-one-page": { layout: "classic", accent: "#1f2933", accentText: "#ffffff", paper: "#ffffff", ink: "#1c1915", muted: "#5c564c", rule: "#1c1915", serif: true },
  "graduate-trainee": { layout: "band", accent: "#0e6b4f", accentText: "#f4fbf8", paper: "#ffffff", ink: "#14221c", muted: "#4d6158", rule: "#0e6b4f", serif: false },
  "nysc-service": { layout: "sidebar", accent: "#143d33", accentText: "#f3f7f5", paper: "#ffffff", ink: "#1c1915", muted: "#5c564c", rule: "#143d33", serif: false },
  "career-switch": { layout: "split", accent: "#8a3d18", accentText: "#fff8f3", paper: "#ffffff", ink: "#1c1915", muted: "#5c564c", rule: "#8a3d18", serif: false },
  operations: { layout: "compact", accent: "#243044", accentText: "#ffffff", paper: "#ffffff", ink: "#1b2430", muted: "#526070", rule: "#243044", serif: false },
  sales: { layout: "contrast", accent: "#102a43", accentText: "#f0f4f8", paper: "#ffffff", ink: "#102a43", muted: "#486581", rule: "#d9e2ec", serif: false },
  "full-cv": { layout: "serif", accent: "#3f3a34", accentText: "#ffffff", paper: "#fffdf8", ink: "#231f1a", muted: "#6b6256", rule: "#3f3a34", serif: true },
  "care-support": { layout: "minimal", accent: "#0f5c75", accentText: "#ffffff", paper: "#ffffff", ink: "#16323a", muted: "#5d737a", rule: "#0f5c75", serif: false },
  teaching: { layout: "ruled", accent: "#7a2f12", accentText: "#fff7f2", paper: "#ffffff", ink: "#24160f", muted: "#6d564a", rule: "#7a2f12", serif: true },
  "professional-compact": { layout: "executive", accent: "#111827", accentText: "#ffffff", paper: "#ffffff", ink: "#111827", muted: "#4b5563", rule: "#111827", serif: false },
};

export function styleFor(templateId: string) {
  return sheetStyles[templateId] ?? sheetStyles.scratch;
}

export function previewDocument(template: ResumeTemplate): ResumeDoc {
  return {
    id: template.id,
    kind: template.document,
    templateId: template.id,
    title: template.name,
    updatedAt: "",
    contactLine: "Lagos · 0803 000 0000 · name@email.com",
    fields: template.fields.map((field, index) => ({
      id: `${template.id}-${index}`,
      label: field.label,
      value: index === 0 ? "The role you want, written in one line." : "A short paragraph showing how this section looks on the page.",
      hint: field.hint,
    })),
  };
}

function lines(value: string) {
  return value.split("\n").map((line) => line.trim()).filter(Boolean);
}

export function ResumeSheet({
  doc,
  name,
}: {
  doc: ResumeDoc;
  name: string;
}) {
  const style = styleFor(doc.templateId);
  const font = style.serif ? serif : sans;
  const sections = doc.fields.filter((field) => field.label.trim() || field.value.trim());
  const sidebar = sections.filter((field) => /skill|tool|language|contact/i.test(field.label));
  const main = style.layout === "sidebar" ? sections.filter((field) => !sidebar.includes(field)) : sections;

  const sheet: CSSProperties = {
    width: 794,
    minHeight: 1123,
    background: style.paper,
    color: style.ink,
    fontFamily: font,
    boxSizing: "border-box",
  };

  function heading(label: string) {
    return (
      <h2
        style={{
          margin: "0 0 6px",
          fontFamily: font,
          fontSize: style.layout === "compact" ? 11 : 12,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: style.layout === "minimal" ? style.accent : style.ink,
          borderBottom: style.layout === "minimal" ? "none" : `1.5px solid ${style.rule}`,
          paddingBottom: 4,
        }}
      >
        {label || "Section"}
      </h2>
    );
  }

  function body(value: string) {
    const rows = lines(value);
    if (rows.length === 0) {
      return <p style={{ margin: 0, color: style.muted, fontSize: 13 }}>This section is empty.</p>;
    }
    return rows.map((row) => (
      <p key={row} style={{ margin: "0 0 4px", fontSize: style.layout === "compact" ? 12 : 13.5, lineHeight: 1.45, whiteSpace: "pre-wrap" }}>
        {row}
      </p>
    ));
  }

  function block(field: (typeof sections)[number]) {
    return (
      <section key={field.id} style={{ marginBottom: style.layout === "compact" ? 12 : 16 }}>
        {heading(field.label)}
        {body(field.value)}
      </section>
    );
  }

  const displayName = name.trim() || "Your name";
  const contact = doc.contactLine.trim() || "City · phone · email";

  if (style.layout === "sidebar") {
    return (
      <article style={{ ...sheet, display: "flex" }}>
        <aside style={{ width: 248, background: style.accent, color: style.accentText, padding: "36px 24px", boxSizing: "border-box" }}>
          <h1 style={{ margin: 0, fontFamily: font, fontSize: 28, lineHeight: 1.1, fontWeight: 700 }}>{displayName}</h1>
          <p style={{ margin: "12px 0 0", fontSize: 12, lineHeight: 1.5 }}>{contact}</p>
          <div style={{ marginTop: 28 }}>{(sidebar.length ? sidebar : sections.slice(0, 1)).map((field) => (
            <section key={field.id} style={{ marginBottom: 16 }}>
              <h2 style={{ margin: "0 0 6px", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" }}>{field.label}</h2>
              {lines(field.value).length === 0 ? <p style={{ margin: 0, fontSize: 12, opacity: 0.8 }}>This section is empty.</p> : lines(field.value).map((row) => (
                <p key={row} style={{ margin: "0 0 4px", fontSize: 12.5, lineHeight: 1.45 }}>{row}</p>
              ))}
            </section>
          ))}</div>
        </aside>
        <div style={{ flex: 1, padding: "36px 32px" }}>{(sidebar.length ? main : sections.slice(1)).map(block)}</div>
      </article>
    );
  }

  if (style.layout === "band" || style.layout === "contrast") {
    return (
      <article style={sheet}>
        <header style={{ background: style.accent, color: style.accentText, padding: style.layout === "contrast" ? "42px 40px 28px" : "36px 40px" }}>
          <h1 style={{ margin: 0, fontFamily: font, fontSize: style.layout === "contrast" ? 40 : 34, lineHeight: 1.05, fontWeight: 700 }}>{displayName}</h1>
          <p style={{ margin: "10px 0 0", fontSize: 13 }}>{contact}</p>
        </header>
        <div style={{ padding: "28px 40px 40px", display: style.layout === "contrast" ? "grid" : "block", gridTemplateColumns: "1fr 1fr", columnGap: 28 }}>
          {sections.map(block)}
        </div>
      </article>
    );
  }

  if (style.layout === "split") {
    return (
      <article style={{ ...sheet, padding: "40px 40px 48px" }}>
        <h1 style={{ margin: 0, fontSize: 36, lineHeight: 1.05 }}>{displayName}</h1>
        <p style={{ margin: "8px 0 0", color: style.accent, fontSize: 13, fontWeight: 700 }}>{contact}</p>
        <div style={{ height: 3, background: style.accent, margin: "16px 0 22px" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 28 }}>{sections.map(block)}</div>
      </article>
    );
  }

  const centered = style.layout === "classic" || style.layout === "serif";
  return (
    <article style={{ ...sheet, padding: style.layout === "compact" ? "28px 36px" : "44px 48px 52px", textAlign: centered ? "center" : "left" }}>
      <h1 style={{ margin: 0, fontFamily: font, fontSize: style.layout === "executive" ? 42 : style.layout === "compact" ? 28 : 36, lineHeight: 1.05, fontWeight: 700 }}>{displayName}</h1>
      <p style={{ margin: "8px 0 0", color: style.muted, fontSize: 13 }}>{contact}</p>
      <div style={{ height: style.layout === "ruled" ? 0 : 2, borderTop: style.layout === "ruled" ? `4px double ${style.rule}` : undefined, background: style.layout === "ruled" ? undefined : style.rule, margin: "14px auto 22px", width: centered ? 120 : "100%" }} />
      <div style={{ textAlign: "left" }}>{sections.map(block)}</div>
    </article>
  );
}
