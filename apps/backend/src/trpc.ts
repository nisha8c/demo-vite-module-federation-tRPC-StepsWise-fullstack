import {initTRPC} from "@trpc/server";
import {z} from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();
const t = initTRPC.create();
const SECRET: string = process.env.JWT_SECRET || "supersecretkey";

// Main tRPC router
export const appRouter = t.router({
    // User registration
    register: t.procedure
        .input(
            z.object({
                name: z.string().min(1),
                email: z.string().email(),
                password: z.string().min(6),
            })
        )
        .mutation(async ({ input }) => {
            const existing = await prisma.user.findUnique({ where: { email: input.email } });
            if (existing) throw new Error("Email already registered");

            const hashed = await bcrypt.hash(input.password, 10);
            const user = await prisma.user.create({
                data: { ...input, password: hashed, role: "USER" },
            });

            return { success: true, user };
        }),

    // User login
    login: t.procedure
        .input(
            z.object({
                email: z.string().email(),
                password: z.string().min(6),
            })
        )
        .mutation(async ({ input }) => {
            const user = await prisma.user.findUnique({ where: { email: input.email } });
            if (!user) throw new Error("User not found");

            const valid = await bcrypt.compare(input.password, user.password);
            if (!valid) throw new Error("Invalid password");

            const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: "1d" });
            return { token, user };
        }),

    // Get steps for a user
    getUserSteps: t.procedure
        .input(z.object({ userId: z.string() }))
        .query(async ({ input }) => {
            const user = await prisma.user.findUnique({ where: { id: input.userId } });
            if (!user) throw new Error("User not found");
            return { steps: user.steps };
        }),

    // Update steps (for logged-in user)
    updateSteps: t.procedure
        .input(
            z.object({
                userId: z.string(),
                steps: z.number().min(0),
            })
        )
        .mutation(async ({ input }) => {
            return await prisma.user.update({
                where: {id: input.userId},
                data: {steps: input.steps},
            });
        }),

    // ------------------ SETTINGS ------------------ //
    getSettings: t.procedure.query(async () => {
        let settings = await prisma.settings.findFirst();
        if (!settings) {
            settings = await prisma.settings.create({
                data: { stepThreshold: 100, moneyPerThreshold: 10 },
            });
        }
        return settings;
    }),

    updateSettings: t.procedure
        .input(z.object({
            stepThreshold: z.number().min(1),
            moneyPerThreshold: z.number().min(0),
        }))
        .mutation(async ({ input }) => {
            let settings = await prisma.settings.findFirst();
            if (!settings) {
                settings = await prisma.settings.create({ data: input });
            } else {
                settings = await prisma.settings.update({
                    where: { id: settings.id },
                    data: input,
                });
            }
            return settings;
        }),

    // Admin: Get all users
    adminGetAllUsers: t.procedure.query(async () => {
        return await prisma.user.findMany();
    }),

    // Admin: Delete user
    adminDeleteUser: t.procedure
        .input(z.object({ userId: z.string() }))
        .mutation(async ({ input }) => {
            await prisma.user.delete({ where: { id: input.userId } });
            return { success: true };
        }),
});

// Export router type for frontend
export type AppRouter = typeof appRouter;
