"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";

import { assets } from "@/assets/assets";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorName: string;
  tutorAvatarUrl?: string | null;
  subjectName: string;
  onSubmit?: (payload: {
    rating: number;
    testimonial: string;
    anonymous: boolean;
  }) => Promise<void> | void;
}

const starIndexes = [1, 2, 3, 4, 5];

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  tutorName,
  tutorAvatarUrl,
  subjectName,
  onSubmit,
}) => {
  const [rating, setRating] = useState(0);
  const [testimonial, setTestimonial] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [isAnimatingRating, setIsAnimatingRating] = useState(false);
  const [animatedStarIndex, setAnimatedStarIndex] = useState<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsAnimatingRating(false);
      setAnimatedStarIndex(null);
      setSubmitError(null);
      setIsSubmitting(false);
      return;
    }

    setRating(0);
    setIsAnimatingRating(true);
    setAnimatedStarIndex(null);

    const timeouts: number[] = [];

    const runStep = (currentRating: number) => {
      if (currentRating > 5) {
        setIsAnimatingRating(false);
        setAnimatedStarIndex(null);
        return;
      }

      setRating(currentRating);
      setAnimatedStarIndex(currentRating);

      const shrinkTimeout = window.setTimeout(() => {
        setAnimatedStarIndex(null);

        const nextStepTimeout = window.setTimeout(() => {
          runStep(currentRating + 1);
        }, 65);

        timeouts.push(nextStepTimeout);
      }, 65);

      timeouts.push(shrinkTimeout);
    };

    const initialTimeout = window.setTimeout(() => {
      runStep(1);
    }, 0);

    timeouts.push(initialTimeout);

    return () => {
      timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 150);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (rating < 1) {
      setSubmitError("Pilih rating terlebih dahulu.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await onSubmit?.({ rating, testimonial: testimonial.trim(), anonymous });
      handleClose();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal mengirim testimoni.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      onClick={handleBackdropClick}
    >
      <div className={`relative w-full overflow-hidden rounded-t-3xl bg-(--putih) shadow-[0_-8px_30px_rgba(0,0,0,0.12)] ${isClosing ? "modal-dialog-closing" : "modal-dialog"} sm:max-w-180 sm:rounded-[28px]`}>
        <button
          onClick={handleClose}
          className="absolute left-3 top-3 z-10 rounded-full p-2 text-(--gelap)/90 transition-colors hover:bg-black/5 sm:left-4 sm:top-4"
          aria-label="Close modal"
          type="button"
        >
          <svg className="h-7 w-7 sm:h-8 sm:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <form onSubmit={handleSubmit} className="max-h-[calc(100dvh-1rem)] overflow-y-auto px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-14 sm:max-h-[88vh] sm:px-8 sm:pb-8 sm:pt-20">
          <div className="flex items-center gap-3 sm:items-start sm:gap-4">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-black/10 bg-[#f5f5f5] sm:h-16 sm:w-16">
              <Image
                src={tutorAvatarUrl ?? assets.profile}
                alt={tutorName}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1 pr-7 sm:pr-10">
              <p className="truncate text-[14px] leading-5 font-medium text-(--gelap) sm:text-[18px]">
                {tutorName}
              </p>
              <p className="mt-1 text-[12px] leading-4 text-[#737373] sm:text-[15px]">
                Varian: {subjectName}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 sm:mt-6 sm:gap-3">
            {starIndexes.map((index) => {
              const active = index <= rating;
              const isCurrentAnimatedStar = animatedStarIndex === index;
              const animatedStarClass = isCurrentAnimatedStar
                ? "scale-[1.45] sm:scale-[1.65] drop-shadow-[0_0_14px_rgba(245,190,18,0.45)]"
                : "scale-100 hover:scale-105";
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    if (!isAnimatingRating) {
                      setRating(index);
                    }
                  }}
                  disabled={isAnimatingRating}
                  className={`text-[38px] leading-none transition-all duration-200 ease-in-out sm:text-[56px] ${active ? "text-[#f5be12]" : "text-black/15"} ${isAnimatingRating ? "cursor-default" : "hover:scale-105"} ${animatedStarClass}`}
                  aria-label={`Beri rating ${index} bintang`}
                >
                  ★
                </button>
              );
            })}
          </div>

          <div className="mt-6 border-t border-black/10 pt-4 sm:mt-8 sm:pt-6">
            <h3 className="text-[18px] font-extrabold leading-tight text-(--gelap) sm:text-[24px]">
              Apa yang bikin kamu puas?
            </h3>
            <p className="mt-2 text-[13px] font-semibold text-(--biru) sm:text-[16px]">
              Sering dibahas:
            </p>

            <label className="mt-3 block sm:mt-4">
              <span className="sr-only">Testimoni</span>
              <textarea
                value={testimonial}
                onChange={(event) => setTestimonial(event.target.value)}
                placeholder="Contoh: Materinya jelas, cara ngajarnya sabar, dan bikin mudah paham."
                className="min-h-32 w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 text-[14px] leading-6 text-(--gelap) outline-none transition-colors placeholder:text-[#b7b7b7] focus:border-(--biru) sm:min-h-41 sm:px-5 sm:py-4 sm:text-[16px]"
              />
            </label>

            <label className="mt-4 flex items-center gap-3 text-[14px] text-(--gelap) sm:mt-5 sm:text-[16px]">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(event) => setAnonymous(event.target.checked)}
                className="h-5 w-5 rounded border-black/20 text-(--biru) focus:ring-(--biru) sm:h-6 sm:w-6"
              />
              <span>Sembunyikan namamu</span>
            </label>

            <div className="mt-5 flex items-stretch sm:justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-(--biru) px-6 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-[#00a0bc] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-10 sm:text-[16px]"
              >
                {isSubmitting ? "Mengirim..." : "Kirim"}
              </button>
            </div>
            {submitError ? (
              <p className="mt-3 text-sm font-medium text-(--merah)">{submitError}</p>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
