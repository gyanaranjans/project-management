// src/components/tasks/TaskList.tsx
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/trpc/react";
import { format } from "date-fns";
import { TaskMenu } from "@/components/tasks/TaskMenu";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "TODO" | "IN_PROGRESS" | "DONE";
  dueDate?: Date;
  assignedTo: { name: string };
  project?: { name: string };
}

interface TaskListProps {
  tasks: Task[];
}
const getPriorityVariant = (priority: "LOW" | "MEDIUM" | "HIGH") => {
  switch (priority) {
    case "LOW":
      return "secondary";
    case "MEDIUM":
      return "default";
    case "HIGH":
      return "destructive";
  }
};

export function TaskList({ tasks }: TaskListProps) {
  if (!tasks?.length) {
    return <div>No tasks found</div>;
  }
  return (
    <div className="space-y-4">
      {tasks?.map((task) => (
        <Card key={task.id} className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{task.title}</h3>
            <div className="flex items-center gap-2">
              <Badge variant={getPriorityVariant(task.priority)}>
                {task.priority}
              </Badge>
              <TaskMenu task={task} />
            </div>
          </div>
          {task.description && (
            <p className="mt-2 text-sm text-gray-600">{task.description}</p>
          )}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <span>
              Due: {task.dueDate ? format(task.dueDate, "PPP") : "No due date"}
            </span>
            <span>Assigned to: {task.assignedTo.name}</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="outline">{task.status}</Badge>
            {task.project && (
              <Badge variant="secondary">{task.project.name}</Badge>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
