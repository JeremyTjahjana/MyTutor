import { TimeSlotButton } from "./TimeSlotButton";
import type { Schedule } from "@/types/tutor";
import { DAY_NAMES, nextOccurrence } from "@/types/tutor";

interface TimeSlotsSection {
  schedules: Schedule[];
  activeTime: number;
  onTimeSelect: (index: number) => void;
  mobilePage: number;
  onMobilePageChange: (page: number) => void;
}

export function TimeSlotsSection({
  schedules,
  activeTime,
  onTimeSelect,
  mobilePage,
  onMobilePageChange,
}: TimeSlotsSection) {
  const itemsPerPage = 4;
  const totalPages = Math.ceil(schedules.length / itemsPerPage);
  const mobileStart = mobilePage * itemsPerPage;
  const mobileSchedules = schedules.slice(
    mobileStart,
    mobileStart + itemsPerPage,
  );

  return (
    <section>
      <h2 className="text-xl font-semibold text-[var(--biru)] mb-3">
        Waktu Tersedia
      </h2>

      {schedules.length === 0 && (
        <p className="text-sm text-[var(--gelap)]/60 italic">
          Tutor belum menambahkan jadwal.
        </p>
      )}

      {/* Desktop: grid layout */}
      <div className="hidden lg:grid grid-cols-3 gap-4 bg-[#F3F4F8] rounded-xl p-3">
        {schedules.map((schedule, idx) => (
          <TimeSlotButton
            key={schedule.id}
            schedule={schedule}
            active={activeTime === idx}
            onClick={() => onTimeSelect(idx)}
          />
        ))}
      </div>

      {/* Mobile: grid 2x2 with pagination */}
      <div className="lg:hidden flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3 bg-[#F3F4F8] rounded-xl p-3">
          {mobileSchedules.map((schedule, idx) => {
            const actualIdx = mobileStart + idx;
            return (
              <TimeSlotButton
                key={schedule.id}
                schedule={schedule}
                active={activeTime === actualIdx}
                onClick={() => onTimeSelect(actualIdx)}
                isMobile
              />
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => onMobilePageChange(Math.max(0, mobilePage - 1))}
              disabled={mobilePage === 0}
              className="btn-icon h-10 w-10 border border-[var(--biru)] text-[var(--biru)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 6L9 12L15 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <span className="text-sm font-medium text-[var(--biru)]">
              {mobilePage + 1} of {totalPages}
            </span>
            <button
              onClick={() =>
                onMobilePageChange(Math.min(totalPages - 1, mobilePage + 1))
              }
              disabled={mobilePage === totalPages - 1}
              className="btn-icon h-10 w-10 border border-[var(--biru)] text-[var(--biru)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 6L15 12L9 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
