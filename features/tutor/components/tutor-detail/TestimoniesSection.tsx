"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { Testimony } from "@/types/tutor";
import { assets } from "@/assets/assets";

interface TestimoniesSectionProps {
  testimonies: Testimony[];
}

const PAGE_SIZE = 4;

function renderStars(rating: number) {
  return Array.from({ length: 5 }).map((_, index) => (
    <span
      key={index}
      className={`text-sm sm:text-base ${
        index < rating ? "text-[var(--kuning)]" : "text-[var(--gelap)]/20"
      }`}
    >
      {"\u2605"}
    </span>
  ));
}

function TestimonyCard({ testimony }: { testimony: Testimony }) {
  const formattedDate = new Date(testimony.createdAt).toLocaleDateString(
    "id-ID",
    { day: "numeric", month: "short", year: "numeric" },
  );

  return (
    <article className="flex h-full flex-col rounded-2xl border border-[var(--gelap)]/15 bg-[var(--putih)] p-4 shadow-[0px_4px_0px_rgba(15,23,42,0.10),0px_8px_16px_rgba(15,23,42,0.10)] sm:p-5">
      <div>
        <div className="flex items-center gap-0.5">
          {renderStars(testimony.rating)}
        </div>
        <div className="mt-2 flex items-start gap-3">
          <Image
            src={assets.profile}
            alt={`${testimony.studentName} profile`}
            width={28}
            height={28}
            className="h-7 w-7 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-[16px] font-semibold text-[var(--biru)] sm:text-[18px]">
              {testimony.studentName}
            </p>
            <p className="text-[12px] text-[var(--gelap)]/75 sm:text-sm">
              {formattedDate}
            </p>
          </div>
        </div>
      </div>
      <p className="mt-4 text-[13px] leading-6 text-[var(--gelap)]/85 sm:text-[15px] sm:leading-7">
        "{testimony.message}"
      </p>
    </article>
  );
}

export function TestimoniesSection({ testimonies }: TestimoniesSectionProps) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(testimonies.length / PAGE_SIZE);
  const visibleTestimonies = useMemo(
    () => testimonies.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [page, testimonies],
  );
  const hasPagination = totalPages > 1;

  return (
    <section className="mt-8 rounded-3xl border border-[var(--gelap)]/10 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-[var(--biru)] sm:text-xl">
          Testimoni
        </h2>
        {testimonies.length > 0 ? (
          <span className="rounded-full bg-[var(--kuning)]/20 px-3 py-1 text-xs font-semibold text-[var(--gelap)]/70">
            {testimonies.length} ulasan
          </span>
        ) : null}
      </div>

      {testimonies.length === 0 ? (
        <p className="mt-3 text-sm text-[var(--gelap)]/45 italic">
          Belum ada testimoni dari mahasiswa.
        </p>
      ) : (
        <>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {visibleTestimonies.map((testimony) => (
              <TestimonyCard key={testimony.id} testimony={testimony} />
            ))}
          </div>

          {hasPagination ? (
            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(0, current - 1))}
                disabled={page === 0}
                className="rounded-full border border-[var(--biru)] px-4 py-2 text-sm font-semibold text-[var(--biru)] transition-colors hover:bg-[var(--biru)]/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Sebelumnya
              </button>
              <span className="text-sm font-medium text-[var(--gelap)]/55">
                {page + 1} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() =>
                  setPage((current) => Math.min(totalPages - 1, current + 1))
                }
                disabled={page >= totalPages - 1}
                className="rounded-full border border-[var(--biru)] px-4 py-2 text-sm font-semibold text-[var(--biru)] transition-colors hover:bg-[var(--biru)]/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Berikutnya
              </button>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
