"use client";

import { TasksContainer } from "@/components/tasks/TasksContainer";
import { ProjectOverview } from "@/components/projects/ProjectOverview";
import { Card } from "@/components/ui/card";
import { api } from "@/trpc/react";

export default function DashboardPage() {
  const { data: user } = api.user.getProfile.useQuery();

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Your Tasks</h2>
          <TasksContainer />
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Project Overview</h2>
          <ProjectOverview />
        </Card>
      </div>
    </div>
  );
}
