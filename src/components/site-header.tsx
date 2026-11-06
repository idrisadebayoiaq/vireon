"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";

const links = [
  ["How it works", "/how-it-works"],
  ["Job seekers", "/job-seekers"],
  ["Employers", "/for-employers"],
  ["Pricing", "/pricing"],
];

export function SiteHeader() {
  const pathname = usePathname();
  const { ready, state } = useStore();

  return (
    <header className="sticky top-0 z-20 border-b border-[#e4dccb] bg-[#f7f3ea]/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="font-display text-2xl tracking-tight">
          Vireon
        </Link>
        <nav className="hidden items-center gap-5 md:flex">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium ${pathname === href ? "text-[#0e6b4f]" : "text-[#3d3832]"}`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {ready && state.authed ? (
            <Link href="/today" className="inline-flex min-h-11 items-center rounded-full bg-[#0e6b4f] px-4 text-sm font-semibold text-[#f7f3ea]">
              Open dashboard
            </Link>
          ) : (
            <Link href="/login" className="inline-flex min-h-11 items-center rounded-full bg-[#1c1915] px-4 text-sm font-semibold text-[#f7f3ea]">
              Sign in
            </Link>
          )}
        </div>
      </div>
      <nav className="flex gap-2 overflow-x-auto px-4 pb-3 md:hidden">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-xs font-semibold">
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
