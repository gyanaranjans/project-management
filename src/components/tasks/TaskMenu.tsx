import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { api } from "@/trpc/react";

export function TaskMenu({ task }: { task: any }) {
  const utils = api.useUtils();
  const updateTask = api.task.update.useMutation({
    onSuccess: () => {
      utils.task.getAll.invalidate();
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() =>
            updateTask.mutate({
              id: task.id,
              status: "IN_PROGRESS",
            })
          }
        >
          Mark as In Progress
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            updateTask.mutate({
              id: task.id,
              status: "DONE",
            })
          }
        >
          Mark as Complete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
