"use client";

import Image from "next/image";
import { assets } from "../../assets/assets";

const SearchTutor = () => {
  return (
    <div className="flex items-center gap-3 w-full max-w-2xl mx-auto p-4">

      {/* Container Input Pencarian */}
      <div className="flex flex-1 items-center bg-[#F8F9FA] rounded-full px-4 py-3 shadow-sm border border-transparent focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200">
        {/* Icon di dalam lingkaran kecil */}
        <div className="w-9 h-9 bg-white/70 flex items-center justify-center rounded-full mr-3 shrink-0">
          <Image src={assets.search} alt="Search" width={16} height={16} />
        </div>

        <input
          type="text"
          placeholder="Search tutor or skill to learn..."
          className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 text-sm sm:text-base w-full"
        />
      </div>

      {/* Tombol Filter - lingkaran dengan border berwarna */}
      <button
        type="button"
        className="w-10 h-10 rounded-full bg-white border border-[#00829B] flex items-center justify-center hover:bg-[#E6F3F5] transition-colors duration-200 shrink-0"
        aria-label="Filter search"
      >
        <Image src={assets.filter} alt="Filter" width={18} height={18} />
      </button>

    </div>
  );
};

export default SearchTutor;
