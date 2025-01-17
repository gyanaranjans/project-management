import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { ProjectForm } from "./ProjectForm";

export function ProjectActions({ project }: { project: any }) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const router = useRouter();
  const utils = api.useUtils();

  const updateProject = api.project.update.useMutation({
    onSuccess: () => {
      utils.project.getAll.invalidate();
      utils.project.getById.invalidate(project.id);
      setEditModalOpen(false);
    },
  });

  const deleteProject = api.project.delete.useMutation({
    onSuccess: () => {
      utils.project.getAll.invalidate();
      router.push("/projects");
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditModalOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Project
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => {
              if (confirm("Are you sure you want to delete this project?")) {
                deleteProject.mutate(project.id);
              }
            }}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <ProjectForm
            defaultValues={{
              name: project.name,
              description: project.description ?? "",
              members: project.members?.map((m: any) => m.id) ?? [],
            }}
            onSubmit={(data) => {
              updateProject.mutate({
                id: project.id,
                ...data,
              });
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
