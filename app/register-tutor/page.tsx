"use client";

import { useState } from "react";
import { ChevronRight, Check } from "lucide-react";
import { FormData, TimeSlot } from "./types";
import { initialFormData } from "./constants";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import Step4 from "./components/Step4";
import Success from "./components/Success";

export default function RegisterTutorPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddMatkul = () => {
    if (formData.inputMatkul.trim()) {
      setFormData((prev) => ({
        ...prev,
        matkuls: [...prev.matkuls, prev.inputMatkul.trim()],
        inputMatkul: "",
      }));
    }
  };

  const handleRemoveMatkul = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      matkuls: prev.matkuls.filter((_, i) => i !== index),
    }));
  };

  const handleToggleWaktu = (input: TimeSlot | string) => {
    const normalize = (val: TimeSlot | string): TimeSlot => {
      if (typeof val !== "string") return val;
      // parse preset like "Senin 13:00 - 14:30"
      const [day, ...rest] = val.split(" ");
      const times = rest.join(" ");
      const [start, , end] = times.split(" "); // ['13:00', '-', '14:30']
      return { day, start, end };
    };

    const slot = normalize(input);
    setFormData((prev) => {
      const exists = prev.waktuTersedia.some(
        (s) =>
          s.day === slot.day && s.start === slot.start && s.end === slot.end,
      );
      return {
        ...prev,
        waktuTersedia: exists
          ? prev.waktuTersedia.filter(
              (s) =>
                !(
                  s.day === slot.day &&
                  s.start === slot.start &&
                  s.end === slot.end
                ),
            )
          : [...prev.waktuTersedia, slot],
      };
    });
  };

  const isStep1Valid = () => {
    return (
      formData.namaLengkap.trim() &&
      formData.emailIPB.includes("@apps.ipb.ac.id") &&
      formData.password.length >= 6 &&
      formData.nomorTelepon.trim()
    );
  };

  const isStep2Valid = () => {
    return (
      formData.nim.trim() &&
      formData.fakultas &&
      formData.programStudi &&
      formData.alamatDomisili &&
      formData.angkatan
    );
  };

  const isStep3Valid = () => {
    return (
      formData.lamaExperience && formData.subject && formData.biayaPerJam.trim()
    );
  };

  const isStep4Valid = () => {
    return formData.matkuls.length > 0 && formData.waktuTersedia.length > 0;
  };

  const canProceedToNext = () => {
    if (currentStep === 1) return isStep1Valid();
    if (currentStep === 2) return isStep2Valid();
    if (currentStep === 3) return isStep3Valid();
    if (currentStep === 4) return isStep4Valid();
    return false;
  };

  const handleNextStep = () => {
    if (canProceedToNext()) {
      if (currentStep === 4) {
        setIsSubmitted(true);
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isSubmitted) {
    return (
      <Success
        onReset={() => {
          setCurrentStep(1);
          setFormData(initialFormData);
          setIsSubmitted(false);
        }}
      />
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--biru)] mb-2">
            Tutor Registration
          </h1>
          <p className="text-sm sm:text-base text-[var(--gelap)]/70">
            Tolong lengkapi data dengan baik sebelum di verifikasi
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-10 flex items-center justify-center gap-2 sm:gap-4">
          {[1, 2, 3, 4].map((step) => (
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
              {step < 4 && (
                <div
                  className={`h-1 w-4 sm:w-6 transition-colors ${
                    currentStep > step
                      ? "bg-[var(--biru)]"
                      : "bg-[var(--gelap)]/10"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          {/* Step 1: Identitas Diri */}
          {currentStep === 1 && (
            <Step1
              formData={formData}
              onChange={handleInputChange}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />
          )}

          {/* Step 2: Data Akademik */}
          {currentStep === 2 && (
            <Step2
              formData={formData}
              onChange={handleInputChange}
              programStudi={formData.programStudi}
              onProgramSelect={(value: string) =>
                setFormData((prev) => ({ ...prev, programStudi: value }))
              }
              fakultas={formData.fakultas}
              onFakultasSelect={(value: string) =>
                setFormData((prev) => ({ ...prev, fakultas: value }))
              }
            />
          )}

          {/* Step 3: Data Pengajaran */}
          {currentStep === 3 && (
            <Step3 formData={formData} onChange={handleInputChange} />
          )}

          {/* Step 4: Matkul & Waktu */}
          {currentStep === 4 && (
            <Step4
              formData={formData}
              onInputChange={(value) =>
                setFormData((prev) => ({ ...prev, inputMatkul: value }))
              }
              onAddMatkul={handleAddMatkul}
              onRemoveMatkul={handleRemoveMatkul}
              onToggleWaktu={handleToggleWaktu}
            />
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex gap-3 sm:gap-4">
            <button
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className={`flex-1 px-4 py-3 rounded-lg border-2 font-semibold transition-all ${
                currentStep === 1
                  ? "border-[var(--gelap)]/20 bg-[var(--gelap)]/5 text-[var(--gelap)]/50 cursor-not-allowed"
                  : "btn-secondary"
              }`}
            >
              Kembali
            </button>

            <button
              onClick={handleNextStep}
              disabled={!canProceedToNext()}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                canProceedToNext()
                  ? "btn-primary"
                  : "bg-[var(--gelap)]/5 text-[var(--gelap)]/50 cursor-not-allowed"
              }`}
            >
              {currentStep === 4 ? "Selesai" : "Lanjut"}
              {currentStep < 4 && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Progress Text */}
        <p className="text-center text-sm text-[var(--gelap)]/60 mt-6">
          Langkah {currentStep} dari 4
        </p>
      </div>
    </main>
  );
}
