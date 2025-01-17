"use client";

import { api } from "@/trpc/react";
import { TaskList } from "./TaskList";

export function TasksContainer() {
  const { data: tasks, isLoading } = api.task.getAll.useQuery();

  if (isLoading) return <div>Loading tasks...</div>;
  if (!tasks) return <div>No tasks found</div>;

  return <TaskList tasks={tasks} />;
}
