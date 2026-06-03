"use client";

type TodayScheduleItem = {
  id: string;
  time: string;
  studentName: string;
  subject: string;
  note: string;
};

type TodaySchedulePanelProps = {
  schedule: TodayScheduleItem[];
  selectedBookingId: string | null;
  onToggleBooking: (bookingId: string) => void;
};

export default function TodaySchedulePanel({
  schedule,
  selectedBookingId,
  onToggleBooking,
}: TodaySchedulePanelProps) {
  return (
    <div className="lg:col-span-1 bg-white rounded-lg shadow-sm p-5 sm:p-6 border border-[var(--gelap)]/5 min-w-0">
      <h2 className="text-lg font-semibold text-[var(--biru)] mb-4">
        Jadwal Hari Ini
      </h2>

      <div className="space-y-3">
        {schedule.length === 0 ? (
          <p className="text-sm text-[var(--gelap)]/60">
            Tidak ada jadwal les hari ini
          </p>
        ) : (
          schedule.map((slot) => {
            const isOpen = selectedBookingId === slot.id;

            return (
              <div
                key={slot.id}
                className="rounded-xl border border-[var(--gelap)]/10 bg-white overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => onToggleBooking(slot.id)}
                  className={`w-full px-4 py-3 text-left transition-colors ${
                    isOpen ? "bg-[var(--biru)]/5" : "hover:bg-[var(--gelap)]/3"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[var(--gelap)]">
                        {slot.time}
                      </p>
                      <p className="text-sm text-[var(--biru)] font-medium truncate">
                        {slot.studentName}
                      </p>
                      <p className="text-xs text-[var(--gelap)]/60 truncate">
                        {slot.subject}
                      </p>
                    </div>
                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                      {isOpen ? "Hide" : "View"}
                    </span>
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-[var(--gelap)]/10 bg-[var(--putih)] px-4 py-3 text-sm text-[var(--gelap)]/70 space-y-1">
                    <p>
                      <span className="font-medium">Student:</span>{" "}
                      {slot.studentName}
                    </p>
                    <p>
                      <span className="font-medium">Subject:</span>{" "}
                      {slot.subject}
                    </p>
                    <p>
                      <span className="font-medium">Time:</span> {slot.time}
                    </p>
                    <p>
                      <span className="font-medium">Note:</span> {slot.note}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
