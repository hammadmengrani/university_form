"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

const faculties = {
    "Science & Technology": ["Computer Science", "Software Engineering", "Data Science"],
    "Arts & Humanities": ["English Literature", "History", "Fine Arts"],
    "Business Administration": ["BBA", "MBA", "Accounting & Finance"],
};

const subjects = [
    { id: "math101", label: "Calculus I" },
    { id: "cs101", label: "Intro to Programming" },
    { id: "phy101", label: "Physics I" },
    { id: "chem101", label: "Chemistry I" },
    { id: "eng101", label: "English Composition" },
    { id: "his101", label: "World History" },
    { id: "bba101", label: "Intro to Business" },
    { id: "eco101", label: "Microeconomics" },
    { id: "art101", label: "Drawing I" },
    { id: "psy101", label: "Psychology" },
    { id: "soc101", label: "Sociology" },
    { id: "stat101", label: "Statistics" },
];

export default function ProgramStep() {
  const { control, watch, setValue } = useFormContext();
  const selectedFaculty = watch('faculty');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Program Selection</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="faculty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Faculty</FormLabel>
              <Select onValueChange={(value) => {
                  field.onChange(value);
                  setValue('program', ''); // Reset program on faculty change
              }} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a faculty" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.keys(faculties).map((faculty) => (
                    <SelectItem key={faculty} value={faculty}>{faculty}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="program"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Program</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={!selectedFaculty}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a program" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {selectedFaculty && faculties[selectedFaculty as keyof typeof faculties]?.map((program) => (
                    <SelectItem key={program} value={program}>{program}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={control}
            name="study_mode"
            render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormLabel>Study Mode</FormLabel>
                    <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center space-x-4">
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl><RadioGroupItem value="Morning" /></FormControl>
                                <FormLabel className="font-normal">Morning</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl><RadioGroupItem value="Evening" /></FormControl>
                                <FormLabel className="font-normal">Evening</FormLabel>
                            </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={control}
            name="admission_type"
            render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormLabel>Admission Type</FormLabel>
                    <FormControl>
                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center space-x-4">
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl><RadioGroupItem value="Regular" /></FormControl>
                                <FormLabel className="font-normal">Regular</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl><RadioGroupItem value="Self Finance" /></FormControl>
                                <FormLabel className="font-normal">Self Finance</FormLabel>
                            </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
      </div>

      <FormField
        control={control}
        name="selected_subjects"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel className="text-base">Subject Selection</FormLabel>
              <FormDescription>
                Select at least 3 subjects you wish to study.
              </FormDescription>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {subjects.map((item) => (
              <FormField
                key={item.id}
                control={control}
                name="selected_subjects"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={item.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(item.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...(field.value || []), item.id])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== item.id
                                  )
                                )
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {item.label}
                      </FormLabel>
                    </FormItem>
                  )
                }}
              />
            ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-6 pt-6 border-t">
        <h3 className="text-xl font-semibold">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="emergency_contact_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Jane Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="emergency_contact_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+92 300 1234567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
      </div>
    </div>
  );
}
