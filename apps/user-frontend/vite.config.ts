import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
    plugins: [
        react(),
        federation({
            name: "userApp",
            filename: "remoteEntry.js",
            exposes: {
                "./Button": "./src/components/ui/button.tsx",
                "./Card": "./src/components/ui/card.tsx",
                "./index.css": "./src/index.css",
            },
            shared: ["react", "react-dom"],
        }),
    ],
    build: {
        target: "esnext",
    },
    server: {
        port: 5173,
    },
});
