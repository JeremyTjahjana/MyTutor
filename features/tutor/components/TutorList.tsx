"use client";

import Link from "next/link";
import type { TutorListItem } from "@/types/tutor";
import TutorCard from "@/features/home/components/TutorCard";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, Suspense, useState } from "react";

type TutorListProps = {
  tutors: TutorListItem[];
};

const ITEMS_PER_PAGE = 9;

function TutorListContent({ tutors }: TutorListProps) {
  const searchParams = useSearchParams();
  const q = searchParams.get("q")?.toLowerCase() || "";
  const rating = Number(searchParams.get("rating")) || 0;
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTutors = useMemo(() => {
    return tutors.filter((tutor) => {
      const matchSearch =
        tutor.name.toLowerCase().includes(q) ||
        tutor.subjects.some((s) => s.toLowerCase().includes(q));

      const matchRating = tutor.rating >= rating;

      return matchSearch && matchRating;
    });
  }, [tutors, q, rating]);

  const totalPages = Math.ceil(filteredTutors.length / ITEMS_PER_PAGE);
  const paginatedTutors = filteredTutors.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [q, rating]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  if (filteredTutors.length === 0) {
    return (
      <section className="mx-auto w-full max-w-[1280px] px-2 py-10 text-center text-[var(--gelap)]/70 sm:px-6 md:px-8 lg:px-12">
        No tutors found matching your search.
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-[1280px] bg-[var(--putih)] px-2 py-2 text-[var(--gelap)] sm:px-6 sm:py-8 md:px-8 lg:px-12">
      <div className="mt-16 grid w-full grid-cols-1 justify-items-center gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginatedTutors.map((tutor) => (
          <Link
            key={tutor.id}
            href={`/tutors/${tutor.id}`}
            className="flex w-full justify-center"
          >
            <TutorCard
              profile={tutor.avatarUrl}
              name={tutor.name}
              role={tutor.subjects.join(", ")}
              description={tutor.bio}
              rating={tutor.rating}
            />
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-lg font-semibold text-[var(--gelap)] shadow-sm transition hover:border-[var(--biru)] hover:text-[var(--biru)] disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            aria-label="Halaman sebelumnya"
          >
            ‹
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                type="button"
                className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold shadow-sm transition ${
                  currentPage === page
                    ? "bg-[var(--biru)] text-white"
                    : "border border-slate-200 bg-white text-[var(--gelap)] hover:border-[var(--biru)] hover:text-[var(--biru)]"
                }`}
                onClick={() => setCurrentPage(page)}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            ),
          )}

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-lg font-semibold text-[var(--gelap)] shadow-sm transition hover:border-[var(--biru)] hover:text-[var(--biru)] disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            disabled={currentPage === totalPages}
            aria-label="Halaman berikutnya"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}

export function TutorList(props: TutorListProps) {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
      <TutorListContent {...props} />
    </Suspense>
  );
}
