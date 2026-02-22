import MultiStepLayout from "@/components/apply/MultiStepLayout";

export default function ApplyPage() {
  return (
    <div className="min-h-screen w-full bg-background font-body">
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-headline">University Admission Application</h1>
          <p className="mt-2 text-lg text-primary-foreground/80">Fall 2025 Intake</p>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <MultiStepLayout />
      </main>
      <footer className="mt-12 border-t py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} AdmitPro University. All rights reserved.</p>
      </footer>
    </div>
  );
}
