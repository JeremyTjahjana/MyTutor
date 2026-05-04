interface ChevronButtonProps {
  onClick: () => void;
  disabled: boolean;
  label: string;
}

export function ChevronButton({
  onClick,
  disabled,
  label,
}: ChevronButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`
        shrink-0 rounded-full p-2 border transition-colors duration-150
        focus:outline-none focus:ring-2 focus:ring-[var(--biru)]/30 active:scale-95
        ${
          disabled
            ? "border-[var(--biru)]/30 text-[var(--biru)]/30 opacity-50 cursor-not-allowed"
            : "border-[var(--biru)] text-[var(--biru)] hover:bg-[var(--biru)]/10"
        }
      `}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 6L15 12L9 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
