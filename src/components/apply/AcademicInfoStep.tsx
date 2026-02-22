"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

const qualifications = [
    "Matriculation/O-Level",
    "Intermediate/A-Level",
    "Bachelor's Degree",
    "Master's Degree",
];

const years = Array.from({ length: 8 }, (_, i) => new Date().getFullYear() - i);

export default function AcademicInfoStep() {
  const { control, watch } = useFormContext();
  const resultStatus = watch('result_status');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Academic Background</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="qualification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Highest Qualification</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your qualification" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {qualifications.map((q) => (
                    <SelectItem key={q} value={q}>{q}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="board_institute"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Board / Institute</FormLabel>
              <FormControl>
                <Input placeholder="e.g., BISE Lahore" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="passing_year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Passing Year</FormLabel>
              <Select onValueChange={(value) => field.onChange(parseInt(value))} value={String(field.value)}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select passing year" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={control}
            name="result_status"
            render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormLabel>Result Status</FormLabel>
                    <FormControl>
                        <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex items-center space-x-4"
                        >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="Pass" />
                                </FormControl>
                                <FormLabel className="font-normal">Pass</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="Awaiting Result" />
                                </FormControl>
                                <FormLabel className="font-normal">Awaiting Result</FormLabel>
                            </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
        <FormField
          control={control}
          name="obtained_marks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Obtained Marks</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 950" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {resultStatus === 'Pass' && (
            <FormField
            control={control}
            name="total_marks"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Total Marks</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="e.g., 1100" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        )}
        <FormField
          control={control}
          name="roll_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Roll Number (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Your final exam roll number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
          control={control}
          name="extra_activities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Extra-Curricular Activities (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your hobbies, sports, or other activities"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
               <FormDescription>
                Briefly mention any significant achievements or positions held.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
    </div>
  );
}
