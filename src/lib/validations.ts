import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_DOCUMENT_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/webp"];

const fileSchema = (types: string[]) => z
  .any()
  .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
  .refine((file) => types.includes(file?.type), `Unsupported file type.`);

export const personalInfoSchema = z.object({
  first_name: z.string().min(2, { message: "First name must be at least 2 characters." }),
  last_name: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  father_name: z.string().min(2, { message: "Father's name is required." }),
  cnic: z.string().regex(/^\d{5}-\d{7}-\d$/, { message: "Invalid CNIC format. Use XXXXX-XXXXXXX-X." }),
  date_of_birth: z.date({ required_error: "Date of birth is required." }),
  gender: z.string({ required_error: "Gender is required." }),
  religion: z.string().optional(),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number." }),
  address: z.string().min(10, { message: "Address must be at least 10 characters." }),
  city: z.string().min(2, { message: "City is required." }),
  province: z.string().optional(),
  photo_url: z.string().url().optional(), // Will be set after upload
});

export const academicInfoSchema = z.object({
  qualification: z.string({ required_error: "Qualification is required." }),
  board_institute: z.string().min(3, { message: "Board/Institute is required." }),
  passing_year: z.number().int().min(new Date().getFullYear() - 7).max(new Date().getFullYear()),
  total_marks: z.coerce.number().int().positive().optional(),
  obtained_marks: z.coerce.number().int().positive({ message: "Obtained marks are required." }),
  result_status: z.enum(['Pass', 'Awaiting Result']),
  roll_number: z.string().optional(),
  extra_activities: z.string().optional(),
}).refine(data => {
    if(data.total_marks) {
        return data.obtained_marks <= data.total_marks;
    }
    return true;
}, {
    message: "Obtained marks cannot be greater than total marks.",
    path: ['obtained_marks']
});

export const programInfoSchema = z.object({
  faculty: z.string({ required_error: "Faculty is required." }),
  program: z.string({ required_error: "Program is required." }),
  study_mode: z.enum(['Morning', 'Evening']),
  admission_type: z.enum(['Regular', 'Self Finance']),
  selected_subjects: z.array(z.string()).min(3, { message: "Select at least 3 subjects." }).max(12),
  emergency_contact_name: z.string().min(3, { message: "Emergency contact name is required." }),
  emergency_contact_phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number." }),
});

export const documentsSchema = z.object({
  cnic_copy: z.string({ required_error: 'CNIC copy is required.' }),
  matric_cert: z.string({ required_error: 'Matric certificate is required.' }),
  fsc_cert: z.string({ required_error: 'FSc certificate is required.' }),
  domicile: z.string({ required_error: 'Domicile certificate is required.' }),
  photos: z.string({ required_error: 'Passport photos are required.' }),
  challan: z.string({ required_error: 'Bank challan is required.' }),
  character_cert: z.string().optional(),
});


export const declarationSchema = z.object({
  signature_name: z.string().min(3, { message: "Signature is required." }),
  signature_date: z.date(),
  declaration_agreed: z.boolean().refine(val => val === true, { message: "You must agree to the declaration." }),
  // The 3 checkboxes will be handled by a single 'declaration_agreed' state in the form.
  // We'll have 3 separate checkbox UI elements that all need to be checked to set this to true.
});

// This combines all schemas for the final submission
export const applicationSchema = personalInfoSchema
  .merge(academicInfoSchema)
  .merge(programInfoSchema)
  .merge(documentsSchema)
  .merge(declarationSchema);
  
export type PersonalInfoData = z.infer<typeof personalInfoSchema>;
export type AcademicInfoData = z.infer<typeof academicInfoSchema>;
export type ProgramInfoData = z.infer<typeof programInfoSchema>;
export type DocumentsData = z.infer<typeof documentsSchema>;
export type DeclarationData = z.infer<typeof declarationSchema>;
export type ApplicationData = z.infer<typeof applicationSchema>;
