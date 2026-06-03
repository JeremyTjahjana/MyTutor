import { Check } from "lucide-react";

const TOTAL_STEPS = 5;

export default function RegisterTutorStepper({
  currentStep,
}: {
  currentStep: number;
}) {
  return (
    <div className="mb-10 flex items-center justify-center gap-2 sm:gap-4">
      {Array.from({ length: TOTAL_STEPS }, (_, index) => {
        const step = index + 1;
        return (
          <div key={step} className="flex items-center gap-2 sm:gap-4">
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base transition-colors ${
                currentStep >= step
                  ? "bg-[var(--biru)] text-[var(--putih)]"
                  : "bg-[var(--gelap)]/10 text-[var(--gelap)]/50"
              }`}
            >
              {currentStep > step ? (
                <Check className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={3} />
              ) : (
                step
              )}
            </div>
            {step < TOTAL_STEPS && (
              <div
                className={`h-1 w-4 sm:w-6 transition-colors ${
                  currentStep > step
                    ? "bg-[var(--biru)]"
                    : "bg-[var(--gelap)]/10"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
