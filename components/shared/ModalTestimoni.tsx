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
  const [animatedStarIndex, setAnimatedStarIndex] = useState<number | null>(
    null,
  );
  const [isClosing, setIsClosing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 150);
  };

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

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3"
      onClick={handleBackdropClick}
    >
      <div
        className={`relative w-full max-w-[38rem] overflow-hidden rounded-2xl bg-(--putih) shadow-[0_10px_32px_rgba(0,0,0,0.16)] ${
          isClosing ? "modal-dialog-closing" : "modal-dialog"
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full text-(--gelap)/80 transition-colors hover:bg-black/5"
          aria-label="Close modal"
          type="button"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <form
          onSubmit={handleSubmit}
          className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-12 sm:px-6 sm:pb-6 sm:pt-14"
        >
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-black/10 bg-[#f5f5f5]">
              <Image
                src={tutorAvatarUrl ?? assets.profile}
                alt={tutorName}
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1 pr-9">
              <p className="truncate text-[16px] font-semibold leading-5 text-(--gelap)">
                {tutorName}
              </p>
              <p className="mt-0.5 line-clamp-1 text-[12px] leading-4 text-[#737373]">
                Varian: {subjectName}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-1.5">
            {starIndexes.map((index) => {
              const active = index <= rating;
              const isCurrentAnimatedStar = animatedStarIndex === index;
              const animatedStarClass = isCurrentAnimatedStar
                ? "scale-[1.35] drop-shadow-[0_0_12px_rgba(245,190,18,0.45)]"
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
                  className={`text-[38px] leading-none transition-all duration-200 ease-in-out sm:text-[44px] ${
                    active ? "text-[#f5be12]" : "text-black/15"
                  } ${isAnimatingRating ? "cursor-default" : "hover:scale-105"} ${animatedStarClass}`}
                  aria-label={`Beri rating ${index} bintang`}
                >
                  ★
                </button>
              );
            })}
          </div>

          <div className="mt-4 border-t border-black/10 pt-4">
            <h3 className="text-[18px] font-extrabold leading-tight text-(--gelap) sm:text-[20px]">
              Apa yang bikin kamu puas?
            </h3>

            <label className="mt-3 block">
              <span className="sr-only">Testimoni</span>
              <textarea
                value={testimonial}
                onChange={(event) => setTestimonial(event.target.value)}
                placeholder="Contoh: Materinya jelas, cara ngajarnya sabar, dan bikin mudah paham."
                className="min-h-24 w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-[14px] leading-5 text-(--gelap) outline-none transition-colors placeholder:text-[#b7b7b7] focus:border-(--biru) sm:min-h-28"
              />
            </label>

            {/* <label className="mt-3 flex items-center gap-3 text-[14px] text-(--gelap)">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(event) => setAnonymous(event.target.checked)}
                className="h-4 w-4 rounded border-black/20 text-(--biru) focus:ring-(--biru)"
              />
              <span>Sembunyikan namamu</span>
            </label> */}

            <div className="mt-4 flex items-stretch sm:justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-(--biru) px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#00a0bc] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-9"
              >
                {isSubmitting ? "Mengirim..." : "Kirim"}
              </button>
            </div>
            {submitError ? (
              <p className="mt-2 text-sm font-medium text-(--merah)">
                {submitError}
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
