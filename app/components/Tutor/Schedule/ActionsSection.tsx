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
      {confirmationHref ? (
        <Link href={confirmationHref} className="btn-primary w-full">
          Pesan Sekarang
        </Link>
      ) : (
        <button disabled className="btn-primary w-full">
          Pesan Sekarang
        </button>
      )}

      <Link href={`/tutor/${tutorId}`} className="btn-secondary w-full">
        Kembali
      </Link>
    </div>
  );
}
