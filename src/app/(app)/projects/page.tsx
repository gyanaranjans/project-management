"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { ProjectActions } from "@/components/projects/ProjectActions";

import { useRouter } from "next/navigation";

export default function ProjectsPage() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: projects, isLoading } = api.project.getAll.useQuery();
  const utils = api.useUtils();

  const createProject = api.project.create.useMutation({
    onSuccess: async () => {
      await utils.project.getAll.invalidate();
      setOpen(false);
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button>Create Project</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Create New Project</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <ProjectForm onSubmit={(data) => createProject.mutate(data)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project) => (
          <Card key={project.id} className="p-4">
            <div className="flex items-center justify-between">
              <div
                className="cursor-pointer"
                onClick={() => router.push(`/projects/${project.id}`)}
              >
                <h3 className="font-medium">{project.name}</h3>
                {project.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {project.description}
                  </p>
                )}
              </div>
              <ProjectActions project={project} />
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                Tasks: {project.tasks.length}
              </p>
              <p className="text-sm text-muted-foreground">
                Members: {project.members.length}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
