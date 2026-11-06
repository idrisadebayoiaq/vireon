"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useStore } from "@/lib/store";

const links = [
  { href: "/profile", label: "Profile" },
  { href: "/today", label: "Today" },
  { href: "/jobs", label: "Jobs" },
  { href: "/certificates", label: "Certificates" },
  { href: "/resumes", label: "Resume" },
  { href: "/applications", label: "Applications" },
  { href: "/settings", label: "Settings" },
];

const publicPaths = ["/", "/how-it-works", "/job-seekers", "/for-employers", "/pricing", "/login", "/privacy"];

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, state, signOut } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const isPublic = publicPaths.includes(pathname);

  useEffect(() => {
    if (!ready) return;
    if (!state.authed && !isPublic) router.replace("/login");
    if (state.authed && pathname === "/login") router.replace("/today");
  }, [ready, state.authed, pathname, router, isPublic]);

  if (!ready) {
    return <div className="min-h-screen bg-[#f3efe4]" />;
  }

  if (!state.authed && !isPublic) {
    return <div className="min-h-screen bg-[#f3efe4]" />;
  }

  if (isPublic) {
    return <div className="min-h-screen bg-[#f3efe4]">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#f3efe4] text-[#1c1915]">
      <header className="sticky top-0 z-20 border-b border-[#e4dccb] bg-[#f7f3ea]/95 backdrop-blur">
        <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
          <Link href="/today" className="font-display text-2xl tracking-tight">
            Vireon
          </Link>
          <div className="relative">
            <button
              type="button"
              className="min-h-11 rounded-full border border-[#d9d0c0] bg-white px-3 text-sm"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {state.email || "Account"}
            </button>
            {menuOpen ? (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-[#e4dccb] bg-white p-2 shadow-none">
                <Link className="block rounded-xl px-3 py-2 text-sm hover:bg-[#f3efe4]" href="/" onClick={() => setMenuOpen(false)}>
                  Marketing site
                </Link>
                <Link className="block rounded-xl px-3 py-2 text-sm hover:bg-[#f3efe4]" href="/profile" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
                <Link className="block rounded-xl px-3 py-2 text-sm hover:bg-[#f3efe4]" href="/settings" onClick={() => setMenuOpen(false)}>
                  Settings
                </Link>
                <button
                  type="button"
                  className="block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-[#f3efe4]"
                  onClick={() => {
                    setMenuOpen(false);
                    signOut();
                    router.push("/login");
                  }}
                >
                  Sign out
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div className="md:grid md:grid-cols-[220px_minmax(0,1fr)]">
        <nav className="hidden border-r border-[#e4dccb] px-3 py-6 md:block">
          <ul className="space-y-1">
            {links.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block rounded-xl px-3 py-2 text-sm font-medium ${active ? "bg-[#0e6b4f] text-[#f7f3ea]" : "hover:bg-[#efe8da]"}`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <main className="px-4 py-6 pb-28 md:px-8 md:pb-10">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-[#e4dccb] bg-[#f7f3ea] md:hidden">
        <ul className="flex gap-1 overflow-x-auto px-2 py-2">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold ${active ? "bg-[#0e6b4f] text-[#f7f3ea]" : "text-[#3d3832]"}`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
