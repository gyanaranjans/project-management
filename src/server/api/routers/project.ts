// src/server/api/routers/project.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const projectRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        members: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.create({
        data: {
          name: input.name,
          description: input.description,
          createdById: ctx.session.user.id,
          members: input.members
            ? {
                connect: input.members.map((id) => ({ id })),
              }
            : undefined,
        },
        include: {
          members: true,
          createdBy: true,
        },
      });
    }),
  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.project.findUnique({
        where: { id: input },
        include: {
          members: true,
          tasks: {
            include: {
              assignedTo: true,
              createdBy: true,
              tags: true,
            },
          },
          createdBy: true,
        },
      });

      if (!project) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return project;
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.project.findMany({
      where: {
        OR: [
          { createdById: ctx.session.user.id },
          { members: { some: { id: ctx.session.user.id } } },
        ],
      },
      include: {
        members: true,
        createdBy: true,
        tasks: {
          include: {
            assignedTo: true,
            tags: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        members: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, members, ...data } = input;

      const project = await ctx.db.project.findUnique({
        where: { id },
        select: { createdById: true },
      });

      if (!project) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (project.createdById !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return ctx.db.project.update({
        where: { id },
        data: {
          ...data,
          members: members
            ? {
                set: [],
                connect: members.map((id) => ({ id })),
              }
            : undefined,
        },
        include: {
          members: true,
          createdBy: true,
          tasks: true,
        },
      });
    }),

    delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.project.findUnique({
        where: { id: input },
        select: { createdById: true },
      });

      if (!project) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (project.createdById !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      // Delete all tasks in the project first
      await ctx.db.task.deleteMany({
        where: { projectId: input },
      });

      return ctx.db.project.delete({
        where: { id: input },
      });
    }),
});