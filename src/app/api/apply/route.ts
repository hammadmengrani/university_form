import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-server';
import { applicationSchema } from '@/lib/validations';
import { format } from 'date-fns';
import type { DocumentType } from '@/types';

const DOCUMENT_TYPES: DocumentType[] = [
    'cnic_copy',
    'matric_cert',
    'fsc_cert',
    'domicile',
    'photos',
    'challan',
    'character_cert',
];

async function generateApplicationId(supabase: ReturnType<typeof createAdminClient>): Promise<string> {
    const year = new Date().getFullYear();
    let isUnique = false;
    let newAppId = '';

    while (!isUnique) {
        const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();
        newAppId = `EU-${year}-${randomDigits}`;

        const { data, error } = await supabase
            .from('applicants')
            .select('application_id')
            .eq('application_id', newAppId)
            .single();

        if (error && error.code === 'PGRST116') {
            isUnique = true;
        } else if (!data && !error) {
            isUnique = true;
        } else if (error && error.code !== 'PGRST116') {
            // An actual error occurred, other than 'no rows found'
            throw error;
        }
    }
    return newAppId;
}


export async function POST(request: Request) {
    try {
        const json = await request.json();
        const parsedData = applicationSchema.safeParse(json);

        if (!parsedData.success) {
            return NextResponse.json({ error: 'Invalid data', details: parsedData.error.flatten() }, { status: 400 });
        }

        const supabase = createAdminClient();

        // Check for uniqueness of CNIC and email
        const { data: existingApplicant } = await supabase
            .from('applicants')
            .select('cnic, email')
            .or(`cnic.eq.${parsedData.data.cnic},email.eq.${parsedData.data.email}`)
            .single();

        if (existingApplicant) {
            if (existingApplicant.cnic === parsedData.data.cnic) {
                return NextResponse.json({ error: 'An application with this CNIC already exists.' }, { status: 409 });
            }
            if (existingApplicant.email === parsedData.data.email) {
                return NextResponse.json({ error: 'An application with this email already exists.' }, { status: 409 });
            }
        }

        const applicationId = await generateApplicationId(supabase);
        
        const {
            cnic_copy,
            matric_cert,
            fsc_cert,
            domicile,
            photos,
            challan,
            character_cert,
            ...applicantData
        } = parsedData.data;

        // Calculate percentage
        const percentage = applicantData.total_marks
          ? (applicantData.obtained_marks / applicantData.total_marks) * 100
          : null;


        const { data: newApplicant, error } = await supabase
            .from('applicants')
            .insert({
                ...applicantData,
                application_id: applicationId,
                status: 'submitted',
                date_of_birth: format(new Date(applicantData.date_of_birth), 'yyyy-MM-dd'),
                signature_date: format(new Date(applicantData.signature_date), 'yyyy-MM-dd'),
                percentage: percentage ? parseFloat(percentage.toFixed(2)) : null,
            })
            .select('id, application_id')
            .single();

        if (error) {
            console.error('Supabase insert error:', error);
            return NextResponse.json({ error: 'Failed to create application.' }, { status: 500 });
        }

        // Now, insert document records
        const documentPayload: Record<DocumentType, string | undefined> = {
            cnic_copy,
            matric_cert,
            fsc_cert,
            domicile,
            photos,
            challan,
            character_cert,
        };

        const documentRecords = DOCUMENT_TYPES
            .map((docType) => ({ docType, fileUrl: documentPayload[docType] }))
            .filter((item) => Boolean(item.fileUrl))
            .map(({ docType, fileUrl }) => ({
                applicant_id: newApplicant.id,
                document_type: docType,
                file_url: fileUrl as string,
                file_name: (fileUrl as string).split('/').pop() || 'unknown',
            }));

        if (documentRecords.length > 0) {
            const { error: docError } = await supabase
                .from('applicant_documents')
                .insert(documentRecords);

            if (docError) {
                console.error('Supabase document insert error:', docError);
                // Non-critical, application is created. Log this for follow-up.
            }
        }

        // TODO: Send confirmation email via Resend

        return NextResponse.json({
            success: true,
            message: 'Application submitted successfully.',
            id: newApplicant.id,
            application_id: newApplicant.application_id,
        }, { status: 201 });

    } catch (e: any) {
        console.error('API Error:', e);
        return NextResponse.json({ error: e?.message || 'An internal server error occurred.' }, { status: 500 });
    }
}
