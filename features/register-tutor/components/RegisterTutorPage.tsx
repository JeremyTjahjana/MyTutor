"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRegisterTutorForm } from "@/features/register-tutor/hooks/useRegisterTutorForm";
import RegisterTutorHeader from "./RegisterTutorHeader";
import RegisterTutorNavigation from "./RegisterTutorNavigation";
import RegisterTutorStepContent from "./RegisterTutorStepContent";
import RegisterTutorStepper from "./RegisterTutorStepper";
import Success from "./Success";
import WaitingConfirmation from "./WaitingConfirmation";

export default function RegisterTutorPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const form = useRegisterTutorForm(user);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/register-tutor");
    }
  }, [user, isLoading, router]);

  if (form.isSubmitted) {
    return <Success onReset={() => router.push("/")} />;
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--biru)]" />
      </div>
    );
  }

  if (
    user.tutorStatus === "pending" ||
    user.tutorStatus === "approved" ||
    user.role === "tutor"
  ) {
    return <WaitingConfirmation />;
  }

  return (
    <main className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <RegisterTutorHeader user={user} />
        <RegisterTutorStepper currentStep={form.currentStep} />

        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <RegisterTutorStepContent
            currentStep={form.currentStep}
            formData={form.formData}
            contractUploading={form.contractUploading}
            onChange={form.handleInputChange}
            onProgramSelect={form.selectProgramStudi}
            onFakultasSelect={form.selectFakultas}
            onAddSubject={form.handleAddSubject}
            onRemoveMatkul={form.handleRemoveMatkul}
            onToggleWaktu={form.handleToggleWaktu}
            onUploadContract={form.handleUploadContract}
          />

          {form.contractError && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {form.contractError}
            </p>
          )}

          {form.submitError && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {form.submitError}
            </p>
          )}

          <RegisterTutorNavigation
            currentStep={form.currentStep}
            canProceedToNext={form.canProceedToNext}
            isSubmitting={form.isSubmitting}
            contractUploading={form.contractUploading}
            onPrev={form.handlePrevStep}
            onNext={() => void form.handleNextStep()}
          />
        </div>

        <p className="text-center text-sm text-[var(--gelap)]/60 mt-6">
          Langkah {form.currentStep} dari 5
        </p>
      </div>
    </main>
  );
}
