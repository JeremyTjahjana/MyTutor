import React from "react";
<<<<<<< HEAD
import PelajaranTersedia from "../../../components/Tutor/Schedule/PelajaranTersedia";
import Pesan from "../../../components/Tutor/Schedule/Pesan";

const page = () => {
  return (
    <>
      <PelajaranTersedia />
      <Pesan />
    </>
  );
=======
import Link from "next/link";
import { notFound } from "next/navigation";
import { dummyTutor } from "@/app/assets/assets";

type PageProps = {
  params: {
    id: string;
  };
>>>>>>> de640d97ed3ec3e93d1c4e7398bd90ba68fb9d2f
};

export default function Page({ params }: PageProps) {
  const tutor = dummyTutor.find((item) => item.id === Number(params.id));

  if (!tutor) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-[720px] px-4 py-8 sm:px-6 md:px-8">
      <div className="rounded-[26px] bg-[var(--putih)] p-6 shadow-[0px_2px_16px_rgba(0,0,0,0.06)] sm:p-8">
        <p className="text-sm font-semibold text-[var(--biru)]">{tutor.name}</p>
        <h1 className="mt-2 text-3xl font-bold text-[var(--gelap)]">
          Jadwal Tutor
        </h1>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {tutor.waktu.map((slot) => (
            <article
              key={`${slot.hari}-${slot.tanggal}-${slot.jamMulai}`}
              className="rounded-2xl border border-[var(--gelap)]/15 p-4"
            >
              <p className="text-sm font-semibold text-[var(--biru)]">
                {slot.hari}
              </p>
              <p className="mt-1 text-base font-bold text-[var(--gelap)]">
                {slot.jamMulai} - {slot.jamSelesai}
              </p>
              <p className="mt-1 text-sm text-[var(--gelap)]/75">
                {slot.tanggal}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href={`/tutor/${tutor.id}`}
            className="inline-flex min-w-[180px] items-center justify-center rounded-full bg-[var(--biru)] px-7 py-3 text-base font-semibold text-[var(--putih)] transition hover:opacity-90"
          >
            Kembali ke Profile
          </Link>
        </div>
      </div>
    </main>
  );
}
