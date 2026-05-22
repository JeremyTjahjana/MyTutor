"use client";

import Image from "next/image";
import { assets } from "@/assets/assets";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const SearchTutor = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentParams = searchParams.toString();
  const urlQuery = searchParams.get("q") || "";
  const urlRating = searchParams.get("rating") || "";
  const [query, setQuery] = useState(urlQuery);
  const [rating, setRating] = useState(urlRating);
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(urlQuery);
    setRating(urlRating);
  }, [urlQuery, urlRating]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(currentParams);
      const nextQuery = query.trim();

      if (nextQuery) {
        params.set("q", nextQuery);
      } else {
        params.delete("q");
      }

      const nextParams = params.toString();
      if (nextParams === currentParams) return;

      router.replace(nextParams ? `${pathname}?${nextParams}` : pathname, {
        scroll: false,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [query, router, currentParams, pathname]);

  const handleRatingChange = (newRating: string) => {
    setRating(newRating);
    const params = new URLSearchParams(currentParams);
    if (newRating) {
      params.set("rating", newRating);
    } else {
      params.delete("rating");
    }

    const nextParams = params.toString();
    if (nextParams !== currentParams) {
      router.replace(nextParams ? `${pathname}?${nextParams}` : pathname, {
        scroll: false,
      });
    }

    setShowFilter(false);
  };

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative mx-auto flex w-full max-w-[330px] flex-col items-center gap-2 px-3 py-2 sm:w-[80vw] sm:max-w-[900px] sm:p-4">
      <div className="flex w-full items-center gap-2 sm:gap-3">
        {/* Container Input Pencarian */}
        <div className="flex min-w-0 flex-1 items-center rounded-[10px] border border-transparent bg-[#F8F9FA] px-1 py-1 shadow-sm transition-all duration-200 focus-within:border-[var(--biru)]/50 focus-within:ring-2 focus-within:ring-[var(--biru)]/15 sm:px-2 sm:py-1">
          <div className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/70 sm:mr-3 sm:h-9 sm:w-9">
            <Image
              src={assets.search}
              alt="Search"
              width={14}
              height={14}
              className="sm:h-4 sm:w-4"
            />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tutor or skill to learn..."
            className="min-w-0 flex-1 border-none bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400 sm:text-base"
          />
        </div>

        {/* Tombol Filter */}
        <button
          type="button"
          onClick={() => setShowFilter(!showFilter)}
          className={`btn-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors sm:h-10 sm:w-10 ${showFilter || rating ? "border-[var(--biru)] bg-[var(--biru)] text-white" : "border-[var(--biru)] bg-white text-[var(--biru)]"}`}
          aria-label="Filter search"
        >
          <Image
            src={assets.filter}
            alt="Filter"
            width={16}
            height={16}
            className={`${showFilter || rating ? "brightness-0 invert" : ""} sm:h-[18px] sm:w-[18px]`}
          />
        </button>
      </div>

      {/* Filter Dropdown */}
      {showFilter && (
        <div
          ref={filterRef}
          className="absolute right-3 top-[58px] z-10 w-[min(calc(100vw-1.5rem),16rem)] rounded-xl border border-[var(--gelap)]/10 bg-white p-3 shadow-lg sm:right-4 sm:top-[72px] sm:p-4"
        >
          <h3 className="mb-2 text-xs font-semibold text-[var(--biru)] sm:mb-3 sm:text-sm">
            Filter by Rating
          </h3>
          <div className="flex flex-col gap-1.5 sm:gap-2">
            {[5, 4, 3, 2, 1].map((r) => (
              <label
                key={r}
                className="flex cursor-pointer items-center gap-2 rounded p-1.5 hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name="rating"
                  checked={rating === r.toString()}
                  onChange={() => handleRatingChange(r.toString())}
                  className="accent-[var(--biru)]"
                />
                <span className="flex items-center text-xs text-gray-700 sm:text-sm">
                  {r} Stars & up
                </span>
              </label>
            ))}
            <label className="mt-1 flex cursor-pointer items-center gap-2 rounded border-t p-1.5 pt-2 hover:bg-gray-50">
              <input
                type="radio"
                name="rating"
                checked={rating === ""}
                onChange={() => handleRatingChange("")}
                className="accent-[var(--biru)]"
              />
              <span className="text-xs text-gray-700 sm:text-sm">
                Any Rating
              </span>
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
