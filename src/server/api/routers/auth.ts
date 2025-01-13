import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";

export const authRouter = createTRPCRouter({
    signup: publicProcedure
        .input(z.object({
            email: z.string().email(),
            password: z.string().min(6),
            name: z.string().min(1),
        }))
        .mutation(async ({ ctx, input }) => {
            const exists = await ctx.db.user.findUnique({
                where: { email: input.email },
            });

            if (exists) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "User already exists",
                });
            }

            const hashedPassword = await bcrypt.hash(input.password, 10);

            return ctx.db.user.create({
                data: {
                    email: input.email,
                    password: hashedPassword,
                    name: input.name,
                },
            });
        }),
});