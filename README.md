# demo-vite-module-federation-tRPC-StepsWise-fullstack

## StepsWise, a full-stack, micro-frontend  —
where runners log their steps and the app automatically calculates how much money they’ve raised for charity. 🏃‍♀️💰

✅ Micro Frontends powered by Vite Module Federation
✅ Each app runs independently but shares UI + logic
✅ Centralized backend for authentication and data

| Layer          | Technologies                                         |
| -------------- | ---------------------------------------------------- |
| 🖥 Frontend    | React + TypeScript + Vite + Tailwind CSS + shadcn/ui |
| 🧩 API Layer   | tRPC + Zod validation                                |
| 🗄 Backend     | Node.js + Express + Prisma ORM                       |
| 🧠 Database    | PostgreSQL (via Neon.tech)                           |
| 🔐 Auth        | JWT-based authentication                             |
| 🔔 UX Feedback | Sonner Toast Notifications                           |
| 🧰 Workspace   | npm Workspaces + Monorepo                            |
| ⚙️ Federation  | `@originjs/vite-plugin-federation`                   |


## 🧭 How It Works

👟 Participants (User App)

Register and log in securely

Add or update their total step count

Instantly see how much money they’ve raised

Mobile-first design with transparent, animated UI

🧑‍💼 Admins (Admin App)

Log in as admin and manage all participants

Add, edit, or delete users

Change the step threshold (e.g., 100 → 200 steps)

Adjust the payment rate (e.g., 10 SEK → 20 SEK per threshold)

The app instantly recalculates each participant’s total raised amount and updates totals across the dashboard 💸


## 🔄 Live Sync with tRPC

All data is fetched and updated via tRPC + Prisma

Admin updates automatically reflect on user dashboards

Smart caching + refetching ensures everything stays in sync

## 🧩 Micro Frontend Power

The User Dashboard is exposed as a remote module

The Admin App dynamically imports it using Module Federation

So updates to one app don’t require redeploying the other ⚡️

## 🌈 UI Experience

Built using shadcn/ui + Tailwind CSS

Clean glassmorphism cards, gradient glows, and subtle floating animations

Toasts for every success/error feedback

Fully responsive — mobile-first by design



