import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="flex justify-between items-center p-4 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
            <h1 className="text-2xl font-bold">🏃 Marathon Tracker</h1>
            {user && (
                <div className="flex items-center gap-4">
                    <span className="text-gray-700">Hi, {user.name}</span>
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-red-500 text-white rounded-xl"
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
};
