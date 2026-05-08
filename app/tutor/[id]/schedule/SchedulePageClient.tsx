"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { TutorDetail, Schedule } from "@/app/types/tutor";
import { DAY_NAMES, nextOccurrence } from "@/app/types/tutor";
import type { SlotStatus } from "@/app/server/repositories/bookings.repository";
import {
  ScheduleHeader,
  SubjectsSection,
  TimeSlotsSection,
  ActionsSection,
  TutorProfileCard,
} from "@/app/components/Tutor/Schedule";

interface SchedulePageClientProps {
  tutor: TutorDetail;
  slotStatuses: Record<string, SlotStatus>;
}

export default function SchedulePageClient({ tutor, slotStatuses }: SchedulePageClientProps) {
  const router = useRouter();
  const [activeSubjectIndex, setActiveSubjectIndex] = useState(0);
  const [activeScheduleIndex, setActiveScheduleIndex] = useState(0);
  const [mobilePage, setMobilePage] = useState(0);

  // Exclude slots that already have an accepted booking — they're taken
  const availableSchedules = tutor.schedules.filter(
    (s) => !slotStatuses[s.id]?.hasAccepted,
  );

  const selectedSubject = tutor.subjects[activeSubjectIndex];
  const selectedSchedule: Schedule | undefined =
    availableSchedules[activeScheduleIndex];

  // Build confirmation href with UUIDs and computed timestamps
  const confirmationHref = useMemo(() => {
    if (!selectedSubject || !selectedSchedule) return undefined;

    const startDate = nextOccurrence(
      selectedSchedule.dayOfWeek,
      selectedSchedule.startTime,
    );
    const endDate = nextOccurrence(
      selectedSchedule.dayOfWeek,
      selectedSchedule.endTime,
    );

    const params = new URLSearchParams({
      tutorProfileId: tutor.id,
      tutorName: tutor.name,
      subjectId: selectedSubject.id,
      subjectName: selectedSubject.name,
      scheduleId: selectedSchedule.id,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      dayOfWeek: String(selectedSchedule.dayOfWeek),
    });

    return `/tutor/${tutor.id}/confirmation?${params.toString()}`;
  }, [tutor, selectedSubject, selectedSchedule]);

  return (
    <main className="min-h-screen bg-[#F7F8FC] px-4 py-6 sm:px-6 lg:px-12">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* ── Left: content (60%) ── */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <ScheduleHeader
              name={tutor.name}
              avatarUrl={tutor.avatarUrl}
              subjects={tutor.subjects.map((s) => s.name)}
            />
            <SubjectsSection
              matkuls={tutor.subjects.map((s) => s.name)}
              activeMatkul={activeSubjectIndex}
              onMatkul={setActiveSubjectIndex}
            />
            <TimeSlotsSection
              schedules={availableSchedules}
              activeTime={activeScheduleIndex}
              onTimeSelect={(idx) => {
                setActiveScheduleIndex(idx);
                setMobilePage(Math.floor(idx / 4));
              }}
              mobilePage={mobilePage}
              onMobilePageChange={setMobilePage}
            />

            {/* Pending booking counter */}
            {selectedSchedule && (() => {
              const status = slotStatuses[selectedSchedule.id];
              if (!status || status.hasAccepted || status.pendingCount === 0) return null;
              return (
                <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2.5">
                  <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <p className="text-sm font-medium text-amber-700">
                    {status.pendingCount} bookingan pending untuk jadwal ini
                  </p>
                </div>
              );
            })()}

            {availableSchedules.length === 0 && (
              <p className="text-sm text-[var(--gelap)]/50 italic">
                Semua jadwal tutor saat ini sudah penuh.
              </p>
            )}
          </div>
          {/* ── Right: profile photo (40%), desktop only ── */}
          <TutorProfileCard
            name={tutor.name}
            avatarUrl={tutor.avatarUrl}
          />
        </div>
        <ActionsSection
          tutorId={tutor.id}
          confirmationHref={confirmationHref}
        />
      </div>
    </main>
  );
}
