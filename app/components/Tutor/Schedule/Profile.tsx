"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { dummyTutor } from "@/app/assets/assets";

const Profile = () => {
  const params = useParams();
  const tutorId = Number(params.id);

  const tutor = useMemo(() => {
    return dummyTutor.find((item) => item.id === tutorId);
  }, [tutorId]);

  if (!tutor) {
    return <p className="text-red-500">Tutor tidak ditemukan</p>;
  }

  return (
    <section className="mt-6 flex items-center justify-center gap-4 sm:gap-6">
      <Image
        src={tutor.profile}
        alt={`${tutor.name} profile`}
        width={80}
        height={80}
        className="mt-1 h-14 w-14 lg:h-20 lg:w-20 rounded-full object-cover border border-[var(--gelap)]/15"
      />

      <div className="min-w-0 flex-1">
        <h1 className="text-[30px] leading-none font-bold text-[var(--biru)] sm:text-[42px]">
          {tutor.name}
        </h1>
      </div>
    </section>
  );
};

export default Profile;
