import { assets } from "@/assets/assets";

interface ScheduleHeaderProps {
  name: string;
  avatarUrl: string | null;
  subjects: string[];
}

export function ScheduleHeader({
  name,
  avatarUrl,
  subjects,
}: ScheduleHeaderProps) {
  const profileSrc = avatarUrl ?? assets.mehehe.src;

  return (
    <div className="pt-2 lg:pt-6">
      <div className="flex items-center gap-4">
        {/* Profile photo – mobile only */}
        <div className="block lg:hidden shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profileSrc}
            alt={`${name} profile`}
            className="w-28 h-28 rounded-full object-cover border-2 border-[var(--biru)]/60"
          />
        </div>
        <div>
          <h1 className="text-[34px] font-bold text-[var(--biru)]">{name}</h1>
          <p className="mt-1 text-sm text-[var(--gelap)]">
            {subjects.join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
}
