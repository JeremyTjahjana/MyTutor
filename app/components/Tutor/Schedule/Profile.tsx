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
    <section className="mt-0 flex flex-col gap-5 sm:gap-6">
      <div className="flex items-center gap-3 sm:gap-4">
        <Image
          src={tutor.profile}
          alt={`${tutor.name} profile`}
          width={80}
          height={80}
          className="h-16 w-16 rounded-full object-cover border border-[var(--gelap)]/15 sm:h-20 sm:w-20 lg:h-24 lg:w-24"
        />

        <div className="min-w-0 flex-1">
          <h1 className="text-[30px] leading-none font-bold text-[var(--biru)] sm:text-[42px]">
            {tutor.name}
          </h1>
          <p className="mt-1 text-sm font-semibold tracking-wider text-[var(--gelap)] leading-none sm:text-base">
            {tutor.matkuls.join(", ")}
          </p>
        </div>
      </div>

      <p className="text-[13px] leading-6 text-[var(--gelap)]/85 sm:text-[15px] sm:leading-7">
        {tutor.description}
      </p>
    </section>
  );
};

export default Profile;
