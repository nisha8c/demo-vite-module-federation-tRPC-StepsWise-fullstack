// apps/backend/src/server.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc";

dotenv.config(); // Load .env variables

const app = express();
app.use(cors());
app.use(express.json());

// Attach tRPC router to /trpc endpoint
app.use(
    "/trpc",
    trpcExpress.createExpressMiddleware({
        router: appRouter,
    })
);

// Health check route
app.get("/", (_, res) => {
    res.send("🚀 Marathon Tracker backend is running!");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`✅ tRPC server running at http://localhost:${PORT}`);
});
