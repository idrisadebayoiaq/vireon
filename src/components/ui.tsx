import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
}) {
  return (
    <header className="mb-6">
      {eyebrow ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#0e6b4f]">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="font-display text-3xl leading-tight tracking-tight text-[#1c1915] md:text-4xl">
        {title}
      </h1>
      {lede ? <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[#5c564c]">{lede}</p> : null}
    </header>
  );
}

export function Button({
  children,
  type = "button",
  disabled,
  onClick,
  tone = "primary",
}: {
  children: ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  tone?: "primary" | "secondary" | "ghost";
}) {
  const tones = {
    primary: "bg-[#0e6b4f] text-[#f7f3ea] hover:bg-[#084737]",
    secondary: "bg-[#1c1915] text-[#f7f3ea] hover:bg-[#34302a]",
    ghost: "border border-[#d9d0c0] bg-transparent text-[#1c1915] hover:bg-[#efe8da]",
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${tones[tone]}`}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[#3d3832]">{label}</span>
      {children}
    </label>
  );
}

export const controlClass =
  "min-h-11 w-full rounded-xl border border-[#d9d0c0] bg-white px-3 text-sm text-[#1c1915] outline-none focus:border-[#0e6b4f]";
