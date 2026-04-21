import React from "react";
import { assets } from "../../assets/assets";
import Image, { StaticImageData } from "next/image";

type TutorCardProps = {
  profile: StaticImageData;
  name: string;
  role: string;
  description: string;
  rating: number;
};

const TutorCard = ({ profile, name, role, description, rating }: TutorCardProps) => {
  return (
    <article className="flex w-[265px] shrink-0 min-h-[240px] flex-row items-start gap-3 rounded-2xl border border-[var(--gelap)]/15 bg-[var(--putih)] p-4 shadow-[0px_2px_12px_0px_rgba(0,0,0,0.10)] sm:w-full sm:max-w-[330px] sm:min-h-[290px] sm:gap-4 sm:p-5">
      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--gelap)]/20 bg-[var(--putih)] text-[var(--gelap)]/60 sm:h-12 sm:w-12">
        <Image
          src={profile}
          alt={`${name} profile`}
          width={48}
          height={48}
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col justify-start">
        <div className="flex flex-col">
          <p className="text-[18px] leading-5 font-semibold text-[var(--biru)] sm:text-base sm:leading-normal">
            {name}
          </p>
          <p className="text-[12px] leading-5 font-semibold text-[var(--gelap)]/80 sm:text-sm sm:leading-normal">
            {role}
          </p>
        </div>

        <p className="mt-3 text-[12px] leading-5 text-[var(--gelap)]/80 sm:mt-4 sm:text-sm sm:leading-6">
          {description}
        </p>

        <div className="mt-4 flex w-full justify-start gap-1 sm:mt-6 sm:gap-1.5">
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
      </div>
    </article>
  );
};

export default TutorCard;
