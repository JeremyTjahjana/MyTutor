import { FormData } from "../types";

interface Step1Props {
  formData: FormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

/** Clean phone number: remove symbols, ensure 62 prefix for server storage */
const cleanPhoneNumber = (input: string): string => {
  const digits = input.replace(/\D/g, "");
  if (!digits) return "";

  if (digits.startsWith("0")) {
    return "62" + digits.substring(1);
  }
  if (!digits.startsWith("62")) {
    return "62" + digits;
  }
  return digits;
};

/** Format phone for display: removes 62 prefix and adds dashes */
const formatPhoneForDisplay = (fullNumber: string): string => {
  let toDisplay = fullNumber;
  if (fullNumber.startsWith("62")) {
    toDisplay = fullNumber.substring(2);
  }

  if (!toDisplay) return "";

  return toDisplay.replace(/(\d{3})(\d{1,4})?(\d{1,4})?(\d{1,4})?/, (_, first = "", second = "", third = "", fourth = "") => {
    return [first, second, third, fourth].filter(Boolean).join("-");
  });
};

export default function Step1({ formData, onChange }: Step1Props) {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = cleanPhoneNumber(e.target.value);
    onChange({
      ...e,
      target: {
        ...e.target,
        name: "nomorTelepon",
        value: cleaned,
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };
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
            value={formatPhoneForDisplay(formData.nomorTelepon)}
            onChange={handlePhoneChange}
            inputMode="numeric"
            pattern="[0-9-]*"
            maxLength={16}
            placeholder="858-1234-5324"
            className="w-full rounded-lg border border-[var(--gelap)]/20 bg-white py-2.5 pl-14 pr-4 cursor-text transition-all duration-200 hover:border-[var(--biru)]/40 focus:outline-none focus:border-[var(--biru)] focus:ring-2 focus:ring-[var(--biru)]/30"
          />
        </div>
      </div>
    </div>
  );
}
