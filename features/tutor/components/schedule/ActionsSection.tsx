import Link from "next/link";

interface ActionsSectionProps {
  tutorId: string; // UUID
  confirmationHref?: string;
  isOwnTutorProfile?: boolean;
}

export function ActionsSection({
  tutorId,
  confirmationHref,
  isOwnTutorProfile = false,
}: ActionsSectionProps) {
  return (
    <div className="mt-8">
      {isOwnTutorProfile && (
        <p className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
          Anda tidak dapat memesan jadwal tutor milik sendiri.
        </p>
      )}
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center lg:justify-start">
        {confirmationHref ? (
          <Link
            href={confirmationHref}
            className="btn-primary w-full md:order-2"
          >
            Pesan Sekarang
          </Link>
        ) : (
          <button
            disabled
            className="btn-primary w-full opacity-60 cursor-not-allowed md:order-2"
          >
            {isOwnTutorProfile ? "Jadwal Milik Anda" : "Pesan Sekarang"}
          </button>
        )}

        <Link
          href={`/tutors/${tutorId}`}
          className="btn-secondary w-full md:order-1"
        >
          Kembali
        </Link>
      </div>
    </div>
  );
}
