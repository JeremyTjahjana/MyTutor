interface TutorInfo {
  name: string;
  profile?: { src: string };
  matkuls: string[];
}

interface ScheduleHeaderProps {
  tutor: TutorInfo;
}

export function ScheduleHeader({ tutor }: ScheduleHeaderProps) {
  return (
    <div className="pt-2 lg:pt-6">
      <div className="flex items-center gap-4">
        {/* Profile photo – mobile only */}
        <div className="block lg:hidden shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tutor.profile?.src ?? "/"}
            alt={`${tutor.name} profile`}
            className="w-28 h-28 rounded-full object-cover border-2 border-[var(--biru)]/60"
          />
        </div>

        <div>
          <h1 className="text-[34px] font-bold text-[var(--biru)]">
            {tutor.name}
          </h1>
          <p className="mt-1 text-sm text-[var(--gelap)]">
            {tutor.matkuls.join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
}
