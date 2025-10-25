import { Navbar } from "./Navbar";

export const Layout = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
        <Navbar />
        <main className="max-w-4xl mx-auto p-6">{children}</main>
    </div>
);
