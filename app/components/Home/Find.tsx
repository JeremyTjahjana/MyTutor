import React from "react";
import Link from "next/link";

const Find = () => {
  return (
    <div className="mt-16 sm:mt-20 text-center lg:text-left lg:max-w-[860px] lg:mx-auto">
      <h3 className="text-2xl sm:text-3xl md:text-[40px] leading-tight font-medium text-[var(--gelap)]">
        Find the right Tutor for you !
      </h3>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-center gap-4 sm:gap-6 px-20 sm:px-0">
        <Link
          href="/tutor"
          className="inline-flex w-full sm:w-auto min-w-[160px] items-center justify-center rounded-full border-2 border-[var(--biru)] px-7 py-4 text-lg font-semibold text-[var(--biru)] transition-transform duration-200 ease-out hover:scale-105 hover:bg-[var(--biru)]/5 active:scale-95"
        >
          Find Tutor
        </Link>

        <button
          type="button"
          className="w-full sm:w-auto min-w-[190px] rounded-full bg-[var(--biru)] px-7 py-4 text-lg font-semibold text-[var(--putih)] transition-transform duration-200 ease-out hover:scale-105 hover:opacity-90 active:scale-95"
        >
          Become a Tutor
        </button>
      </div>
    </div>
  );
};

export default Find;
