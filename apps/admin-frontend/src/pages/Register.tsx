import { trpc } from "../lib/trpc";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Register = () => {
    const registerMutation = trpc.register.useMutation();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await registerMutation.mutateAsync({ name, email, password });
            alert("Admin registered successfully! You can now login.");
            navigate("/");
        } catch (err: any) {
            setError(err.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-200 via-white to-slate-50">
            <form
                onSubmit={handleRegister}
                className="max-w-md w-full mx-auto bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-8 space-y-6 border border-white/20"
            >
                <h2 className="text-3xl font-bold text-center text-gray-800">Admin Register</h2>
                <p className="text-center text-gray-500">Create your admin account</p>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-600 rounded-lg px-4 py-2 text-center text-sm">
                        {error}
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />

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
                    disabled={registerMutation.isPending}
                >
                    {registerMutation.isPending ? "Registering..." : "Register"}
                </button>

                <div className="text-center text-sm text-gray-600 mt-4">
                    Already have an account?{" "}
                    <Link to="/" className="text-blue-600 font-semibold hover:underline">
                        Login
                    </Link>
                </div>
            </form>
        </div>
    );
};
