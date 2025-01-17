"use client";

import { api } from "@/trpc/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ProjectOverview() {
  const { data: projects, isLoading } = api.project.getAll.useQuery();
  const router = useRouter();

  if (isLoading) return <div>Loading projects...</div>;

  const stats = {
    total: projects?.length ?? 0,
    active:
      projects?.filter((p) => p.tasks.some((t) => t.status !== "DONE"))
        .length ?? 0,
    completed:
      projects?.filter((p) => p.tasks.every((t) => t.status === "DONE"))
        .length ?? 0,
  };

  const recentProjects = projects?.slice(0, 3) ?? [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Projects</p>
          <p className="mt-2 text-2xl font-bold">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="mt-2 text-2xl font-bold">{stats.active}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Completed</p>
          <p className="mt-2 text-2xl font-bold">{stats.completed}</p>
        </Card>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Recent Projects</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/projects")}
          >
            View All
          </Button>
        </div>
        <div className="space-y-4">
          {recentProjects.map((project) => (
            <Card
              key={project.id}
              className="cursor-pointer p-4 hover:bg-accent"
              onClick={() => router.push(`/projects/${project.id}`)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{project.name}</h4>
                  {project.description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {project.description}
                    </p>
                  )}
                </div>
                <Badge>{project.tasks.length} tasks</Badge>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="text-sm text-muted-foreground">
                  Progress:
                  <span className="ml-1 font-medium">
                    {Math.round(
                      (project.tasks.filter((t) => t.status === "DONE").length /
                        (project.tasks.length || 1)) *
                        100,
                    )}
                    %
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
