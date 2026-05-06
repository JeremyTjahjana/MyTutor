"use client";
import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { dummyTutor } from "@/app/assets/assets";
import {
  ScheduleHeader,
  SubjectsSection,
  TimeSlotsSection,
  ActionsSection,
  TutorProfileCard,
} from "@/app/components/Tutor/Schedule";
export default function SchedulePage() {
  const params = useParams();
  const tutorId = Number(params.id);
  const tutor = useMemo(
    () => dummyTutor.find((t) => t.id === tutorId) ?? dummyTutor[0],
    [tutorId],
  );
  const [activeMatkul, setActiveMatkul] = useState(0);
  const [activeTime, setActiveTime] = useState(0);
  const [mobilePage, setMobilePage] = useState(0);
  const selectedTime = tutor.waktu[activeTime];
  const confirmationHref = selectedTime
    ? `/tutor/${tutorId}/confirmation?${new URLSearchParams({ matkul: tutor.matkuls[activeMatkul] ?? "", hari: selectedTime.hari, jamMulai: selectedTime.jamMulai, jamSelesai: selectedTime.jamSelesai, tanggal: selectedTime.tanggal }).toString()}`
    : undefined;
  return (
    <main className="min-h-screen bg-[#F7F8FC] px-4 py-6 sm:px-6 lg:px-12">
      {" "}
      <div className="mx-auto w-full max-w-6xl">
        {" "}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {" "}
          {/* ── Left: content (60%) ── */}{" "}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {" "}
            <ScheduleHeader tutor={tutor} />{" "}
            <SubjectsSection
              matkuls={tutor.matkuls}
              activeMatkul={activeMatkul}
              onMatkul={setActiveMatkul}
            />{" "}
            <TimeSlotsSection
              waktuList={tutor.waktu}
              activeTime={activeTime}
              onTimeSelect={setActiveTime}
              mobilePage={mobilePage}
              onMobilePageChange={setMobilePage}
            />{" "}
            <ActionsSection
              tutorId={tutorId}
              confirmationHref={confirmationHref}
            />{" "}
          </div>{" "}
          {/* ── Right: profile photo (40%), desktop only ── */}{" "}
          <TutorProfileCard tutor={tutor} />{" "}
        </div>{" "}
      </div>{" "}
    </main>
  );
}
