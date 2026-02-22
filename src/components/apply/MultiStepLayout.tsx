"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";

import { useApplicationStore } from "@/store/application";
import { applicationSchema, ApplicationData } from "@/lib/validations";
import type { Step } from "@/types";

import StepIndicator from "./StepIndicator";
import PersonalInfoStep from "./PersonalInfoStep";
import AcademicInfoStep from "./AcademicInfoStep";
import ProgramStep from "./ProgramStep";
import DocumentsStep from "./DocumentsStep";
import DeclarationStep from "./DeclarationStep";
import { Button } from "@/components/ui/button";

const steps: Step[] = [
  { id: 1, name: "Personal Information", fields: ['first_name', 'last_name', 'father_name', 'cnic', 'date_of_birth', 'gender', 'email', 'phone', 'address', 'city'] },
  { id: 2, name: "Academic Background", fields: ['qualification', 'board_institute', 'passing_year', 'obtained_marks', 'result_status'] },
  { id: 3, name: "Program Selection", fields: ['faculty', 'program', 'selected_subjects', 'emergency_contact_name', 'emergency_contact_phone'] },
  { id: 4, name: "Document Upload", fields: ['cnic_copy', 'matric_cert', 'fsc_cert', 'domicile', 'photos', 'challan'] },
  { id: 5, name: "Declaration & Submit" },
];

export default function MultiStepLayout() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const formData = useApplicationStore((state) => state);
  const updateFormData = useApplicationStore((state) => state.updateFormData);
  const resetStore = useApplicationStore((state) => state.reset);

  const methods = useForm<ApplicationData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: formData,
    mode: "onChange",
  });

  const { trigger, getValues, watch, formState: { errors } } = methods;

  useEffect(() => {
    setIsMounted(true);
    // Sync form with zustand store on mount
    methods.reset(formData);
  }, [methods, formData]);
  
  // Subscribe to form changes and update zustand store
  useEffect(() => {
    const subscription = watch((value) => {
      updateFormData(value);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateFormData]);

  const nextStep = async () => {
    const fields = steps[currentStep - 1].fields;
    const output = await trigger(fields as (keyof ApplicationData)[]);

    if (!output) return;

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async () => {
    const output = await trigger();
    if (!output) {
      toast.error("Form is invalid", { description: "Please check all steps for errors." });
      // Find the first step with an error and navigate to it
      for (const step of steps) {
        if (step.fields?.some(field => errors[field as keyof typeof errors])) {
          setCurrentStep(step.id);
          break;
        }
      }
      return;
    }
    
    setIsSubmitting(true);
    toast.info("Submitting Application", { description: "Please wait..." });

    try {
        const response = await fetch('/api/apply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(getValues()),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "An unknown error occurred.");
        }

        toast.success("Application Submitted Successfully!", {
            description: `Your Application ID is ${result.application_id}.`,
        });

        const applicantId = result.id;
        resetStore();
        router.push(`/apply/success?appId=${result.application_id}&id=${applicantId}`);
    } catch (error: any) {
        toast.error("Submission Failed", {
            description: error.message,
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (!isMounted) {
    return <div>Loading form...</div>; // Or a spinner
  }

  return (
    <FormProvider {...methods}>
      <div className="rounded-lg border bg-card shadow-lg">
        <div className="p-6 border-b">
          <StepIndicator currentStep={currentStep} steps={steps} />
        </div>
        <div className="p-6">
          <form onSubmit={(e) => e.preventDefault()}>
            {currentStep === 1 && <PersonalInfoStep />}
            {currentStep === 2 && <AcademicInfoStep />}
            {currentStep === 3 && <ProgramStep />}
            {currentStep === 4 && <DocumentsStep />}
            {currentStep === 5 && <DeclarationStep />}
          </form>
        </div>
        <div className="flex justify-between p-6 border-t bg-secondary/30 rounded-b-lg">
          <Button onClick={prevStep} disabled={currentStep === 1 || isSubmitting}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          {currentStep < steps.length ? (
            <Button onClick={nextStep} disabled={isSubmitting}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={onSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </FormProvider>
  );
}
