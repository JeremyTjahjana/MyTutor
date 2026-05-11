"use client";

import Image from "next/image";
import { assets } from "@/assets/assets";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const SearchTutor = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [rating, setRating] = useState(searchParams.get("rating") || "");
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 300);
    return () => clearTimeout(timer);
  }, [query, router, searchParams, pathname]);

  const handleRatingChange = (newRating: string) => {
    setRating(newRating);
    const params = new URLSearchParams(searchParams.toString());
    if (newRating) {
      params.set("rating", newRating);
    } else {
      params.delete("rating");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setShowFilter(false);
  };

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex flex-col items-center w-full max-w-2xl mx-auto p-4 gap-2">
      <div className="flex items-center gap-3 w-full">
        {/* Container Input Pencarian */}
        <div className="flex flex-1 items-center bg-[#F8F9FA] rounded-full px-4 py-3 shadow-sm border border-transparent focus-within:border-[var(--biru)]/50 focus-within:ring-2 focus-within:ring-[var(--biru)]/15 transition-all duration-200">
          <div className="w-9 h-9 bg-white/70 flex items-center justify-center rounded-full mr-3 shrink-0">
            <Image src={assets.search} alt="Search" width={16} height={16} />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tutor or skill to learn..."
            className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 text-sm sm:text-base w-full"
          />
        </div>

        {/* Tombol Filter */}
        <button
          type="button"
          onClick={() => setShowFilter(!showFilter)}
          className={`btn-icon h-10 w-10 shrink-0 border rounded-full transition-colors flex items-center justify-center ${showFilter || rating ? "border-[var(--biru)] bg-[var(--biru)] text-white" : "border-[var(--biru)] bg-white text-[var(--biru)]"}`}
          aria-label="Filter search"
        >
          <Image src={assets.filter} alt="Filter" width={18} height={18} className={showFilter || rating ? "brightness-0 invert" : ""} />
        </button>
      </div>

      {/* Filter Dropdown */}
      {showFilter && (
        <div ref={filterRef} className="absolute top-[72px] right-4 bg-white border border-[var(--gelap)]/10 shadow-lg rounded-xl p-4 w-64 z-10">
          <h3 className="font-semibold text-[var(--biru)] mb-3 text-sm">Filter by Rating</h3>
          <div className="flex flex-col gap-2">
            {[5, 4, 3, 2, 1].map((r) => (
              <label key={r} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded">
                <input
                  type="radio"
                  name="rating"
                  checked={rating === r.toString()}
                  onChange={() => handleRatingChange(r.toString())}
                  className="accent-[var(--biru)]"
                />
                <span className="flex items-center text-sm text-gray-700">
                  {r} Stars & up
                </span>
              </label>
            ))}
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded mt-1 border-t pt-2">
              <input
                type="radio"
                name="rating"
                checked={rating === ""}
                onChange={() => handleRatingChange("")}
                className="accent-[var(--biru)]"
              />
              <span className="text-sm text-gray-700">Any Rating</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

import { Suspense } from "react";

export default function SearchTutorWrapper() {
  return (
    <Suspense fallback={<div className="h-[72px]" />}>
      <SearchTutor />
    </Suspense>
  );
}
