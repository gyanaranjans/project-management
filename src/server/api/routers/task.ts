import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const taskRouter = createTRPCRouter({
    create: protectedProcedure
        .input(z.object({
            title: z.string().min(1),
            description: z.string().optional(),
            priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
            dueDate: z.date().optional(),
            assignedToId: z.string(),
            projectId: z.string().optional(),
            tags: z.array(z.string()).optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.task.create({
                data: {
                    title: input.title,
                    description: input.description,
                    priority: input.priority,
                    dueDate: input.dueDate,
                    assignedTo: { connect: { id: input.assignedToId } },
                    createdBy: { connect: { id: ctx.session.user.id } },
                    project: input.projectId ? { connect: { id: input.projectId } } : undefined,
                    tags: input.tags ? {
                        connect: input.tags.map(id => ({ id }))
                    } : undefined,
                },
            });
        }),

    getAll: protectedProcedure
        .query(async ({ ctx }) => {
            return ctx.db.task.findMany({
                where: {
                    OR: [
                        { assignedToId: ctx.session.user.id },
                        { createdById: ctx.session.user.id },
                    ],
                },
                include: {
                    assignedTo: true,
                    createdBy: true,
                    project: true,
                    tags: true,
                },
                orderBy: { createdAt: "desc" },
            });
        }),

    update: protectedProcedure
        .input(z.object({
            id: z.string(),
            title: z.string().optional(),
            description: z.string().optional(),
            priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
            status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
            dueDate: z.date().optional(),
            assignedToId: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const { id, assignedToId, ...data } = input;
            return ctx.db.task.update({
                where: { id },
                data: {
                    ...data,
                    assignedTo: assignedToId ? {
                        connect: { id: assignedToId }
                    } : undefined,
                },
            });
        }),
});