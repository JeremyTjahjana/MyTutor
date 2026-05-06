import { Check } from "lucide-react";

interface SuccessProps {
  onReset: () => void;
}

export default function Success({ onReset }: SuccessProps) {
  return (
    <div className="min-h-screen bg-[var(--putih)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-[var(--biru)] flex items-center justify-center">
            <Check className="w-12 h-12 text-[var(--putih)]" strokeWidth={3} />
          </div>
        </div>

        {/* Success Text */}
        <h1 className="text-3xl font-bold text-[var(--biru)] mb-3">
          Registrasi Selesai
        </h1>
        <p className="text-base text-[var(--gelap)]/70 mb-8">
          Harap menunggu notifikasi konfirmasi via email
        </p>

        {/* Done Button */}
        <button onClick={onReset} className="btn-primary w-full">
          Selesai
        </button>
      </div>
    </div>
  );
}
