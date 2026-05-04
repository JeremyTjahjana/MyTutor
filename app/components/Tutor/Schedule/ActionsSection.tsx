import Link from "next/link";

interface ActionsSectionProps {
  tutorId: number;
  confirmationHref?: string;
}

export function ActionsSection({
  tutorId,
  confirmationHref,
}: ActionsSectionProps) {
  return (
    <div className="mt-8 flex flex-col gap-4 justify-center align-center lg:justify-start px-10">
      <Link
        href={confirmationHref ?? "#"}
        className="inline-flex w-full justify-center rounded-full bg-[var(--biru)] px-6 py-3 text-white font-semibold"
      >
        Pesan Sekarang
      </Link>
      <Link
        href={`/tutor/${tutorId}`}
        className="inline-flex w-full justify-center rounded-full border-2 border-[var(--biru)] px-6 py-3 text-[var(--biru)] font-semibold bg-white"
      >
        Kembali
      </Link>
    </div>
  );
}
