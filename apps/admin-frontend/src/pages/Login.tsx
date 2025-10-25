import { trpc } from "../lib/trpc";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const Login = () => {
    const loginMutation = trpc.login.useMutation();
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const result = await loginMutation.mutateAsync({ email, password });
            if (result.user.role !== "ADMIN") {
                setError("Access denied: Admins only");
                return;
            }
            login(result.user, result.token);
            navigate("/dashboard");
        } catch (err: any) {
            setError(err.message || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-200 via-white to-slate-50">
            <form
                onSubmit={handleLogin}
                className="max-w-md w-full mx-auto bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-8 space-y-6 border border-white/20"
            >
                <h2 className="text-3xl font-bold text-center text-gray-800">Admin Login</h2>
                <p className="text-center text-gray-500">Manage marathon participants</p>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-600 rounded-lg px-4 py-2 text-center text-sm">
                        {error}
                    </div>
                )}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md"
                    disabled={loginMutation.isPending}
                >
                    {loginMutation.isPending ? "Logging in..." : "Login"}
                </button>

                <div className="text-center text-sm text-gray-600 mt-4">
                    Need an account?{" "}
                    <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                        Register
                    </Link>
                </div>
            </form>
        </div>
    );
};
