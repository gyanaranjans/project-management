"use client";

import { useState } from "react";
import { TasksContainer } from "@/components/tasks/TasksContainer";
import { TaskForm } from "@/components/tasks/TaskForm";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { api } from "@/trpc/react";

export default function TasksPage() {
  const [open, setOpen] = useState(false);
  const utils = api.useUtils();
  const createTask = api.task.create.useMutation({
    onSuccess: () => {
      utils.task.getAll.invalidate();
      setOpen(false);
    },
  });
  const handleSubmit = (data: TaskFormValues) => {
    createTask.mutate({
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button>Create Task</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Create New Task</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <TaskForm onSubmit={handleSubmit} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <TasksContainer />
    </div>
  );
}
