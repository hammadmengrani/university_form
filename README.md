# AdmitPro - University Admission System

AdmitPro is a complete, production-ready University Admission Form System built with Next.js 14 and Supabase. It provides a seamless experience for applicants and a powerful portal for administrative staff.

## 🚀 Features

- **Multi-Step Public Admission Form**: A 5-step wizard for applicants to submit their information.
- **Secure File Uploads**: Drag-and-drop uploads for required documents directly to Supabase Storage.
- **Application Status Tracking**: A public page for applicants to check their status using their Application ID or CNIC.
- **Powerful Admin Dashboard**: A central hub for staff to view statistics, recent applications, and system overviews.
- **Comprehensive Application Management**: Advanced table with search, sort, filter, and pagination for all applications.
- **Role-Based Access Control**: Secure admin portal with different roles and permissions (Admin, Reviewer, Data Entry).
- **Review & Decision Workflow**: A structured process for reviewing applications and making admission decisions.
- **Automated Email Notifications**: Using Resend for sending confirmation and status update emails.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database & Auth**: Supabase
- **Styling**: Tailwind CSS & shadcn/ui
- **Form Management**: React Hook Form & Zod
- **State Management**: Zustand
- **Email**: Resend
- **Deployment**: Vercel

## ⚙️ Local Development Setup

Follow these steps to get the project running on your local machine.

### 1. Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A Supabase account and project
- A Resend account and API key

### 2. Clone the Repository

```bash
git clone <your-repo-url>
cd admitpro
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Supabase Project Setup

1.  **Create a Supabase Project**: Go to [supabase.com](https://supabase.com) and create a new project.
2.  **Get API Keys**: In your Supabase project, navigate to **Project Settings > API**. You will need the **Project URL** and the `anon` **public** key.
3.  **Get Service Role Key**: Under the API keys, find the `service_role` **secret** key. **Warning**: This key bypasses all RLS policies. Never expose it on the client side.
4.  **Run the Database Migration**:
    -   Navigate to the **SQL Editor** in your Supabase dashboard.
    -   Click on **New query**.
    -   Copy the entire content of the `supabase/migrations/001_init.sql` file from this project.
    -   Paste it into the SQL editor and click **RUN**. This will create all the necessary tables, types, functions, and RLS policies.
5.  **Enable Email/Password Auth**:
    -   Go to **Authentication > Providers**.
    -   Enable the **Email** provider. By default, "Enable email confirmations" is on. You may want to disable it for easier local testing with dummy staff accounts.
6.  **Create Storage Buckets**:
    -   Go to **Storage** from the sidebar.
    -   Create a new bucket named `applicant-photos`. Make it a **public** bucket.
    -   Create another new bucket named `admission-documents`. Keep this a **private** bucket. We will manage access via RLS policies on the `storage.objects` table, which are included in the migration script.

### 5. Set Up Environment Variables

Create a file named `.env.local` in the root of the project by copying the example file.

```bash
cp .env.local.example .env.local
```

Now, fill in the values in `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=<Your-Supabase-Project-URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<Your-Supabase-anon-public-key>
SUPABASE_SERVICE_ROLE_KEY=<Your-Supabase-service_role-secret-key>

# Email (Resend)
RESEND_API_KEY=<Your-Resend-API-Key>

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Run the Development Server

```bash
npm run dev
```

The application should now be running at [http://localhost:3000](http://localhost:3000).

### 7. Creating an Admin User

To access the admin panel, you need to create a staff user.

1.  Go to **Authentication > Users** in your Supabase dashboard and click **Invite user**. Enter an email address.
2.  This will create a user but without a role. Go to the **Table Editor > `staff_users` table**.
3.  Click **Insert row**.
    -   `id`: Paste the User UID from the user you just created in the Auth section.
    -   `full_name`: "Admin User"
    -   `email`: The email you used.
    -   `role`: `admin`
    -   `is_active`: `true`
4.  Go to your email and accept the invitation to set a password.
5.  Navigate to `http://localhost:3000/auth/login` and log in with your new credentials.

## 🚀 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com).

1.  **Push to GitHub**: Push your project repository to GitHub.
2.  **Import to Vercel**: Create a new project on Vercel and import your GitHub repository.
3.  **Configure Environment Variables**: In the Vercel project settings, add all the environment variables from your `.env.local` file.
4.  **Deploy**: Vercel will automatically build and deploy your application. Any subsequent pushes to the `main` branch will trigger new deployments.
