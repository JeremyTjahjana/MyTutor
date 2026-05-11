"use client";

import Link from "next/link";
import type { TutorListItem } from "@/types/tutor";
import TutorCard from "@/features/home/components/TutorCard";
import { assets } from "@/assets/assets";
import { useSearchParams } from "next/navigation";
import { useMemo, Suspense } from "react";

type TutorListProps = {
  tutors: TutorListItem[];
};

function TutorListContent({ tutors }: TutorListProps) {
  const searchParams = useSearchParams();
  const q = searchParams.get("q")?.toLowerCase() || "";
  const rating = Number(searchParams.get("rating")) || 0;

  const filteredTutors = useMemo(() => {
    return tutors.filter((tutor) => {
      const matchSearch =
        tutor.name.toLowerCase().includes(q) ||
        tutor.subjects.some((s) => s.toLowerCase().includes(q));

      const matchRating = tutor.rating >= rating;

      return matchSearch && matchRating;
    });
  }, [tutors, q, rating]);

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
        {filteredTutors.map((tutor) => (
          <Link
            key={tutor.id}
            href={`/tutors/${tutor.id}`}
            className="flex w-full justify-center"
          >
            <TutorCard
              profile={tutor.avatarUrl ?? assets.mehehe}
              name={tutor.name}
              role={tutor.subjects.join(", ")}
              description={tutor.bio}
              rating={tutor.rating}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}

export function TutorList(props: TutorListProps) {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <TutorListContent {...props} />
    </Suspense>
  );
}
