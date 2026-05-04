import Link from "next/link";

interface TutorScheduleButtonProps {
  tutorId: number;
}

export function TutorScheduleButton({ tutorId }: TutorScheduleButtonProps) {
  return (
    <div className="mt-6 flex justify-center">
      <Link
        href={`/tutor/${tutorId}/schedule`}
        className="inline-flex min-w-[180px] items-center justify-center rounded-full bg-[var(--biru)] px-7 py-3 text-base font-semibold text-[var(--putih)] transition hover:scale-105 hover:opacity-90 active:scale-95"
      >
        Cek Jadwal
      </Link>
    </div>
  );
}
