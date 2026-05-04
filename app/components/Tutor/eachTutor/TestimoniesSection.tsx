import Image from "next/image";
import type { TutorDetail, TutorTestimony } from "./types";

interface TestimoniesSectionProps {
  tutor: TutorDetail;
}

function renderStars(rating: number) {
  return Array.from({ length: 5 }).map((_, index) => (
    <span
      key={index}
      className={`text-sm sm:text-base ${index < rating ? "text-[var(--kuning)]" : "text-[var(--gelap)]/20"}`}
    >
      ★
    </span>
  ));
}

function TestimonyCard({
  tutor,
  testimony,
  index,
}: {
  tutor: TutorDetail;
  testimony: TutorTestimony;
  index: number;
}) {
  return (
    <article
      key={`${testimony.studentName}-${testimony.createdAt}-${index}`}
      className="w-[300px] shrink-0 rounded-[22px] border border-[var(--gelap)]/20 bg-[var(--putih)] p-4 shadow-[0px_2px_10px_rgba(0,0,0,0.12)] sm:w-[340px] sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-0.5">
            {renderStars(testimony.rating)}
          </div>

          <div className="mt-2 flex items-start gap-3">
            <Image
              src={tutor.profile}
              alt={`${tutor.name} profile`}
              width={28}
              height={28}
              className="h-7 w-7 rounded-full object-cover"
            />
            <div>
              <p className="text-[16px] font-semibold text-[var(--biru)] sm:text-[18px]">
                {testimony.studentName}
              </p>
              <p className="text-[12px] text-[var(--gelap)]/75 sm:text-sm">
                {testimony.createdAt}
              </p>
            </div>
          </div>
        </div>

        <span className="text-2xl leading-none text-[var(--biru)]/70">›</span>
      </div>
      <p className="mt-4 text-[13px] leading-6 text-[var(--gelap)]/85 sm:text-[15px] sm:leading-7">
        “{testimony.message}”
      </p>
    </article>
  );
}

export function TestimoniesSection({ tutor }: TestimoniesSectionProps) {
  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold text-[var(--biru)] sm:text-xl">
        Testimoni
      </h2>

      <div className="mt-2 flex gap-3 overflow-x-auto pb-2">
        {tutor.testimonies.map((testimony, index) => (
          <TestimonyCard
            key={`${testimony.studentName}-${testimony.createdAt}-${index}`}
            tutor={tutor}
            testimony={testimony}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
