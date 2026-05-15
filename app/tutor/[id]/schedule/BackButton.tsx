"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  id?: string;
};

export default function BackButton({ id }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  let target = id;

  if (!target && pathname) {
    const parts = pathname.split("/").filter(Boolean);
    // expected: ["tutor", "<id>", "schedule"]
    if (parts.length >= 2 && parts[0] === "tutor") {
      target = parts[1];
    }
  }

  if (target) {
    return (
      <Link
        href={`/tutor/${target}`}
        className="inline-flex items-center gap-2 text-sm text-[var(--gelap)] hover:text-[var(--biru)]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span>Kembali</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-sm text-[var(--gelap)] hover:text-[var(--biru)]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
      <span>Kembali</span>
    </button>
  );
}
