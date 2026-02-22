import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ApplicationData } from '@/lib/validations';
import type { UploadedFile, DocumentType } from '@/types';

type ApplicationState = Partial<ApplicationData> & {
  uploadedFiles: Record<DocumentType, UploadedFile | null>;
};

type ApplicationActions = {
  updateFormData: (data: Partial<ApplicationState>) => void;
  setUploadedFile: (documentType: DocumentType, file: UploadedFile) => void;
  updateUploadProgress: (documentType: DocumentType, progress: number) => void;
  reset: () => void;
};

const initialState: ApplicationState = {
  // Personal Info
  first_name: '',
  last_name: '',
  father_name: '',
  cnic: '',
  date_of_birth: undefined,
  gender: '',
  religion: 'Islam',
  email: '',
  phone: '',
  address: '',
  city: '',
  province: '',
  photo_url: undefined,

  // Academic Info
  qualification: '',
  board_institute: '',
  passing_year: new Date().getFullYear(),
  total_marks: undefined,
  obtained_marks: undefined,
  result_status: 'Pass',
  roll_number: '',
  extra_activities: '',

  // Program Info
  faculty: '',
  program: '',
  study_mode: 'Morning',
  admission_type: 'Regular',
  selected_subjects: [],
  emergency_contact_name: '',
  emergency_contact_phone: '',

  // Documents
  uploadedFiles: {
    cnic_copy: null,
    matric_cert: null,
    fsc_cert: null,
    domicile: null,
    photos: null,
    challan: null,
    character_cert: null,
  },

  // Declaration
  signature_name: '',
  signature_date: new Date(),
  declaration_agreed: false,
};

export const useApplicationStore = create<ApplicationState & ApplicationActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      updateFormData: (data) => set((state) => ({ ...state, ...data })),
      setUploadedFile: (documentType, file) => {
        set((state) => ({
          uploadedFiles: {
            ...state.uploadedFiles,
            [documentType]: file,
          },
        }));
      },
      updateUploadProgress: (documentType, progress) => {
        set((state) => {
          const file = state.uploadedFiles[documentType];
          if (file) {
            return {
              uploadedFiles: {
                ...state.uploadedFiles,
                [documentType]: { ...file, progress },
              },
            };
          }
          return state;
        });
      },
      reset: () => set(initialState),
    }),
    {
      name: 'admitpro-application-storage',
      storage: createJSONStorage(() => localStorage),
      // A custom replacer is needed to handle Date objects
      // and File objects which are not JSON serializable.
      // We will only persist the form data, not the file objects.
      partialize: (state) => {
        const persistableState = { ...state };
        delete persistableState.uploadedFiles; // Don't persist file objects
        return persistableState;
      },
    }
  )
);
