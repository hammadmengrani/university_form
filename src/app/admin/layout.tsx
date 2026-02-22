import { createServerComponentClient } from '@/lib/supabase-server';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/auth/login');
  }

  const { data: staffUser } = await supabase
    .from('staff_users')
    .select('full_name, role, email')
    .eq('id', user.id)
    .single();

  return (
    <div className="flex h-screen bg-gray-100/50 dark:bg-gray-900/50">
      <Sidebar userRole={staffUser?.role} />
      <div className="flex flex-1 flex-col">
        <Header userName={staffUser?.full_name} userEmail={staffUser?.email} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
