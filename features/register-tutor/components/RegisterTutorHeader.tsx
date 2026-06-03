import type { User } from "@/types/user";

export default function RegisterTutorHeader({ user }: { user: User }) {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-[var(--biru)] mb-2">
        Tutor Registration
      </h1>
      <p className="text-sm sm:text-base text-[var(--gelap)]/70">
        Tolong lengkapi data dengan baik sebelum di verifikasi
      </p>
      <p className="mt-2 text-sm text-green-600 font-medium">
        Masuk sebagai: {user.fullName} ({user.email})
      </p>
    </div>
  );
}
