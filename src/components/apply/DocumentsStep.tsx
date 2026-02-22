"use client";

import DocumentUpload from './DocumentUpload';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const documentFields = [
  { docType: 'cnic_copy', label: 'CNIC / B-Form Copy', description: 'Clear, readable copy of both sides.' },
  { docType: 'challan', label: 'Bank Challan / Fee Voucher', description: 'Scanned copy of the paid application fee challan.' },
] as const;


export default function DocumentsStep() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Upload Required Documents (2 Only)</h2>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            Please fill out your CNIC in the "Personal Information" step before uploading documents.
          </AlertDescription>
        </Alert>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {documentFields.map(field => (
            <DocumentUpload 
                key={field.docType}
                docType={field.docType}
                label={field.label}
                description={field.description}
            />
        ))}
       </div>
    </div>
  );
}
