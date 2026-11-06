import Link from "next/link";

const columns = [
  {
    title: "Product",
    links: [
      ["Home", "/"],
      ["How it works", "/how-it-works"],
      ["Job seekers", "/job-seekers"],
      ["Employers", "/for-employers"],
      ["Pricing", "/pricing"],
    ],
  },
  {
    title: "Dashboard",
    links: [
      ["Today", "/today"],
      ["Jobs", "/jobs"],
      ["Certificates", "/certificates"],
      ["Resume", "/resumes"],
      ["Applications", "/applications"],
      ["Settings", "/settings"],
    ],
  },
  {
    title: "Account",
    links: [
      ["Sign in", "/login"],
      ["Privacy", "/privacy"],
      ["Profile", "/profile"],
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[#e4dccb] bg-[#1c1915] text-[#f3efe4]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <p className="font-display text-3xl">Vireon</p>
          <p className="mt-3 text-sm leading-relaxed text-[#d9d0c0]">
            A Nigeria job desk. Certificates, a daily shortlist, and a resume you can edit before anything is sent.
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.14em] text-[#a39886]">Lagos · West Africa Time</p>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a39886]">{column.title}</p>
            <ul className="mt-3 space-y-2">
              {column.links.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-[#f3efe4] hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-[#34302a] px-4 py-4 text-center text-xs text-[#a39886]">
        Vireon stores result slips and application text only for the account that uploaded them. Mail leaves the app only after Send.
      </div>
    </footer>
  );
}
