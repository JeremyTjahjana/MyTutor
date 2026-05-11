import React, { useRef, useState, useEffect } from "react";
import { ChevronButton } from "./ChevronButton";

interface ScrollableRowProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollableRow({ children, className }: ScrollableRowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const check = () =>
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);

    check();
    el.addEventListener("scroll", check);
    window.addEventListener("resize", check);
    return () => {
      el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <div className="bg-[#F3F4F8] rounded-xl p-3 flex items-center gap-2">
      <div
        ref={ref}
        className={`flex gap-3 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden flex-1 ${className ?? ""}`}
      >
        {children}
      </div>
      <ChevronButton
        label="Scroll right"
        disabled={!canScrollRight}
        onClick={() => ref.current?.scrollBy({ left: 200, behavior: "smooth" })}
      />
    </div>
  );
}
