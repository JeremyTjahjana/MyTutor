"use client";

import type { ChangeEvent } from "react";
import type { FormData, TimeSlot } from "../types";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";

type RegisterTutorStepContentProps = {
  currentStep: number;
  formData: FormData;
  contractUploading: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onProgramSelect: (value: string) => void;
  onFakultasSelect: (value: string) => void;
  onAddSubject: (name: string) => void;
  onRemoveMatkul: (index: number) => void;
  onToggleWaktu: (slot: TimeSlot | string) => void;
  onUploadContract: (file: File) => Promise<void>;
};

export default function RegisterTutorStepContent({
  currentStep,
  formData,
  contractUploading,
  onChange,
  onProgramSelect,
  onFakultasSelect,
  onAddSubject,
  onRemoveMatkul,
  onToggleWaktu,
  onUploadContract,
}: RegisterTutorStepContentProps) {
  if (currentStep === 1) {
    return <Step1 formData={formData} onChange={onChange} />;
  }

  if (currentStep === 2) {
    return (
      <Step2
        formData={formData}
        onChange={onChange}
        programStudi={formData.programStudi}
        onProgramSelect={onProgramSelect}
        fakultas={formData.fakultas}
        onFakultasSelect={onFakultasSelect}
      />
    );
  }

  if (currentStep === 3) {
    return (
      <Step3
        formData={formData}
        onChange={onChange}
        onAddSubject={onAddSubject}
        onRemoveMatkul={onRemoveMatkul}
      />
    );
  }

  if (currentStep === 4) {
    return <Step4 formData={formData} onToggleWaktu={onToggleWaktu} />;
  }

  if (currentStep === 5) {
    return (
      <Step5
        formData={formData}
        onUploadContract={onUploadContract}
        isUploading={contractUploading}
      />
    );
  }

  return null;
}
