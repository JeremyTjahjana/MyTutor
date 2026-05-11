import { FormData } from "../types";
import { subjectOptions } from "../constants";

interface Step3Props {
  formData: FormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

export default function Step3({ formData, onChange }: Step3Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-semibold text-[var(--biru)]">
        Data Pengajaran
      </h2>

      {/* Lama Pengalaman */}
      <div>
        <label className="block text-sm font-medium text-[var(--gelap)] mb-2">
          Lama Pengalaman Mengajar
        </label>
        <select
          name="lamaExperience"
          value={formData.lamaExperience}
          onChange={onChange}
          className="w-full px-4 py-2.5 border border-[var(--gelap)]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/30"
        >
          <option value="">Pilih Lama Pengalaman</option>
          <option value="0-1 tahun">0 - 1 tahun</option>
          <option value="1-2 tahun">1 - 2 tahun</option>
          <option value="2-3 tahun">2 - 3 tahun</option>
          <option value="3+ tahun">3+ tahun</option>
        </select>
      </div>

      {/* Subject Ajaran */}
      <div>
        <label className="block text-sm font-medium text-[var(--gelap)] mb-2">
          Subject Ajaran
        </label>
        <select
          name="subject"
          value={formData.subject}
          onChange={onChange}
          className="w-full px-4 py-2.5 border border-[var(--gelap)]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/30"
        >
          <option value="">Pilih Subject</option>
          {subjectOptions.map((subj) => (
            <option key={subj} value={subj}>
              {subj}
            </option>
          ))}
        </select>
      </div>

      {/* Biaya Per Jam */}
      <div>
        <label className="block text-sm font-medium text-[var(--gelap)] mb-2">
          Biaya Per Jam
        </label>
        <div className="flex items-center gap-2">
          <span className="text-[var(--gelap)]/70 font-medium">Rp.</span>
          <input
            type="number"
            name="biayaPerJam"
            value={formData.biayaPerJam}
            onChange={onChange}
            placeholder="50000"
            className="flex-1 px-4 py-2.5 border border-[var(--gelap)]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/30"
          />
          <span className="text-[var(--gelap)]/70 font-medium">/orang</span>
        </div>
      </div>
    </div>
  );
}
