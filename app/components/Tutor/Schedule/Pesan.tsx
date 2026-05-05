"use client";

import React from "react";

type Props = {
  disabled?: boolean;
  label?: string;
  onClick?: () => void;
  className?: string;
};

const Pesan = ({ disabled = false, label = "Pesan Sekarang", onClick, className = "" }: Props) => {
  return (
    <div className={`flex justify-center ${className}`}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`w-full max-w-[420px] py-3 px-6 rounded-full text-white font-semibold transition-all duration-300 shadow-md focus:outline-none ${
          disabled
            ? "bg-[#9fc6cc] cursor-not-allowed"
            : "bg-[var(--biru)] hover:bg-[#00758a] hover:shadow-lg hover:scale-[1.02] active:scale-[0.97]"
        }`}
      >
        {label}
      </button>
    </div>
  );
};

export default Pesan;
