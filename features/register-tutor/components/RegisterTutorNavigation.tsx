import { ChevronRight, Loader2 } from "lucide-react";

type RegisterTutorNavigationProps = {
  currentStep: number;
  canProceedToNext: boolean;
  isSubmitting: boolean;
  contractUploading: boolean;
  onPrev: () => void;
  onNext: () => void;
};

export default function RegisterTutorNavigation({
  currentStep,
  canProceedToNext,
  isSubmitting,
  contractUploading,
  onPrev,
  onNext,
}: RegisterTutorNavigationProps) {
  const isPrevDisabled = currentStep === 1 || contractUploading || isSubmitting;
  const isNextDisabled =
    !canProceedToNext || isSubmitting || contractUploading;

  return (
    <div className="mt-8 flex gap-3 sm:gap-4">
      <button
        onClick={onPrev}
        disabled={isPrevDisabled}
        className={`flex-1 px-4 py-3 rounded-lg border-2 font-semibold transition-all ${
          isPrevDisabled
            ? "border-[var(--gelap)]/20 bg-[var(--gelap)]/5 text-[var(--gelap)]/50 cursor-not-allowed"
            : "btn-secondary cursor-pointer"
        }`}
      >
        Kembali
      </button>

      <button
        onClick={onNext}
        disabled={isNextDisabled}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
          !isNextDisabled
            ? "btn-primary"
            : "bg-[var(--gelap)]/5 text-[var(--gelap)]/50 cursor-not-allowed"
        }`}
      >
        {contractUploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Mengunggah PDF...
          </>
        ) : isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Mendaftar...
          </>
        ) : currentStep === 5 ? (
          "Selesai"
        ) : (
          <>
            Lanjut
            <ChevronRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
}
