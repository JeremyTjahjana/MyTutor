import React from "react";
import { assets } from "../../assets/assets";
import Image from "next/image";

type TestiCardProps = {
  name: string;
  role: string;
  description: string;
};

const TestiCard = ({ name, role, description }: TestiCardProps) => {
  return (
    <article className="flex w-full max-w-[330px] min-h-[290px] flex-row items-start gap-4 rounded-2xl border border-[var(--gelap)]/15 bg-[var(--putih)] p-5 shadow-[0px_2px_12px_0px_rgba(0,0,0,0.10)]">
      <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--gelap)]/20 bg-[var(--putih)] text-[var(--gelap)]/60">
        <span className="text-[10px] font-bold">IMG</span>
      </div>

      <div className="flex flex-1 flex-col justify-start">
        <div className="flex flex-col">
          <p className="text-base font-semibold text-[var(--biru)]">{name}</p>
          <p className="text-sm font-semibold text-[var(--gelap)]/80">{role}</p>
        </div>

        <p className="mt-4 text-sm leading-6 text-[var(--gelap)]/80">
          {description}
        </p>

        <div className="mt-6 flex w-full justify-start gap-1.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Image
              key={index}
              src={assets.star}
              alt="Star"
              className="h-4 w-4"
            />
          ))}
        </div>
      </div>
    </article>
  );
};

export default TestiCard;
