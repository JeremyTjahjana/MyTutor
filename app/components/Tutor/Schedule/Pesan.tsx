"use client";

import React from "react";

type Props = {
  disabled?: boolean;
  label?: string;
  onClick?: () => void;
  className?: string;
};

const Pesan = ({
  disabled = false,
  label = "Pesan Sekarang",
  onClick,
  className = "",
}: Props) => {
  return (
    <div className={`flex justify-center ${className}`}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`btn-primary w-full max-w-[420px] ${
          disabled ? "bg-[#9fc6cc]" : ""
        }`}
      >
        {label}
      </button>
    </div>
  );
};

export default Pesan;
