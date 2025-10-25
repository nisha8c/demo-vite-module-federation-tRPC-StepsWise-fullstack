import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { JSX, useState, useEffect } from "react";
import { trpc, trpcClient } from "./lib/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ✅ Simple Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 200);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) return null;

    // Redirect if not logged in
    if (!user) return <Navigate to="/" replace />;

    // Optional: Only allow ADMIN role
    if (user.role !== "ADMIN") return <Navigate to="/" replace />;

    return children;
};

export default function App() {
    const queryClient = new QueryClient();

    return (
        <AuthProvider>
            <trpc.Provider client={trpcClient} queryClient={queryClient}>
                <QueryClientProvider client={queryClient}>
                    <Router>
                        <Routes>
                            <Route path="/" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Router>
                </QueryClientProvider>
            </trpc.Provider>
        </AuthProvider>
    );
}
