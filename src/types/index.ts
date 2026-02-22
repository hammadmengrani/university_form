import type { Database } from './database.types';

export type Application = Database['public']['Tables']['applicants']['Row'];
export type ApplicationDocument = Database['public']['Tables']['applicant_documents']['Row'];
export type StaffUser = Database['public']['Tables']['staff_users']['Row'];
export type ApplicationReview = Database['public']['Tables']['application_reviews']['Row'];

export type ApplicationStatus = Database['public']['Enums']['application_status'];
export type StaffRole = Database['public']['Enums']['staff_role'];
export type DocumentType = Database['public']['Enums']['document_type'];

export type Step = {
  id: number;
  name: string;
  fields?: string[];
};

export type AdminDashboardStats = {
  totalApplications: number;
  submittedToday: number;
  underReview: number;
  accepted: number;
  rejected: number;
  pendingDocuments: number;
  recentApplications: Application[];
  applicationsByProgram: { program: string; count: number }[];
  statusDistribution: { status: string; count: number }[];
};

export type UploadedFile = {
  documentType: DocumentType;
  file: File;
  fileUrl?: string;
  fileName: string;
  fileSize: number;
  status: 'pending' | 'uploading' | 'uploaded' | 'error';
  progress?: number;
  error?: string;
};
