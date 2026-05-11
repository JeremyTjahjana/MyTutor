import React from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import type { StaticImageData } from "next/image";

export type TestimonyCardData = {
  profile: string | StaticImageData;
  /** Name of the student giving the testimony */
  studentName: string;
  /** Subjects they studied with the tutor */
  subjects: string;
  message: string;
  rating: number;
};

const TestimonyCard = ({
  profile,
  studentName,
  subjects,
  message,
  rating,
}: TestimonyCardData) => {
  return (
    <article className="flex w-full shrink-0 min-h-[240px] flex-col gap-3 rounded-2xl border border-[var(--gelap)]/15 bg-[var(--putih)] p-4 shadow-[0px_2px_12px_0px_rgba(0,0,0,0.10)] sm:max-w-[330px] sm:min-h-[290px] sm:gap-4 sm:p-5 hover:scale-105 hover:opacity-90 active:scale-95 transition-transform duration-200 ease-out hover:shadow-[0px_4px_16px_0px_rgba(0,138,180,0.28)]">
      {/* Header: avatar + name + subjects */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--gelap)]/20 overflow-hidden sm:h-12 sm:w-12">
          <Image
            src={profile}
            alt={`${studentName} profile`}
            width={48}
            height={48}
            className="rounded-full object-cover w-full h-full"
          />
        </div>

        <div className="flex flex-1 flex-col">
          <p className="text-[15px] leading-5 font-semibold text-[var(--biru)] sm:text-base">
            {studentName}
          </p>
          <p className="text-[11px] leading-4 font-medium text-[var(--gelap)]/70 sm:text-xs">
            {subjects}
          </p>
        </div>
      </div>

      {/* Testimonial message */}
      <p className="flex-1 text-[12px] leading-5 text-[var(--gelap)]/80 sm:text-sm sm:leading-6">
        "{message}"
      </p>

      {/* Star rating */}
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, index) => {
          const filled = index < Math.max(0, Math.min(5, Math.round(rating)));
          return (
            <Image
              key={index}
              src={assets.star}
              alt={filled ? "Star filled" : "Star empty"}
              width={16}
              height={16}
              className={`${filled ? "opacity-100" : "opacity-30"} h-3.5 w-3.5 sm:h-4 sm:w-4`}
            />
          );
        })}
      </div>
    </article>
  );
};

export default TestimonyCard;
