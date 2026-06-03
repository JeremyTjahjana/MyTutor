"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { initialFormData } from "../constants";
import type { FormData, TimeSlot } from "../types";
import type { User } from "@/types/user";
import { registerTutorAction } from "@/features/register-tutor/services/register.action";
import { uploadTutorContractPdf } from "@/features/register-tutor/services/contract-upload.client";
import { formatPhoneNumberForServer, sanitizePhoneNumber } from "../utils/phone";
import { isRegisterTutorStepValid } from "../utils/validation";

export function useRegisterTutorForm(user: User | null) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contractUploading, setContractUploading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [contractError, setContractError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setFormData((prev) => ({
      ...prev,
      namaLengkap: prev.namaLengkap || user.fullName,
      emailIPB: prev.emailIPB || user.email,
    }));
  }, [user]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setSubmitError(null);
    setFormData((prev) => ({
      ...prev,
      [name]: name === "nomorTelepon" ? sanitizePhoneNumber(value) : value,
    }));
  };

  const handleUploadContract = async (file: File) => {
    if (!user) return;
    setContractUploading(true);
    setContractError(null);

    try {
      const contract = await uploadTutorContractPdf(user.id, file);
      setFormData((prev) => ({
        ...prev,
        contractFileName: contract.fileName,
        contractPdfUrl: contract.publicUrl,
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

  const handleRemoveMatkul = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      matkuls: prev.matkuls.filter((_, i) => i !== index),
    }));
  };

  const handleAddSubject = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      matkuls: prev.matkuls.includes(name)
        ? prev.matkuls
        : [...prev.matkuls, name],
    }));
  };

  const handleToggleWaktu = (input: TimeSlot | string) => {
    const slot = normalizeTimeSlot(input);
    setFormData((prev) => {
      const exists = prev.waktuTersedia.some(
        (item) =>
          item.day === slot.day &&
          item.start === slot.start &&
          item.end === slot.end,
      );

      return {
        ...prev,
        waktuTersedia: exists
          ? prev.waktuTersedia.filter(
              (item) =>
                !(
                  item.day === slot.day &&
                  item.start === slot.start &&
                  item.end === slot.end
                ),
            )
          : [...prev.waktuTersedia, slot],
      };
    });
  };

  const canProceedToNext = isRegisterTutorStepValid(currentStep, formData);

  const handleNextStep = async () => {
    if (!canProceedToNext || !user) return;

    if (currentStep < 5) {
      setCurrentStep((step) => step + 1);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const result = await registerTutorAction({
        existingUserId: user.id,
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
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep((step) => step - 1);
  };

  const selectProgramStudi = (value: string) => {
    setFormData((prev) => ({ ...prev, programStudi: value }));
  };

  const selectFakultas = (value: string) => {
    setFormData((prev) => ({ ...prev, fakultas: value }));
  };

  return {
    currentStep,
    formData,
    isSubmitted,
    isSubmitting,
    contractUploading,
    submitError,
    contractError,
    canProceedToNext,
    handleInputChange,
    handleUploadContract,
    handleRemoveMatkul,
    handleAddSubject,
    handleToggleWaktu,
    handleNextStep,
    handlePrevStep,
    selectProgramStudi,
    selectFakultas,
  };
}

function normalizeTimeSlot(value: TimeSlot | string): TimeSlot {
  if (typeof value !== "string") return value;

  const [day, ...rest] = value.split(" ");
  const times = rest.join(" ");
  const [start, , end] = times.split(" ");

  return { day, start, end };
}
