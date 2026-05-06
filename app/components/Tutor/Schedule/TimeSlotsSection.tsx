import { TimeSlotButton } from "./TimeSlotButton";

interface Waktu {
  hari: string;
  jamMulai: string;
  jamSelesai: string;
  tanggal: string;
}

interface TimeSlotsSection {
  waktuList: Waktu[];
  activeTime: number;
  onTimeSelect: (index: number) => void;
  mobilePage: number;
  onMobilePageChange: (page: number) => void;
}

export function TimeSlotsSection({
  waktuList,
  activeTime,
  onTimeSelect,
  mobilePage,
  onMobilePageChange,
}: TimeSlotsSection) {
  // Calculate pagination for mobile (2x2 grid = 4 items per page)
  const itemsPerPage = 4;
  const totalPages = Math.ceil(waktuList.length / itemsPerPage);
  const mobileWaktuStart = mobilePage * itemsPerPage;
  const mobileWaktuEnd = mobileWaktuStart + itemsPerPage;
  const mobileWaktu = waktuList.slice(mobileWaktuStart, mobileWaktuEnd);

  return (
    <section>
      <h2 className="text-xl font-semibold text-[var(--biru)] mb-3">
        Waktu Tersedia
      </h2>

      {/* Desktop: grid layout, no scroll needed */}
      <div className="hidden lg:grid grid-cols-3 gap-4 bg-[#F3F4F8]  rounded-xl p-3">
        {waktuList.map((w, idx) => (
          <TimeSlotButton
            key={w.tanggal + idx}
            waktu={w}
            active={activeTime === idx}
            onClick={() => onTimeSelect(idx)}
          />
        ))}
      </div>

      {/* Mobile: grid 2x2 */}
      <div className="lg:hidden flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3 bg-[#F3F4F8] rounded-xl p-3">
          {mobileWaktu.map((w, idx) => {
            const actualIdx = mobileWaktuStart + idx;
            return (
              <TimeSlotButton
                key={w.tanggal + actualIdx}
                waktu={w}
                active={activeTime === actualIdx}
                onClick={() => onTimeSelect(actualIdx)}
                isMobile
              />
            );
          })}
        </div>

        {/* Pagination */}
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
