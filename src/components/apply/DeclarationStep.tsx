"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function DeclarationStep() {
  const { control, setValue, watch } = useFormContext();
  
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);
  const [agree3, setAgree3] = useState(false);
  
  const signatureName = watch('signature_name');

  useEffect(() => {
    if (agree1 && agree2 && agree3) {
      setValue('declaration_agreed', true, { shouldValidate: true });
    } else {
      setValue('declaration_agreed', false, { shouldValidate: true });
    }
  }, [agree1, agree2, agree3, setValue]);

  useEffect(() => {
    // Set the date only once on component mount to prevent infinite loops
    setValue('signature_date', new Date());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Declaration & Submission</h2>
      <div className="space-y-4 text-sm text-muted-foreground p-4 border rounded-md bg-secondary/30">
        <p>
            I, <span className="font-semibold">{signatureName || '...'}</span>, solemnly declare that the information provided in this application form is true, complete, and correct to the best of my knowledge and belief.
        </p>
        <p>
            I understand that any false or misleading information will result in the cancellation of my admission at any stage. I agree to abide by the rules, regulations, and statutes of the University as enforced from time to time.
        </p>
      </div>

      <div className="space-y-4">
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
                <Checkbox checked={agree1} onCheckedChange={(c) => setAgree1(c as boolean)} id="agree1" />
            </FormControl>
            <div className="space-y-1 leading-none">
                <label htmlFor="agree1" className="cursor-pointer">
                I have read and understood all the instructions.
                </label>
            </div>
        </FormItem>
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
                <Checkbox checked={agree2} onCheckedChange={(c) => setAgree2(c as boolean)} id="agree2" />
            </FormControl>
            <div className="space-y-1 leading-none">
                <label htmlFor="agree2" className="cursor-pointer">
                I understand the fee structure and refund policy of the university.
                </label>
            </div>
        </FormItem>
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
                <Checkbox checked={agree3} onCheckedChange={(c) => setAgree3(c as boolean)} id="agree3"/>
            </FormControl>
            <div className="space-y-1 leading-none">
                <label htmlFor="agree3" className="cursor-pointer">
                I agree to the terms and conditions of the admission policy.
                </label>
            </div>
        </FormItem>
      </div>
      
       <FormField
          control={control}
          name="declaration_agreed"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                 <Checkbox {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


      <div className="pt-6">
        <FormField
          control={control}
          name="signature_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Applicant's Full Name (as digital signature)</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormDescription>
                Typing your full name here serves as your digital signature.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
