import { Suspense } from "react";
import LoginFormClient from "./LoginFormClient";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const error = params.error;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginFormClient error={error} />
      </Suspense>
    </main>
  );
}
