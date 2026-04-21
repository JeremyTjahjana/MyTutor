"use client";

import { useRef, useState, useEffect } from "react"; 
import WaktuTersedia from "./WaktuTersedia";
import Pesan from "./Pesan";

const PelajaranTersedia = () => {
  const pelajaran = ["Default", "Default", "Default", "Default", "Default", "Default", "Default", "Default"];

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
  }, []);

  useEffect(() => {
    const onResize = () => checkScroll();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const centerItem = (index: number) => {
    const container = scrollRef.current;
    const el = itemRefs.current[index];
    if (!container || !el) return;

    // Robust calculation using bounding rects (handles padding, transforms)
    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    // Element center relative to container's content (include current scroll)
    const elCenter = elRect.left - containerRect.left + container.scrollLeft + elRect.width / 2;
    const targetScrollLeft = elCenter - container.clientWidth / 2;

    // Clamp to valid scroll range
    const maxScrollLeft = Math.max(0, container.scrollWidth - container.clientWidth);
    const left = Math.max(0, Math.min(targetScrollLeft, maxScrollLeft));

    container.scrollTo({ left, behavior: "smooth" });
    setActiveIndex(index);
    // re-check after animation completes
    setTimeout(checkScroll, 350);
  };

  const handleTimeSelect = (index: number, time: string) => {
    setSelectedTimeIndex(index);
    setSelectedTime(time);
  };

  const handlePesan = () => {
    // For now, just log the selection. Replace with navigation or API call.
    console.log("Booking request:", {
      lessonIndex: activeIndex,
      lesson: activeIndex !== null ? pelajaran[activeIndex] : null,
      timeIndex: selectedTimeIndex,
      time: selectedTime,
    });
    alert(`Pesan: ${activeIndex !== null ? pelajaran[activeIndex] : "(belum pilih pelajaran)"} - ${selectedTime ?? "(belum pilih waktu)"}`);
  };

  return (
    <section className="w-full bg-[var(--putih)] text-[var(--gelap)] items-center justify-center">
      <div className="w-full h-min-[1000px] sm:px-10 md:px-30 flex flex-col gap-3 p-10">
      
      {/* Judul */}
      <h2 className="text-2xl font-bold text-[var(--biru)]">
        Pelajaran Tersedia
      </h2>

      {/* Container Latar Belakang */}
      <div className="relative bg-[#F5F6FB] rounded-3xl p-3 flex items-center overflow-hidden">
        
        {/* Ikon Panah Kiri (Muncul kondisional) */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center bg-gradient-to-r from-[#F5F6FB] via-[#F5F6FB] to-transparent w-16 pointer-events-none z-10">
            <button 
              onClick={scrollLeft}
              className="pointer-events-auto text-[var(--biru)] hover:opacity-70 transition-opacity mr-4 bg-[#F5F6FB] rounded-full p-1"
              aria-label="Geser kiri"
            >
              {/* SVG Panah Kiri Murni */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
          </div>
        )}

        {/* Area Tombol yang Bisa Di-scroll */}
        {/* Scrollbar dihilangkan langsung menggunakan class Tailwind di baris bawah ini */}
        <div
          ref={scrollRef}
          onScroll={checkScroll} // Panggil pengecekan saat digeser dengan jari/mouse
          className="flex gap-3 overflow-x-auto w-full scroll-smooth px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {pelajaran.map((item, index) => (
            <button
              key={index}
              ref={(el) => (itemRefs.current[index] = el)}
              onClick={() => centerItem(index)}
              className={`px-6 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors shrink-0 ${index === activeIndex ? 'bg-white border-2 border-[var(--biru)] text-[var(--biru)]' : 'bg-white border-2 border-[var(--biru)]/30 text-[var(--biru)]/70 hover:bg-[#E6F3F5]'}`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Ikon Panah Kanan (Muncul kondisional) */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center bg-gradient-to-l from-[#F5F6FB] via-[#F5F6FB] to-transparent w-16 pointer-events-none z-10">
            <button 
              onClick={scrollRight}
              className="pointer-events-auto text-[var(--biru)] hover:opacity-70 transition-opacity ml-4 bg-[#F5F6FB] rounded-full p-1"
              aria-label="Geser kanan"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {/* WaktuTersedia - tampilkan di bawah pelajaran */}
      <div className="mt-6">
        <WaktuTersedia onSelect={handleTimeSelect} />
      </div>
    </div>
    </section>
  );
};

export default PelajaranTersedia;