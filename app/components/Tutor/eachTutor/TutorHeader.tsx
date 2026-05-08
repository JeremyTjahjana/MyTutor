import Image from "next/image";
import { assets } from "@/app/assets/assets";

interface TutorHeaderProps {
  name: string;
  avatarUrl: string | null;
  subjects: string[];
  costPerHour: number;
  rating: number;
}

export function TutorHeader({ name, avatarUrl, subjects, costPerHour, rating }: TutorHeaderProps) {
  const formattedFee = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(costPerHour);

  return (
    <section className="mt-6 flex items-start gap-3 sm:gap-4">
      <Image
        src={avatarUrl ?? assets.mehehe}
        alt={`${name} profile`}
        width={80}
        height={80}
        className="mt-1 h-11 w-11 rounded-full border border-[var(--gelap)]/15 object-cover lg:h-20 lg:w-20 sm:h-12 sm:w-12"
      />
      <div className="min-w-0 flex-1">
        <h1 className="text-[30px] leading-none font-bold text-[var(--biru)] sm:text-[42px]">
          {name}
        </h1>
        <p className="mt-1 text-sm font-semibold tracking-wider text-[var(--gelap)] sm:text-base">
          {subjects.join(", ")}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--biru)]/10 px-3 py-1 text-sm font-semibold text-[var(--biru)]">
            {formattedFee}
            <span className="font-normal text-[var(--biru)]/70">/jam</span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--kuning)]/15 px-3 py-1 text-sm font-semibold text-[var(--gelap)]">
            ★ {rating.toFixed(1)}
          </span>
        </div>
      </div>
    </section>
  );
}
