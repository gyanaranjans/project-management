"use client";

import { useParams } from "next/navigation";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskForm } from "@/components/tasks/TaskForm";
import { ProjectActions } from "@/components/projects/ProjectActions";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

export default function ProjectDetailsPage() {
  const [open, setOpen] = useState(false);
  const params = useParams();
  const projectId = params.id as string;
  const utils = api.useUtils();

  const { data: project, isLoading } = api.project.getById.useQuery(projectId);
  const createTask = api.task.create.useMutation({
    onSuccess: () => {
      utils.project.getById.invalidate(projectId);
      setOpen(false);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            {project.description && (
              <p className="mt-2 text-muted-foreground">
                {project.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button>Add Task</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Create New Task</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <TaskForm
                    onSubmit={(data) =>
                      createTask.mutate({
                        ...data,
                        projectId,
                        dueDate: data.dueDate
                          ? new Date(data.dueDate)
                          : undefined,
                      })
                    }
                    projectId={projectId}
                  />
                </div>
              </SheetContent>
            </Sheet>
            <ProjectActions project={project} />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Members:</span>
            {project.members.map((member) => (
              <Badge key={member.id} variant="secondary">
                {member.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-4">
          <h2 className="font-semibold">To Do</h2>
          <div className="mt-4">
            <TaskList
              tasks={project.tasks.filter((task) => task.status === "TODO")}
            />
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="font-semibold">In Progress</h2>
          <div className="mt-4">
            <TaskList
              tasks={project.tasks.filter(
                (task) => task.status === "IN_PROGRESS",
              )}
            />
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="font-semibold">Done</h2>
          <div className="mt-4">
            <TaskList
              tasks={project.tasks.filter((task) => task.status === "DONE")}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
