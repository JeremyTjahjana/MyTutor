import Image from "next/image";
import type { TutorDetail } from "./types";

interface TutorHeaderProps {
  tutor: TutorDetail;
}

export function TutorHeader({ tutor }: TutorHeaderProps) {
  return (
    <section className="mt-6 flex items-start gap-3 sm:gap-4">
      <Image
        src={tutor.profile}
        alt={`${tutor.name} profile`}
        width={48}
        height={48}
        className="mt-1 h-11 w-11 rounded-full border border-[var(--gelap)]/15 object-cover lg:h-20 lg:w-20 sm:h-12 sm:w-12"
      />

      <div className="min-w-0 flex-1">
        <h1 className="text-[30px] leading-none font-bold text-[var(--biru)] sm:text-[42px]">
          {tutor.name}
        </h1>
        <p className="mt-1 text-sm font-semibold tracking-wider text-[var(--gelap)] sm:text-base">
          {tutor.matkuls.join(", ")}
        </p>
      </div>
    </section>
  );
}
