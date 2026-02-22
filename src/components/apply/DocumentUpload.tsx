"use client";

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useApplicationStore } from '@/store/application';
import type { DocumentType } from '@/types';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase';

interface DocumentUploadProps {
  docType: DocumentType;
  label: string;
  description: string;
}

export default function DocumentUpload({ docType, label, description }: DocumentUploadProps) {
    const { setValue, watch, formState: { errors } } = useFormContext();
    const applicantCnic = useApplicationStore(s => s.cnic);

    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fileUrl = watch(docType);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!applicantCnic) {
            toast.error("Please fill your CNIC in the Personal Info step first.", {
                description: "Your CNIC is required to create a folder for your documents."
            });
            event.target.value = '';
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            const supabase = createClient();
            const filePath = `${applicantCnic.replace(/-/g, '')}/${docType}-${Date.now()}-${file.name}`;
            
            const { error: uploadError } = await supabase.storage
                .from('admission-documents')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false,
                    contentType: file.type,
                });
            
            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('admission-documents')
                .getPublicUrl(filePath);

            setValue(docType, publicUrl, { shouldValidate: true });
            toast.success(`${label} uploaded successfully.`);
        } catch (error: any) {
            console.error("Upload failed", error);
            setError(error.message || 'Upload failed');
            toast.error(`Failed to upload ${label}.`, { description: error.message });
            setValue(docType, '', { shouldValidate: true });
        } finally {
            setIsUploading(false);
        }
    };
    
    const getFileName = (url: string) => {
        try {
            const path = new URL(url).pathname.split('/').pop();
            return path ? decodeURIComponent(path).substring(14) : 'uploaded-file';
        } catch {
            return 'uploaded-file';
        }
    }
    
    return (
        <div className="space-y-2">
            <label className="font-medium">{label}</label>
            <p className="text-sm text-muted-foreground">{description}</p>
            
            {isUploading && (
                <div className="flex items-center gap-2 border rounded-md p-3">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <p className="text-sm font-medium">Uploading...</p>
                </div>
            )}

            {!isUploading && fileUrl && (
                <div className="flex items-center gap-2 text-green-600 border rounded-md p-3 bg-green-50/50">
                    <CheckCircle2 className="h-5 w-5" />
                    <p className="text-sm font-medium truncate max-w-[200px]">{getFileName(fileUrl)}</p>
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="ml-auto text-sm underline">View</a>
                </div>
            )}
            
            {!isUploading && error && (
                 <div className="flex items-center gap-2 text-destructive border rounded-md p-3 bg-destructive/10">
                    <AlertCircle className="h-5 w-5" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}
            
            {!isUploading && !fileUrl && (
                 <div className="relative">
                    <label htmlFor={docType} className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary transition-colors ${errors[docType] ? 'border-destructive' : ''}`}>
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span></p>
                            <p className="text-xs text-muted-foreground">PDF, PNG, JPG (MAX. 5MB)</p>
                        </div>
                    </label>
                    <Input id={docType} type="file" className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} disabled={isUploading} accept=".pdf,.png,.jpg,.jpeg"/>
                </div>
            )}
             {errors[docType] && <p className="text-sm font-medium text-destructive">{errors[docType]?.message?.toString()}</p>}
        </div>
    );
}
