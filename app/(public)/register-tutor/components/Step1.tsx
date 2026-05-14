import { FormData } from "../types";

interface Step1Props {
  formData: FormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

const formatPhoneNumberDisplay = (digits: string) => {
  const cleanedDigits = digits.replace(/\D/g, "");

  if (!cleanedDigits) return "";

  return cleanedDigits.replace(/(\d{3})(\d{1,4})?(\d{1,4})?(\d{1,4})?/, (_, first, second = "", third = "", fourth = "") => {
    return [first, second, third, fourth].filter(Boolean).join("-");
  });
};

export default function Step1({ formData, onChange }: Step1Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-semibold text-[var(--biru)]">
        Identitas Diri
      </h2>

      {/* Nama Lengkap */}
      <div>
        <label className="block text-sm font-medium text-[var(--gelap)] mb-2">
          Nama Lengkap
        </label>
        <input
          type="text"
          name="namaLengkap"
          value={formData.namaLengkap}
          onChange={onChange}
          className="w-full px-4 py-2.5 border border-[var(--gelap)]/20 rounded-lg bg-white cursor-text transition-all duration-200 hover:border-[var(--biru)]/40 focus:outline-none focus:border-[var(--biru)] focus:ring-2 focus:ring-[var(--biru)]/30"
        />
      </div>

      {/* Email IPB */}
      <div>
        <label className="block text-sm font-medium text-[var(--gelap)] mb-2">
          Alamat Email IPB
        </label>
        <input
          type="email"
          name="emailIPB"
          value={formData.emailIPB}
          onChange={onChange}
          className="w-full px-4 py-2.5 border border-[var(--gelap)]/20 rounded-lg bg-white cursor-text transition-all duration-200 hover:border-[var(--biru)]/40 focus:outline-none focus:border-[var(--biru)] focus:ring-2 focus:ring-[var(--biru)]/30"
        />
        {formData.emailIPB &&
          !formData.emailIPB.includes("@apps.ipb.ac.id") && (
            <p className="text-xs text-red-500 mt-1">
              Email harus menggunakan domain @apps.ipb.ac.id
            </p>
          )}
      </div>

      {/* Nomor Telepon */}
      <div>
        <label className="block text-sm font-medium text-[var(--gelap)] mb-2">
          Nomor Telepon
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-16 text-[var(--gelap)]">
            +62
          </span>
          <input
            type="tel"
            name="nomorTelepon"
            value={formatPhoneNumberDisplay(formData.nomorTelepon)}
            onChange={onChange}
            inputMode="numeric"
            pattern="[0-9-]*"
            maxLength={16}
            placeholder="858-1234-5324"
            className="w-full rounded-lg border border-[var(--gelap)]/20 bg-white py-2.5 pl-14 pr-4 cursor-text transition-all duration-200 hover:border-[var(--biru)]/40 focus:outline-none focus:border-[var(--biru)] focus:ring-2 focus:ring-[var(--biru)]/30"
          />
        </div>
        <p className="mt-1 text-xs text-[var(--gelap)]/60">
          Isi angka saja, lalu sistem akan menampilkan +62 dan menambahkan ke server.
        </p>
      </div>
    </div>
  );
}
