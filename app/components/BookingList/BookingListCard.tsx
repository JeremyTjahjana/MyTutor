import React from "react";

type BookingListCardProps = {
  matkul: string;
  namatutor: string;
  jam: string;
  tanggal: string;
  status?: string;
};

const BookingListCard = ({
  matkul,
  namatutor,
  jam,
  tanggal,
  status = "Selesai",
}: BookingListCardProps) => {
  return (
    <article className="w-full max-w-[360px] rounded-2xl border border-[var(--gelap)]/20 bg-[var(--putih)] py-8 px-8 sm:p-5 shadow-[0px_2px_10px_0px_rgba(0,0,0,0.12)] ">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[var(--gelap)]/20 bg-[var(--putih)] text-xs font-semibold text-[var(--gelap)]/60 sm:h-16 sm:w-16 md:flex-row flex-wrap">
          IMG
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-xl leading-none font-semibold text-[var(--gelap)] sm:text-[20px]">
              {matkul}
            </h4>

            <span className="rounded-full bg-[var(--ijo1)] px-3 py-1 text-sm leading-none font-semibold text-[var(--putih)] sm:text-l">
              {status}
            </span>
          </div>

          <p className="mt-1 text-[15px] leading-none font-semibold uppercase tracking-wide text-[var(--gelap)]/90 sm:text-[16px] tracking-widest">
            {namatutor}
          </p>
        </div>
      </div>

      <div className="mt-5 text-[15px] leading-[1.3] text-[var(--gelap)]/90 sm:mt-6 sm:text-[18px]">
        <p className="font-medium">Jadwal Tutor:</p>
        <p className="mt-1">
          {jam} | {tanggal}
        </p>
      </div>

      <button
        type="button"
        className="mt-6 w-full rounded-full bg-[var(--biru)] py-2.5 text-l leading-none font-semibold text-[var(--putih)] transition hover:opacity-90 sm:text-[15px] hover:bg-[var(--biru)]/70"
      >
        Kontak tutor
      </button>
    </article>
  );
};

export default BookingListCard;
