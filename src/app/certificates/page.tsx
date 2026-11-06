"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { useStore } from "@/lib/store";
import { KIND_LABEL } from "@/lib/types";

export default function CertificatesPage() {
  const { state } = useStore();

  return (
    <div>
      <PageHeader
        title="Certificates"
        lede="Add an O'level result first. A later ND, HND, or degree sits beside it."
      />
      <Link
        href="/certificates/new"
        className="inline-flex min-h-11 items-center rounded-full bg-[#0e6b4f] px-4 text-sm font-semibold text-[#f7f3ea]"
      >
        Add result
      </Link>
      {state.certificates.length === 0 ? (
        <p className="mt-6 text-sm text-[#5c564c]">No results yet. Add a WAEC, NECO, or later certificate.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {state.certificates.map((certificate) => (
            <li key={certificate.id}>
              <Link href={`/certificates/${certificate.id}`} className="block rounded-2xl border border-[#e4dccb] bg-[#fffdf8] p-4">
                <p className="font-display text-2xl">{KIND_LABEL[certificate.kind]}</p>
                <p className="text-sm text-[#5c564c]">
                  {certificate.examBody} · {certificate.year || "Year not set"} · {certificate.status === "confirmed" ? "Confirmed" : "Needs review"}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
