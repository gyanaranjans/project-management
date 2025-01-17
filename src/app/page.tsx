import Link from "next/link";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h1 className="mb-8 text-4xl font-bold tracking-tight sm:text-6xl">
              Project Management
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Streamline your workflow, collaborate with your team, and deliver
              projects on time.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/signin">
                <Button size="lg" className="px-8">
                  Get Started
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" size="lg" className="px-8">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid w-full max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border bg-card p-8 shadow-sm transition-shadow hover:shadow-md">
              <h3 className="mb-4 text-xl font-semibold">Task Management</h3>
              <p className="text-muted-foreground">
                Create, assign, and track tasks with ease. Keep your projects
                organized and on schedule.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-8 shadow-sm transition-shadow hover:shadow-md">
              <h3 className="mb-4 text-xl font-semibold">Team Collaboration</h3>
              <p className="text-muted-foreground">
                Work together seamlessly with your team. Share updates and track
                progress in real-time.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-8 shadow-sm transition-shadow hover:shadow-md">
              <h3 className="mb-4 text-xl font-semibold">Project Overview</h3>
              <p className="text-muted-foreground">
                Get a clear view of your projects with detailed dashboards and
                progress tracking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
