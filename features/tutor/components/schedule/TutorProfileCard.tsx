import { assets } from "@/assets/assets";

interface TutorProfileCardProps {
  name: string;
  avatarUrl: string | null;
}

export function TutorProfileCard({ name, avatarUrl }: TutorProfileCardProps) {
  const profileSrc = avatarUrl ?? assets.profile.src;

  return (
    <div className="hidden lg:flex lg:col-span-4 items-center justify-center">
      <div className="w-[80%]">
        <div className="relative mx-auto aspect-[3/4] w-full overflow-hidden rounded-lg border-2 border-[var(--biru)]/80">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profileSrc}
            alt={`${name} profile`}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
