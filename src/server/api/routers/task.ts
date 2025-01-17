// src/server/api/routers/task.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
  dueDate: z.date().optional(),
  assignedToId: z.string(),
  projectId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(taskSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.create({
        data: {
          ...input,
          createdById: ctx.session.user.id,
          status: input.status ?? "TODO",
          tags: input.tags ? {
            connect: input.tags.map((id) => ({ id })),
          } : undefined,
        },
        include: {
          assignedTo: true,
          createdBy: true,
          project: true,
          tags: true,
        },
      });
    }),

  getAll: protectedProcedure
    .input(
      z.object({
        status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
        projectId: z.string().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.task.findMany({
        where: {
          OR: [
            { assignedToId: ctx.session.user.id },
            { createdById: ctx.session.user.id },
          ],
          status: input?.status,
          projectId: input?.projectId,
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
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
        status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
        dueDate: z.date().optional(),
        assignedToId: z.string().optional(),
        tags: z.array(z.string()).optional(),
         projectId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, tags, ...data } = input;

      const task = await ctx.db.task.findUnique({
        where: { id },
        select: { createdById: true },
      });

      if (!task) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (task.createdById !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return ctx.db.task.update({
        where: { id },
        data: {
          ...data,
          tags: tags
            ? {
                set: [],
                connect: tags.map((id) => ({ id })),
              }
            : undefined,
        },
        include: {
          assignedTo: true,
          createdBy: true,
          project: true,
          tags: true,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.db.task.findUnique({
        where: { id: input },
        select: { createdById: true },
      });

      if (!task) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (task.createdById !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return ctx.db.task.delete({
        where: { id: input },
      });
    }),
});