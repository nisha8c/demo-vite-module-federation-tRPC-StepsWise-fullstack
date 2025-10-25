import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../../backend/src/trpc";

// Create typed React hooks
export const trpc = createTRPCReact<AppRouter>();

// Create a configured tRPC client instance
export const trpcClient = trpc.createClient({
    links: [
        httpBatchLink({
            url: "http://localhost:4000/trpc", // 👈 your backend tRPC endpoint
        }),
    ],
});
