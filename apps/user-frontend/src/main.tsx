import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

import {httpBatchLink} from "@trpc/client";
import App from "./App";
import {trpc} from "./lib/trpc";

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
    links: [
        httpBatchLink({
            url: "http://localhost:4000/trpc", // your backend URL
        }),
    ],
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
              <App />
          </QueryClientProvider>
      </trpc.Provider>
  </StrictMode>,
)
