import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../../backend/src/trpc";

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
    links: [
        httpBatchLink({
            url: "http://localhost:4000/trpc",
            headers() {
                const token = localStorage.getItem("token");
                return token ? { Authorization: `Bearer ${token}` } : {};
            },
        }),
    ],
});
