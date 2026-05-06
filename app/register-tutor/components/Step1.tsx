import { FormData } from "../types";

interface Step1Props {
  formData: FormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
}

export default function Step1({
  formData,
  onChange,
  showPassword,
  onTogglePassword,
}: Step1Props) {
  const { Eye, EyeOff } = require("lucide-react");

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
          placeholder="Masukkan nama lengkap Anda"
          className="w-full px-4 py-2.5 border border-[var(--gelap)]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/30"
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
          placeholder="nama@apps.ipb.ac.id"
          className="w-full px-4 py-2.5 border border-[var(--gelap)]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/30"
        />
        {formData.emailIPB &&
          !formData.emailIPB.includes("@apps.ipb.ac.id") && (
            <p className="text-xs text-red-500 mt-1">
              Email harus menggunakan domain @apps.ipb.ac.id
            </p>
          )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-[var(--gelap)] mb-2">
          Kata Sandi
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={onChange}
            placeholder="Masukkan kata sandi (min. 6 karakter)"
            className="w-full px-4 py-2.5 border border-[var(--gelap)]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/30 pr-10"
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--gelap)]/50 hover:text-[var(--gelap)]"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {formData.password && formData.password.length < 6 && (
          <p className="text-xs text-red-500 mt-1">
            Kata sandi harus minimal 6 karakter
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
