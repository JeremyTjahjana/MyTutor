import { useMemo, useState } from "react";
import { FormData, TimeSlot } from "../types";
import { waktuOptions } from "../constants";

interface Step4Props {
  formData: FormData;
  onToggleWaktu: (waktu: TimeSlot) => void;
}

export default function Step4({
  formData,
  onToggleWaktu,
}: Step4Props) {
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedStart, setSelectedStart] = useState("");

  const days = useMemo(
    () => ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
    [],
  );

  const timeOptions = useMemo(() => {
    const opts: string[] = [];
    for (let h = 6; h <= 22; h++) {
      for (let m of ["00", "30"]) {
        const hh = String(h).padStart(2, "0");
        opts.push(`${hh}:${m}`);
      }
    }
    return opts;
  }, []);

  const addMinutes = (time: string, mins: number) => {
    const [hh, mm] = time.split(":").map(Number);
    const dt = new Date();
    dt.setHours(hh, mm + mins, 0, 0);
    const hh2 = String(dt.getHours()).padStart(2, "0");
    const mm2 = String(dt.getMinutes()).padStart(2, "0");
    return `${hh2}:${mm2}`;
  };

  const formatSlotLabel = (slot: TimeSlot) =>
    `${slot.day} • ${slot.start} - ${slot.end}`;

  const parsePresetToSlot = (preset: string): TimeSlot => {
    const [day, ...rest] = preset.split(" ");
    const times = rest.join(" ").replace("–", "-");
    const parts = times.split("-").map((s) => s.trim());
    const start = parts[0];
    const end = parts[1] ?? addMinutes(start, 90);
    return { day, start, end };
  };

  const handleAddCustomWaktu = () => {
    if (!selectedDay || !selectedStart) return;
    const slot: TimeSlot = {
      day: selectedDay,
      start: selectedStart,
      end: addMinutes(selectedStart, 90),
    };

    const exists = formData.waktuTersedia.some(
      (s) => s.day === slot.day && s.start === slot.start && s.end === slot.end,
    );
    if (!exists) onToggleWaktu(slot);

    setSelectedDay("");
    setSelectedStart("");
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-[var(--biru)] mb-6">
          Pengelolaan Jadwal
        </h2>

        {/* Waktu Section */}
        <div>
          <h3 className="text-lg font-semibold text-[var(--gelap)] mb-4">
            Waktu Tersedia
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {waktuOptions.map((waktu) => {
              const slot = parsePresetToSlot(waktu);
              const selected = formData.waktuTersedia.some(
                (s) =>
                  s.day === slot.day &&
                  s.start === slot.start &&
                  s.end === slot.end,
              );
              return (
                <button
                  key={waktu}
                  onClick={() => onToggleWaktu(slot)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium cursor-pointer ${
                    selected
                      ? "border-[var(--biru)] bg-[var(--biru)] text-white"
                      : "border-[var(--gelap)]/20 bg-white text-[var(--gelap)]"
                  }`}
                >
                  {waktu}
                </button>
              );
            })}
          </div>

          <div className="mt-6 rounded-lg border border-[var(--gelap)]/10 p-4">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-sm font-semibold text-[var(--gelap)]">
                  Tambah waktu sendiri
                </p>
                <p className="text-xs text-[var(--gelap)]/60">
                  Pilih hari dan jam mulai; jam akhir akan ditambahkan otomatis
                  90 menit kemudian.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
              <div>
                <span className="mb-1 block text-xs font-medium text-[var(--gelap)]/70">
                  Hari
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {days.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDay(d)}
                      className={`px-3 py-2 rounded-lg text-sm border transition-all cursor-pointer ${
                        selectedDay === d
                          ? "bg-[var(--biru)] text-white border-[var(--biru)]"
                          : "bg-white border-[var(--gelap)]/20 text-[var(--gelap)]"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="mb-1 block text-xs font-medium text-[var(--gelap)]/70">
                  Jam Mulai
                </span>
                <select
                  value={selectedStart}
                  onChange={(e) => setSelectedStart(e.target.value)}
                  className="w-full px-4 py-3 border border-[var(--gelap)]/20 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/30 text-sm"
                >
                  <option value="">Pilih jam</option>
                  {timeOptions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleAddCustomWaktu}
                disabled={!selectedDay || !selectedStart}
                className={`btn-primary h-[46px] px-6 py-3 text-sm whitespace-nowrap rounded-xl cursor-pointer ${
                  !selectedDay || !selectedStart
                    ? "opacity-60 cursor-not-allowed"
                    : ""
                }`}
              >
                Tambah
              </button>
            </div>
          </div>

          {formData.waktuTersedia.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-semibold text-[var(--gelap)] mb-3">
                Waktu yang sudah ditambahkan
              </p>
              <div className="flex flex-wrap gap-2">
                {formData.waktuTersedia.map((slot) => (
                  <div
                    key={`${slot.day}-${slot.start}-${slot.end}`}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--biru)]/20 bg-[var(--biru)]/8 px-3 py-2 text-sm text-[var(--gelap)]"
                  >
                    <span>{formatSlotLabel(slot)}</span>
                    <button
                      type="button"
                      onClick={() => onToggleWaktu(slot)}
                      className="rounded-full px-2 text-[var(--gelap)]/60 hover:bg-[var(--gelap)]/5 hover:text-[var(--gelap)] cursor-pointer"
                      aria-label={`Hapus ${formatSlotLabel(slot)}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
