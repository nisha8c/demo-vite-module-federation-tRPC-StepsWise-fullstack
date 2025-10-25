import { useEffect, useMemo, useState } from "react";
import { Activity, LogOut } from "lucide-react";
import { trpc } from "../lib/trpc";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

import { ParticipantCard } from "../components/ParticipantCard";
import { SettingsPanel } from "../components/SettingsPanel";
import { StatsDisplay } from "../components/StatsDisplay";
import { Button } from "user-frontend/src/components/ui/button";

// ✅ Define a strong type for participants
interface Participant {
    id: string;
    name: string;
    steps: number;
}

export const Dashboard = () => {
    const { user, logout } = useAuth();

    // ✅ Settings
    const getSettings = trpc.getSettings.useQuery();
    const updateSettings = trpc.updateSettings.useMutation({
        onSuccess: () => {
            toast.success("Settings updated successfully!");
            getSettings.refetch();
        },
        onError: () => toast.error("Failed to update settings"),
    });

    const [stepThreshold, setStepThreshold] = useState<number>(100);
    const [moneyPerThreshold, setMoneyPerThreshold] = useState<number>(10);

    // ✅ Sync settings with backend
    useEffect(() => {
        if (getSettings.data) {
            setStepThreshold(getSettings.data.stepThreshold);
            setMoneyPerThreshold(getSettings.data.moneyPerThreshold);
        }
    }, [getSettings.data]);

    // ✅ Fetch all users
    const { data: allUsers, refetch } = trpc.adminGetAllUsers.useQuery();

    const deleteUser = trpc.adminDeleteUser.useMutation();
    const updateSteps = trpc.updateSteps.useMutation();

    // ✅ Ensure allUsers is correctly typed
    const participants: Participant[] =
        allUsers?.map((u: { id: string; name: string; steps: number | null }) => ({
            id: u.id,
            name: u.name,
            steps: u.steps ?? 0,
        })) ?? [];

    // ✅ Derived values
    const moneyPerStep = useMemo<number>(
        () => moneyPerThreshold / stepThreshold,
        [moneyPerThreshold, stepThreshold]
    );

    const totalStats = useMemo(() => {
        const totalSteps = participants.reduce(
            (sum: number, p: Participant) => sum + p.steps,
            0
        );
        const totalMoney = totalSteps * moneyPerStep;
        return {
            totalParticipants: participants.length,
            totalSteps,
            totalMoney,
        };
    }, [participants, moneyPerStep]);

    // ✅ Handlers
    const handleUpdateSettings = () => {
        updateSettings.mutate({
            stepThreshold,
            moneyPerThreshold,
        });
    };

    const handleDeleteUser = async (id: string) => {
        try {
            await deleteUser.mutateAsync({ userId: id });
            refetch();
            toast.success("User deleted");
        } catch {
            toast.error("Failed to delete user");
        }
    };

    const handleUpdateSteps = async (id: string, steps: number) => {
        try {
            await updateSteps.mutateAsync({ userId: id, steps });
            toast.success("Steps updated!");
            refetch();
        } catch {
            toast.error("Failed to update steps");
        }
    };

    if (getSettings.isLoading) return <p>Loading settings...</p>;

    return (
        <div className="min-h-screen py-8 px-4 md:px-8 bg-gradient-to-br from-slate-50 via-white to-slate-100">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex items-center justify-between animate-fade-in">
                    <div className="flex items-center gap-3">
                        <div className="p-4 rounded-full gradient-athletic glow-shadow">
                            <Activity className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                                Marathon Tracker
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                Admin Dashboard • Welcome {user?.name || "Admin"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </header>

                {/* Stats */}
                <StatsDisplay
                    totalParticipants={totalStats.totalParticipants}
                    totalSteps={totalStats.totalSteps}
                    totalMoney={totalStats.totalMoney}
                />

                {/* Settings */}
                <div className="space-y-4">
                    <SettingsPanel
                        stepThreshold={stepThreshold}
                        moneyPerThreshold={moneyPerThreshold}
                        onStepThresholdChange={setStepThreshold}
                        onMoneyPerThresholdChange={setMoneyPerThreshold}
                    />
                    <Button
                        onClick={handleUpdateSettings}
                        disabled={updateSettings.isPending}
                        className="w-full md:w-auto bg-blue-500 text-white hover:bg-blue-600"
                    >
                        {updateSettings.isPending ? "Saving..." : "Save Settings"}
                    </Button>
                </div>

                {/* Participants */}
                <div>
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                        <span className="w-2 h-8 gradient-athletic rounded-full"></span>
                        Participants ({participants.length})
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {participants.map((participant: Participant) => (
                            <ParticipantCard
                                key={participant.id}
                                id={participant.id}
                                name={participant.name}
                                steps={participant.steps}
                                moneyPerStep={moneyPerStep}
                                onDelete={handleDeleteUser}
                                onUpdateSteps={handleUpdateSteps}
                            />
                        ))}
                    </div>

                    {participants.length === 0 && (
                        <div className="glass-card rounded-2xl p-12 text-center">
                            <p className="text-xl text-muted-foreground">
                                No participants yet. Add your first runner above!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
