-- supabase/migrations/001_init.sql

-- 1. Custom-Types
create type public.application_status as enum ('draft', 'submitted', 'under_review', 'accepted', 'rejected', 'waitlisted');
create type public.staff_role as enum ('admin', 'reviewer', 'data_entry');
create type public.document_type as enum ('cnic_copy', 'matric_cert', 'fsc_cert', 'domicile', 'photos', 'challan', 'character_cert');
create type public.document_status as enum ('pending', 'uploaded', 'verified', 'rejected');

-- 2. Tables
create table public.applicants (
    id uuid not null primary key default gen_random_uuid(),
    application_id text not null unique,
    created_at timestamptz not null default now(),
    status public.application_status not null default 'draft',

    -- Personal Info
    first_name text not null,
    last_name text not null,
    father_name text not null,
    cnic text not null unique,
    date_of_birth date not null,
    gender text not null,
    religion text,
    email text not null unique,
    phone text not null,
    address text not null,
    city text not null,
    province text,
    photo_url text,

    -- Academic Info
    qualification text not null,
    board_institute text not null,
    passing_year integer not null,
    total_marks integer,
    obtained_marks integer not null,
    percentage numeric(5, 2),
    result_status text,
    roll_number text,
    extra_activities text,
    
    -- Program Info
    faculty text not null,
    program text not null,
    study_mode text,
    admission_type text,
    selected_subjects text[],
    emergency_contact_name text,
    emergency_contact_phone text,

    -- Declaration
    signature_name text not null,
    signature_date date not null,
    declaration_agreed boolean not null default false
);
comment on table public.applicants is 'Stores all university admission applications.';

create table public.applicant_documents (
    id uuid not null primary key default gen_random_uuid(),
    applicant_id uuid not null references public.applicants(id) on delete cascade,
    document_type public.document_type not null,
    file_url text not null,
    file_name text not null,
    file_size integer,
    uploaded_at timestamptz not null default now(),
    status public.document_status not null default 'uploaded'
);
comment on table public.applicant_documents is 'Stores uploaded documents for each applicant.';

create table public.staff_users (
    id uuid not null primary key references auth.users(id) on delete cascade,
    full_name text,
    email text unique,
    role public.staff_role not null default 'data_entry',
    department text,
    is_active boolean not null default true,
    created_at timestamptz not null default now()
);
comment on table public.staff_users is 'Stores staff user information and their roles.';

create table public.application_reviews (
    id uuid not null primary key default gen_random_uuid(),
    applicant_id uuid not null references public.applicants(id) on delete cascade,
    reviewed_by uuid not null references public.staff_users(id) on delete set null,
    review_date timestamptz not null default now(),
    decision text not null,
    remarks text,
    merit_score numeric(5, 2)
);
comment on table public.application_reviews is 'Tracks review decisions for each application.';

create table public.audit_logs (
    id uuid not null primary key default gen_random_uuid(),
    table_name text not null,
    record_id uuid,
    action text not null, -- INSERT, UPDATE, DELETE
    changed_by uuid references auth.users(id) on delete set null,
    old_data jsonb,
    new_data jsonb,
    created_at timestamptz not null default now()
);
comment on table public.audit_logs is 'Logs all changes to important tables for auditing purposes.';

-- 3. Indexes
create index idx_applicants_cnic on public.applicants(cnic);
create index idx_applicants_email on public.applicants(email);
create index idx_applicants_status on public.applicants(status);
create index idx_applicant_documents_applicant_id on public.applicant_documents(applicant_id);
create index idx_application_reviews_applicant_id on public.application_reviews(applicant_id);

-- 4. RLS (Row Level Security)

-- Helper function to get user role from JWT
create or replace function get_my_claim(claim TEXT) returns "jsonb" as $$
  select coalesce(
    nullif(current_setting('request.jwt.claims', true), '')::jsonb -> claim,
    null
  );
$$ language sql stable;

create or replace function get_my_role() returns "text" as $$
  select get_my_claim('user_role') ->> 0
$$ language sql stable;

-- Enable RLS on all tables
alter table public.applicants enable row level security;
alter table public.applicant_documents enable row level security;
alter table public.staff_users enable row level security;
alter table public.application_reviews enable row level security;
alter table public.audit_logs enable row level security;

-- Policies for `applicants` table
create policy "Public can create applications"
  on public.applicants for insert with check (true);

create policy "Staff can view and manage all applications"
  on public.applicants for all
  using ( (get_my_role() in ('admin', 'reviewer', 'data_entry')) );
  
-- Policies for `applicant_documents` table
create policy "Applicants can create their own documents"
  on public.applicant_documents for insert with check (true); -- simplified for public form submission

create policy "Staff can view and manage all documents"
  on public.applicant_documents for all
  using ( (get_my_role() in ('admin', 'reviewer', 'data_entry')) );

-- Policies for `staff_users` table
create policy "Staff can view their own record"
  on public.staff_users for select
  using ( auth.uid() = id );

create policy "Admins can manage all staff records"
  on public.staff_users for all
  using ( get_my_role() = 'admin' )
  with check ( get_my_role() = 'admin' );

-- Policies for `application_reviews` table
create policy "Reviewers and Admins can create reviews"
  on public.application_reviews for insert
  with check ( (get_my_role() in ('admin', 'reviewer')) );

create policy "Staff can view all reviews"
  on public.application_reviews for select
  using ( (get_my_role() in ('admin', 'reviewer', 'data_entry')) );

create policy "Admins can update or delete reviews"
  on public.application_reviews for update, delete
  using ( get_my_role() = 'admin' );

-- Policies for `audit_logs` table
create policy "Admins can view all audit logs"
  on public.audit_logs for select
  using ( get_my_role() = 'admin' );
-- (Audit logs are inserted by triggers, so no INSERT policy for users is needed)


-- 5. Storage RLS Policies
-- For `applicant-photos` bucket (public)
-- No specific RLS needed as it's a public bucket.

-- For `admission-documents` bucket (private)
-- Assuming bucket id is 'admission-documents'
create policy "Staff can access all admission documents"
  on storage.objects for all
  using ( bucket_id = 'admission-documents' and (get_my_role() in ('admin', 'reviewer', 'data_entry')) );

-- The public form will upload via a server-side route using the service role key, bypassing RLS.
