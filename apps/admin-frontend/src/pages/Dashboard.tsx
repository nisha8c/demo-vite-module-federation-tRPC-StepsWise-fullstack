import { useEffect, useMemo, useState } from "react";
import { Activity, LogOut } from "lucide-react";
import { trpc } from "../lib/trpc";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

import { ParticipantCard } from "../components/ParticipantCard";
import { SettingsPanel } from "../components/SettingsPanel";
import { StatsDisplay } from "../components/StatsDisplay";
import { AddParticipantForm } from "../components/AddParticipantForm";

interface Participant {
    id: string;
    name: string;
    steps: number;
}

export const Dashboard = () => {
    const { user, logout } = useAuth();

    // Admin Settings
    const [stepThreshold, setStepThreshold] = useState(100);
    const [moneyPerThreshold, setMoneyPerThreshold] = useState(10);

    // Participants
    const [participants, setParticipants] = useState<Participant[]>([]);
    const { data: allUsers, refetch } = trpc.adminGetAllUsers.useQuery();

    // Derived values
    const moneyPerStep = useMemo(
        () => moneyPerThreshold / stepThreshold,
        [moneyPerThreshold, stepThreshold]
    );

    const totalStats = useMemo(() => {
        const totalSteps = participants.reduce((sum, p) => sum + p.steps, 0);
        const totalMoney = totalSteps * moneyPerStep;
        return {
            totalParticipants: participants.length,
            totalSteps,
            totalMoney,
        };
    }, [participants, moneyPerStep]);

    // Mutations
    const deleteUser = trpc.adminDeleteUser.useMutation();

    // Load participants (admin fetches all users)
    useEffect(() => {
        if (allUsers) {
            const formatted = allUsers.map((u) => ({
                id: u.id,
                name: u.name,
                steps: u.steps ?? 0,
            }));
            setParticipants(formatted);
        }
    }, [allUsers]);

    // Handlers
    const handleAddParticipant = (name: string) => {
        const newParticipant: Participant = {
            id: Date.now().toString(),
            name,
            steps: 0,
        };
        setParticipants([...participants, newParticipant]);
    };

    const handleDeleteParticipant = async (id: string) => {
        try {
            await deleteUser.mutateAsync({ userId: id });
            refetch();
        } catch (err) {
            console.error("Failed to delete user:", err);
        }
    };

    const updateStepsMutation = trpc.updateSteps.useMutation();
    const handleUpdateSteps = async (id: string, steps: number) => {
        try {
            // Update on server
            await updateStepsMutation.mutateAsync({ userId: id, steps });
            toast.success("Steps updated successfully!");
            // Refresh users from backend
            refetch();
        } catch (err) {
            console.error("Failed to update steps:", err);
            toast.error("Failed to update steps.");
        }
    };

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

                <SettingsPanel
                    stepThreshold={stepThreshold}
                    moneyPerThreshold={moneyPerThreshold}
                    onStepThresholdChange={setStepThreshold}
                    onMoneyPerThresholdChange={setMoneyPerThreshold}
                />

                {/* Settings and Add Participant
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SettingsPanel
                        stepThreshold={stepThreshold}
                        moneyPerThreshold={moneyPerThreshold}
                        onStepThresholdChange={setStepThreshold}
                        onMoneyPerThresholdChange={setMoneyPerThreshold}
                    />
                    <AddParticipantForm onAdd={handleAddParticipant} />
                </div>
                 */}

                {/* Participants */}
                <div>
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                        <span className="w-2 h-8 gradient-athletic rounded-full"></span>
                        Participants ({participants.length})
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {participants.map((participant) => (
                            <ParticipantCard
                                key={participant.id}
                                id={participant.id}
                                name={participant.name}
                                steps={participant.steps}
                                moneyPerStep={moneyPerStep}
                                onDelete={handleDeleteParticipant}
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
