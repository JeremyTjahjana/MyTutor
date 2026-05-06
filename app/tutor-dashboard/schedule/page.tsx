"use client";

import { useState, useMemo } from "react";
import { TimeSlot } from "@/app/register-tutor/types";
import { X } from "lucide-react";

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedStart, setSelectedStart] = useState("");
  const [availability, setAvailability] = useState<TimeSlot[]>([
    { day: "Senin", start: "09:00", end: "10:30" },
    { day: "Senin", start: "13:00", end: "14:30" },
    { day: "Rabu", start: "14:00", end: "15:30" },
    { day: "Jumat", start: "10:00", end: "11:30" },
  ]);

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

  const handleAddSlot = () => {
    if (!selectedDay || !selectedStart) return;

    const newSlot: TimeSlot = {
      day: selectedDay,
      start: selectedStart,
      end: addMinutes(selectedStart, 90),
    };

    const exists = availability.some(
      (s) =>
        s.day === newSlot.day &&
        s.start === newSlot.start &&
        s.end === newSlot.end,
    );

    if (!exists) {
      setAvailability([...availability, newSlot]);
    }

    setSelectedDay("");
    setSelectedStart("");
  };

  const handleRemoveSlot = (slot: TimeSlot) => {
    setAvailability(
      availability.filter(
        (s) =>
          !(s.day === slot.day && s.start === slot.start && s.end === slot.end),
      ),
    );
  };

  const handleSaveSchedule = () => {
    // TODO: Save to backend
    console.log("Saving availability:", availability);
    alert("Schedule saved successfully!");
  };

  const slotsByDay = days.map((day) => ({
    day,
    slots: availability.filter((s) => s.day === day),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--biru)] mb-1">
          Manage Schedule
        </h1>
        <p className="text-[var(--gelap)]/60">
          Set your available teaching time slots.
        </p>
      </div>

      {/* Add New Slot */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-[var(--gelap)]/5">
        <h2 className="text-lg font-semibold text-[var(--biru)] mb-4">
          Add Available Slot
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-4 items-end">
          {/* Day Picker */}
          <div>
            <label className="block text-sm font-medium text-[var(--gelap)]/70 mb-2">
              Day
            </label>
            <div className="flex flex-wrap gap-2">
              {days.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`px-3 py-2 rounded-lg text-sm border transition-all ${
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

          {/* Time Picker */}
          <div>
            <label className="block text-sm font-medium text-[var(--gelap)]/70 mb-2">
              Start Time
            </label>
            <select
              value={selectedStart}
              onChange={(e) => setSelectedStart(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--gelap)]/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/30"
            >
              <option value="">Select time</option>
              {timeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddSlot}
            disabled={!selectedDay || !selectedStart}
            className={`btn-primary px-6 py-2 rounded-lg text-sm font-medium ${
              !selectedDay || !selectedStart
                ? "opacity-60 cursor-not-allowed"
                : ""
            }`}
          >
            Add Slot
          </button>
        </div>
      </div>

      {/* Schedule by Day */}
      <div className="space-y-4">
        {slotsByDay.map((daySchedule) => (
          <div
            key={daySchedule.day}
            className="bg-white rounded-lg shadow-sm p-6 border border-[var(--gelap)]/5"
          >
            <h3 className="font-semibold text-[var(--biru)] mb-3">
              {daySchedule.day}
            </h3>
            {daySchedule.slots.length === 0 ? (
              <p className="text-sm text-[var(--gelap)]/50 italic">
                No available slots
              </p>
            ) : (
              <div className="space-y-2">
                {daySchedule.slots.map((slot) => (
                  <div
                    key={`${slot.day}-${slot.start}-${slot.end}`}
                    className="flex items-center justify-between bg-[var(--putih)] p-4 rounded-lg border border-[var(--gelap)]/10"
                  >
                    <span className="font-medium text-[var(--biru)]">
                      {slot.start} - {slot.end}
                    </span>
                    <button
                      onClick={() => handleRemoveSlot(slot)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSaveSchedule}
        className="btn-primary px-6 py-3 rounded-lg font-semibold text-white w-full sm:w-auto"
      >
        Save Schedule
      </button>
    </div>
  );
}
