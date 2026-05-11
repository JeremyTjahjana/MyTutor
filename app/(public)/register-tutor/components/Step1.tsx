import { FormData } from "../types";

interface Step1Props {
  formData: FormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

export default function Step1({
  formData,
  onChange,
}: Step1Props) {
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
          readOnly
          className="w-full px-4 py-2.5 border border-[var(--gelap)]/20 rounded-lg bg-[var(--gelap)]/5 cursor-not-allowed focus:outline-none"
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
          readOnly
          className="w-full px-4 py-2.5 border border-[var(--gelap)]/20 rounded-lg bg-[var(--gelap)]/5 cursor-not-allowed focus:outline-none"
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
        <input
          type="tel"
          name="nomorTelepon"
          value={formData.nomorTelepon}
          onChange={onChange}
          placeholder="Contoh: 08123456789"
          className="w-full px-4 py-2.5 border border-[var(--gelap)]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/30"
        />
      </div>
    </div>
  );
}
