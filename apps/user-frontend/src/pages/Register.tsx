import { trpc } from "../lib/trpc";
import { useState } from "react";

export const Register = () => {
    const registerMutation = trpc.register.useMutation();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        await registerMutation.mutateAsync({ name, email, password });
        alert("Registered successfully! Please log in.");
        window.location.href = "/";
    };

    return (
        <form
            onSubmit={handleRegister}
            className="max-w-md mx-auto mt-24 bg-white rounded-2xl shadow p-8 space-y-6"
        >
            <h2 className="text-2xl font-bold text-center">Register</h2>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-3 rounded-lg w-full"
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-3 rounded-lg w-full"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-3 rounded-lg w-full"
            />
            <button
                type="submit"
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition"
            >
                Register
            </button>
        </form>
    );
};
