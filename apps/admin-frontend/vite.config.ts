import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
    plugins: [
        react(),
        federation({
            name: "adminApp",
            remotes: {
                userApp: "http://localhost:5173/assets/remoteEntry.js",
            },
            shared: ["react", "react-dom"],
        }),
    ],
    build: {
        target: "esnext",
    },
    server: {
        port: 5174,
    },
});
