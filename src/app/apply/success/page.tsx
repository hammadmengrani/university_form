import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ApplySuccessPageProps = {
  searchParams: Promise<{ appId?: string }>;
};

export default async function ApplySuccessPage({ searchParams }: ApplySuccessPageProps) {
  const params = await searchParams;
  const appId = params.appId;

  return (
    <main className="min-h-screen w-full bg-background p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 inline-flex rounded-full bg-green-100 p-2 text-green-700">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <CardTitle className="text-2xl font-headline">Application Submitted</CardTitle>
            <CardDescription>
              Your admission application has been submitted successfully.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-2 text-center">
            <p className="text-sm text-muted-foreground">Application ID</p>
            <p className="text-xl font-semibold tracking-wide">{appId || "N/A"}</p>
          </CardContent>

          <CardFooter className="flex justify-center gap-3">
            <Button asChild variant="outline">
              <Link href="/apply">Submit Another</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
