import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dummyTutor } from "@/app/assets/assets";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }).map((_, index) => (
    <span
      key={index}
      className={`text-sm sm:text-base ${index < rating ? "text-[var(--kuning)]" : "text-[var(--gelap)]/20"}`}
    >
      ★
    </span>
  ));
};

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const tutor = dummyTutor.find(
    (item) => item.id === Number(resolvedParams.id),
  );

  if (!tutor) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F7F8FC] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl rounded-[32px] bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] sm:p-8 lg:p-10">
        <section className="mt-6 flex items-start gap-3 sm:gap-4">
          <Image
            src={tutor.profile}
            alt={`${tutor.name} profile`}
            width={48}
            height={48}
            className="mt-1 h-11 w-11 lg:w-20 lg:h-20 rounded-full object-cover border border-[var(--gelap)]/15 sm:h-12 sm:w-12"
          />

          <div className="min-w-0 flex-1">
            <h1 className="text-[30px] leading-none font-bold text-[var(--biru)] sm:text-[42px]">
              {tutor.name}
            </h1>
            <p className="mt-1 text-sm font-semibold tracking-wider text-[var(--gelap)] sm:text-base">
              {tutor.matkuls.join(", ")}
            </p>
          </div>
        </section>

        <p className="mt-5 text-[13px] leading-6 text-[var(--gelap)]/85 sm:mt-6 sm:text-[15px] sm:leading-7">
          {tutor.description}
        </p>

        <section className="mt-6">
          <h2 className="text-lg font-semibold text-[var(--biru)] sm:text-xl">
            Portofolio
          </h2>
          <div className="mt-2 flex gap-3 overflow-x-auto pb-2">
            {tutor.portofolio.map((item, index) => (
              <article
                key={index}
                className="relative h-[170px] w-[260px] shrink-0 overflow-hidden rounded-[20px] bg-[#F0ECFF] sm:h-[220px] sm:w-[320px] md:h-[250px] md:w-[360px]"
              >
                <Image
                  src={item}
                  alt={`Portfolio ${index + 1} ${tutor.name}`}
                  fill
                  className="object-cover"
                />
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-semibold text-[var(--biru)] sm:text-xl">
            Testimoni
          </h2>

          <div className="mt-2 flex gap-3 overflow-x-auto pb-2">
            {tutor.testimonies.map((item, index) => (
              <article
                key={`${item.studentName}-${item.createdAt}-${index}`}
                className="w-[300px] shrink-0 rounded-[22px] border border-[var(--gelap)]/20 bg-[var(--putih)] p-4 shadow-[0px_2px_10px_rgba(0,0,0,0.12)] sm:w-[340px] sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-0.5">
                      {renderStars(item.rating)}
                    </div>

                    <div className="mt-2 flex items-start gap-3">
                      <Image
                        src={tutor.profile}
                        alt={`${tutor.name} profile`}
                        width={28}
                        height={28}
                        className="h-7 w-7 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-[16px] font-semibold text-[var(--biru)] sm:text-[18px]">
                          {item.studentName}
                        </p>
                        <p className="text-[12px] text-[var(--gelap)]/75 sm:text-sm">
                          {item.createdAt}
                        </p>
                      </div>
                    </div>
                  </div>

                  <span className="text-2xl leading-none text-[var(--biru)]/70">
                    ›
                  </span>
                </div>
                <p className="mt-4 text-[13px] leading-6 text-[var(--gelap)]/85 sm:text-[15px] sm:leading-7">
                  “{item.message}”
                </p>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-6 flex justify-center">
          <Link
            href={`/tutor/${tutor.id}/schedule`}
            className="inline-flex min-w-[180px] items-center justify-center rounded-full bg-[var(--biru)] px-7 py-3 text-base font-semibold text-[var(--putih)] transition hover:scale-105 hover:opacity-90 active:scale-95"
          >
            Cek Jadwal
          </Link>
        </div>
      </div>
    </main>
  );
}
