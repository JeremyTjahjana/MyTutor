interface TutorInfo {
  name: string;
  profile?: { src: string };
}

interface TutorProfileCardProps {
  tutor: TutorInfo;
}

export function TutorProfileCard({ tutor }: TutorProfileCardProps) {
  return (
    <div className="hidden lg:flex lg:col-span-4 items-center justify-center">
      <div className="w-[80%]">
        <div className="relative mx-auto aspect-[3/4] w-full overflow-hidden rounded-lg border-2 border-[var(--biru)]/80">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tutor.profile?.src ?? "/"}
            alt={`${tutor.name} profile`}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
