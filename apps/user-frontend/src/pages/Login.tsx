import { trpc } from "../lib/trpc";
import { useAuth } from "../context/AuthContext";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {Input} from "../components/ui/input";
import {Button} from "../components/ui/button";

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
            login(result.user, result.token);
            navigate("/dashboard");
        } catch (err: any) {
            setError(err.message || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50">
            <form
                onSubmit={handleLogin}
                className="max-w-md w-full mx-auto bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-8 space-y-6 border border-white/20"
            >
                <h2 className="text-3xl font-bold text-center text-gray-800">Welcome Back</h2>
                <p className="text-center text-gray-500">
                    Login to continue tracking your steps
                </p>

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

                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />

                <Button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md"
                    disabled={loginMutation.isPending}
                >
                    {loginMutation.isPending ? "Logging in..." : "Login"}
                </Button>

                <div className="text-center text-sm text-gray-600 mt-4">
                    Don’t have an account?{" "}
                    <Link
                        to="/register"
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        Register
                    </Link>
                </div>
            </form>
        </div>
    );
};
