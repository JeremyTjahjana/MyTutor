import type { Tutor } from "@/app/types/tutor";

interface TutorProfileCardProps {
  tutor: Tutor;
}

export function TutorProfileCard({ tutor }: TutorProfileCardProps) {
  const profileSrc =
    typeof tutor.profile === "string" ? tutor.profile : tutor.profile.src;

  return (
    <div className="hidden lg:flex lg:col-span-4 items-center justify-center">
      <div className="w-[80%]">
        <div className="relative mx-auto aspect-[3/4] w-full overflow-hidden rounded-lg border-2 border-[var(--biru)]/80">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profileSrc}
            alt={`${tutor.name} profile`}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
