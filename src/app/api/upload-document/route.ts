import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-server';
import type { DocumentType } from '@/types';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const DOCUMENTS_BUCKET = 'admission-documents';
const DOCUMENT_TYPES: DocumentType[] = [
  'cnic_copy',
  'matric_cert',
  'fsc_cert',
  'domicile',
  'photos',
  'challan',
  'character_cert',
];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const rawDocType = formData.get('docType');
    const rawCnic = formData.get('cnic');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'File is required.' }, { status: 400 });
    }

    if (typeof rawDocType !== 'string' || !DOCUMENT_TYPES.includes(rawDocType as DocumentType)) {
      return NextResponse.json({ error: 'Invalid document type.' }, { status: 400 });
    }

    if (typeof rawCnic !== 'string' || !rawCnic.trim()) {
      return NextResponse.json({ error: 'CNIC is required.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Max file size is 5MB.' }, { status: 400 });
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type.' }, { status: 400 });
    }

    const cleanCnic = rawCnic.replace(/[^0-9]/g, '');
    const docType = rawDocType as DocumentType;
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `${cleanCnic}/${docType}-${Date.now()}-${safeName}`;

    const supabase = createAdminClient();

    const doUpload = () =>
      supabase.storage
      .from(DOCUMENTS_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    let { error: uploadError } = await doUpload();

    if (uploadError?.message?.toLowerCase().includes('bucket not found')) {
      const { error: createBucketError } = await supabase.storage.createBucket(DOCUMENTS_BUCKET, {
        public: false,
      });

      if (createBucketError && !createBucketError.message?.toLowerCase().includes('already exists')) {
        return NextResponse.json({ error: createBucketError.message }, { status: 500 });
      }

      const retryResult = await doUpload();
      uploadError = retryResult.error;
    }

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message || 'Upload failed.' }, { status: 500 });
    }

    const { data: signedData, error: signedError } = await supabase.storage
      .from(DOCUMENTS_BUCKET)
      .createSignedUrl(filePath, 60 * 60);

    if (signedError) {
      return NextResponse.json({ error: signedError.message || 'Failed to generate preview URL.' }, { status: 500 });
    }

    return NextResponse.json(
      {
        success: true,
        filePath,
        signedUrl: signedData.signedUrl,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: error?.message || 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
