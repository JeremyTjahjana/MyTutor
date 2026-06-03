"use client";

import { useState, useMemo, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DAY_NAMES } from "@/features/tutor/constants";
import type { Schedule } from "@/types/tutor";
import { updateTutorScheduleAction } from "@/features/tutor/services/tutor.action";

type LocalSlot = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

function addMinutes(time: string, mins: number): string {
  const [hh, mm] = time.split(":").map(Number);
  const dt = new Date();
  dt.setHours(hh, mm + mins, 0, 0);
  return `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
}

export default function SchedulePage() {
  const { user } = useAuth();
  const [slots, setSlots] = useState<LocalSlot[]>([]);
  const [tutorProfileId, setTutorProfileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedStart, setSelectedStart] = useState("");

  const days = useMemo(
    () => [1, 2, 3, 4, 5, 6, 0].map((d) => ({ value: d, label: DAY_NAMES[d] })),
    [],
  );

  const timeOptions = useMemo(() => {
    const opts: string[] = [];
    for (let h = 6; h <= 22; h++) {
      for (const m of ["00", "30"]) {
        opts.push(`${String(h).padStart(2, "0")}:${m}`);
      }
    }
    return opts;
  }, []);

  // Load existing schedules
  useEffect(() => {
    if (!user) return;
    const loadSchedules = async () => {
      try {
        const res = await fetch(`/api/schedules?tutorUserId=${user.id}`);
        if (!res.ok) return;
        const data: { tutorProfileId: string; schedules: Schedule[] } =
          await res.json();
        setTutorProfileId(data.tutorProfileId);
        setSlots(
          data.schedules.map((s) => ({
            dayOfWeek: s.dayOfWeek,
            startTime: s.startTime.slice(0, 5),
            endTime: s.endTime.slice(0, 5),
          })),
        );
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadSchedules();
  }, [user]);

  const handleAddSlot = () => {
    if (selectedDay === null || !selectedStart) return;
    const endTime = addMinutes(selectedStart, 90);
    const newSlot: LocalSlot = {
      dayOfWeek: selectedDay,
      startTime: selectedStart,
      endTime,
    };
    const exists = slots.some(
      (s) =>
        s.dayOfWeek === newSlot.dayOfWeek && s.startTime === newSlot.startTime,
    );
    if (!exists) setSlots([...slots, newSlot]);
    setSelectedDay(null);
    setSelectedStart("");
  };

  const handleRemoveSlot = (slot: LocalSlot) => {
    setSlots(
      slots.filter(
        (s) =>
          !(
            s.dayOfWeek === slot.dayOfWeek &&
            s.startTime === slot.startTime &&
            s.endTime === slot.endTime
          ),
      ),
    );
  };

  const handleSave = async () => {
    if (!tutorProfileId) return;
    setIsSaving(true);
    setSaveMessage(null);
    const result = await updateTutorScheduleAction(
      tutorProfileId,
      slots.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime + ":00",
        endTime: s.endTime + ":00",
      })),
    );
    setIsSaving(false);
    setSaveMessage(
      result.success
        ? "Jadwal berhasil disimpan!"
        : (result.error ?? "Gagal menyimpan."),
    );
  };

  const slotsByDay = days.map(({ value, label }) => ({
    value,
    label,
    slots: slots.filter((s) => s.dayOfWeek === value),
  }));

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--biru)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--biru)] mb-1">
          Kelola Jadwal
        </h1>
        <p className="text-[var(--gelap)]/60">
          Atur slot waktu mengajar yang tersedia.
        </p>
      </div>

      {/* Add New Slot */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-[var(--gelap)]/5">
        <h2 className="text-lg font-semibold text-[var(--biru)] mb-4">
          Tambah Slot Waktu
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-4 items-end">
          {/* Day Picker */}
          <div>
            <label className="block text-sm font-medium text-[var(--gelap)]/70 mb-2">
              Hari
            </label>
            <div className="flex flex-wrap gap-2">
              {days.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setSelectedDay(d.value)}
                  className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                    selectedDay === d.value
                      ? "bg-[var(--biru)] text-white border-[var(--biru)]"
                      : "bg-white border-[var(--gelap)]/20 text-[var(--gelap)]"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time Picker */}
          <div>
            <label className="block text-sm font-medium text-[var(--gelap)]/70 mb-2">
              Jam Mulai
            </label>
            <select
              value={selectedStart}
              onChange={(e) => setSelectedStart(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--gelap)]/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/30"
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
            onClick={handleAddSlot}
            disabled={selectedDay === null || !selectedStart}
            className={`btn-primary px-6 py-2 rounded-lg text-sm font-medium ${
              selectedDay === null || !selectedStart
                ? "opacity-60 cursor-not-allowed"
                : ""
            }`}
          >
            Tambah Slot
          </button>
        </div>
      </div>

      {/* Schedule by Day */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {slotsByDay.map((daySchedule) => (
          <div
            key={daySchedule.value}
            className="flex min-h-[180px] flex-col rounded-lg border border-[var(--gelap)]/5 bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-semibold text-[var(--biru)]">
                {daySchedule.label}
              </h3>
              <span className="rounded-full bg-[var(--biru)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--biru)]">
                {daySchedule.slots.length}
              </span>
            </div>
            {daySchedule.slots.length === 0 ? (
              <p className="flex flex-1 items-center rounded-lg border border-dashed border-[var(--gelap)]/10 px-3 py-4 text-sm italic text-[var(--gelap)]/50">
                Belum ada slot tersedia
              </p>
            ) : (
              <div className="flex max-h-[260px] flex-1 flex-col gap-2 overflow-y-auto pr-1">
                {daySchedule.slots.map((slot) => (
                  <div
                    key={`${slot.dayOfWeek}-${slot.startTime}`}
                    className="flex items-center justify-between rounded-lg border border-[var(--gelap)]/10 bg-[var(--putih)] px-3 py-2.5"
                  >
                    <span className="text-sm font-medium text-[var(--biru)]">
                      {slot.startTime} - {slot.endTime}
                    </span>
                    <button
                      onClick={() => handleRemoveSlot(slot)}
                      className="rounded-lg p-1.5 transition-colors hover:bg-red-50"
                      aria-label={`Hapus slot ${daySchedule.label} ${slot.startTime}`}
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {saveMessage && (
        <p
          className={`text-sm px-4 py-3 rounded-xl ${
            saveMessage.includes("berhasil")
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {saveMessage}
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={isSaving || !tutorProfileId}
        className="btn-primary px-6 py-3 rounded-lg font-semibold w-full sm:w-auto"
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Menyimpan...
          </>
        ) : (
          "Simpan Jadwal"
        )}
      </button>
    </div>
  );
}
