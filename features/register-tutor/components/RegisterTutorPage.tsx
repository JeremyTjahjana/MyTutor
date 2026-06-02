"use client";

import { supabase } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Check, Loader2 } from "lucide-react";
import { FormData, TimeSlot } from "../types";
import { initialFormData } from "../constants";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Success from "./Success";
import WaitingConfirmation from "./WaitingConfirmation";
import { registerTutorAction } from "@/features/register-tutor/services/register.action";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterTutorPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contractUploading, setContractUploading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [contractError, setContractError] = useState<string | null>(null);

  const sanitizePhoneNumber = (value: string) => value.replace(/\D/g, "");

  const formatPhoneNumberForServer = (value: string) => {
    const digitsOnly = sanitizePhoneNumber(value);

    if (!digitsOnly) return "";
    if (digitsOnly.startsWith("62")) return `+${digitsOnly}`;
    if (digitsOnly.startsWith("0")) return `+62${digitsOnly.slice(1)}`;

    return `+62${digitsOnly}`;
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/register-tutor");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        namaLengkap: prev.namaLengkap || user.fullName,
        emailIPB: prev.emailIPB || user.email,
      }));
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setSubmitError(null);
    setFormData((prev) => ({
      ...prev,
      [name]: name === "nomorTelepon" ? sanitizePhoneNumber(value) : value,
    }));
  };

  const handleUploadContract = async (file: File) => {
    setContractUploading(true);
    setContractError(null);

    try {
      const fileExt = file.name.split(".").pop() || "pdf";
      const storagePath = `${user!.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("tutor-contracts")
        .upload(storagePath, file, {
          contentType: file.type || "application/pdf",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("tutor-contracts").getPublicUrl(storagePath);

      setFormData((prev) => ({
        ...prev,
        contractFileName: file.name,
        contractPdfUrl: publicUrl,
        contractUploaded: true,
      }));
    } catch (err) {
      console.error("handleUploadContract error:", err);
      setFormData((prev) => ({
        ...prev,
        contractFileName: "",
        contractPdfUrl: "",
        contractUploaded: false,
      }));
      setContractError("Gagal mengunggah PDF kontrak. Coba lagi.");
    } finally {
      setContractUploading(false);
    }
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
      const [day, ...rest] = val.split(" ");
      const times = rest.join(" ");
      const [start, , end] = times.split(" ");
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

  const isStep1Valid = () =>
    formData.namaLengkap.trim() &&
    formData.emailIPB.includes("@apps.ipb.ac.id") &&
    /^\d{8,13}$/.test(formData.nomorTelepon.trim());

  const isStep2Valid = () =>
    formData.nim.trim() &&
    formData.fakultas &&
    formData.programStudi &&
    formData.alamatDomisili &&
    formData.angkatan;

  const isStep3Valid = () =>
    formData.lamaExperience && formData.matkuls.length > 0 && formData.biayaPerJam.trim();

  const isStep4Valid = () =>
    formData.waktuTersedia.length > 0;

  const isStep5Valid = () =>
    formData.contractUploaded === true &&
    formData.contractFileName.trim() !== "" &&
    formData.contractPdfUrl.trim() !== "";

  const canProceedToNext = () => {
    if (currentStep === 1) return isStep1Valid();
    if (currentStep === 2) return isStep2Valid();
    if (currentStep === 3) return isStep3Valid();
    if (currentStep === 4) return isStep4Valid();
    if (currentStep === 5) return isStep5Valid();
    return false;
  };

  const handleNextStep = async () => {
    if (!canProceedToNext()) return;

    if (currentStep === 5) {
      // Submit to backend
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        const result = await registerTutorAction({
          existingUserId: user!.id,
          nomorTelepon: formatPhoneNumberForServer(formData.nomorTelepon),
          lamaExperience: formData.lamaExperience,
          biayaPerJam: formData.biayaPerJam,
          matkuls: formData.matkuls,
          waktuTersedia: formData.waktuTersedia,
          contractFileName: formData.contractFileName,
          contractPdfUrl: formData.contractPdfUrl,
        });

        if (result.success) {
          setIsSubmitted(true);
        } else {
          setSubmitError(result.error ?? "Terjadi kesalahan.");
        }
      } catch {
        setSubmitError("Terjadi kesalahan jaringan. Coba lagi.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (isSubmitted) {
    return (
      <Success
        onReset={() => {
          router.push("/");
        }}
      />
    );
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--biru)]" />
      </div>
    );
  }

  // If user already submitted tutor registration, show waiting page
  if (user.tutorStatus === "pending" || user.tutorStatus === "approved" || user.role === "tutor") {
    return <WaitingConfirmation />;
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
          {user && (
            <p className="mt-2 text-sm text-green-600 font-medium">
              Masuk sebagai: {user.fullName} ({user.email})
            </p>
          )}
        </div>

        {/* Stepper — shows 5 steps */}
        <div className="mb-10 flex items-center justify-center gap-2 sm:gap-4">
          {[1, 2, 3, 4, 5].map((step, idx) => (
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
                  idx + 1
                )}
              </div>
              {idx < 4 && (
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
          {currentStep === 1 && (
            <Step1 formData={formData} onChange={handleInputChange} />
          )}
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
          {currentStep === 3 && (
            <Step3
              formData={formData}
              onChange={handleInputChange}
              onAddSubject={(name: string) => {
                setFormData((prev) => ({
                  ...prev,
                  matkuls: prev.matkuls.includes(name)
                    ? prev.matkuls
                    : [...prev.matkuls, name],
                }));
              }}
              onRemoveMatkul={handleRemoveMatkul}
            />
          )}
          {currentStep === 4 && (
            <Step4
              formData={formData}
              onToggleWaktu={handleToggleWaktu}
            />
          )}
          {currentStep === 5 && (
            <Step5
              formData={formData}
              onUploadContract={handleUploadContract}
              isUploading={contractUploading}
            />
          )}

          {contractError && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {contractError}
            </p>
          )}

          {/* Error */}
          {submitError && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {submitError}
            </p>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex gap-3 sm:gap-4">
            <button
              onClick={handlePrevStep}
              disabled={currentStep === 1 || contractUploading || isSubmitting}
              className={`flex-1 px-4 py-3 rounded-lg border-2 font-semibold transition-all ${
                currentStep === 1 || contractUploading || isSubmitting
                  ? "border-[var(--gelap)]/20 bg-[var(--gelap)]/5 text-[var(--gelap)]/50 cursor-not-allowed"
                  : "btn-secondary cursor-pointer"
              }`}
            >
              Kembali
            </button>

            <button
              onClick={handleNextStep}
              disabled={
                !canProceedToNext() || isSubmitting || contractUploading
              }
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                canProceedToNext() && !isSubmitting && !contractUploading
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
        </div>

        {/* Progress Text */}
        <p className="text-center text-sm text-[var(--gelap)]/60 mt-6">
          Langkah {currentStep} dari 5
        </p>
      </div>
    </main>
  );
}
