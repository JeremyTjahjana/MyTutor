import Link from "next/link";

interface ActionsSectionProps {
  tutorId: string; // UUID
  confirmationHref?: string;
}

export function ActionsSection({
  tutorId,
  confirmationHref,
}: ActionsSectionProps) {
  return (
    <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center items-center lg:justify-start">
      {confirmationHref ? (
        <Link href={confirmationHref} className="btn-primary w-full md:order-2">
          Pesan Sekarang
        </Link>
      ) : (
        <button
          disabled
          className="btn-primary w-full opacity-60 cursor-not-allowed md:order-2"
        >
          Pesan Sekarang
        </button>
      )}

      <Link
        href={`/tutors/${tutorId}`}
        className="btn-secondary w-full md:order-1"
      >
        Kembali
      </Link>
    </div>
  );
}
