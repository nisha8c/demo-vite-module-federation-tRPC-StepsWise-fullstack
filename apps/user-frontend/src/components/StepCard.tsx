import { useEffect, useMemo, useState } from "react";
import { trpc } from "../lib/trpc";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export const StepCard = () => {
    const { user } = useAuth();

    // ✅ Fetch user's current steps
    const getSteps = trpc.getUserSteps.useQuery(
        { userId: user!.id },
        { enabled: !!user }
    );

    // ✅ Fetch global settings (stepThreshold + moneyPerThreshold)
    const getSettings = trpc.getSettings.useQuery();

    // ✅ Mutation to update user's steps
    const updateSteps = trpc.updateSteps.useMutation({
        onSuccess: () => {
            toast.success("Steps updated!");
            getSteps.refetch(); // refresh latest data after update
        },
        onError: () => {
            toast.error("Failed to update steps");
        },
    });

    // ✅ Local state for steps
    const [steps, setSteps] = useState(0);

    // ✅ Keep local state synced with backend data
    useEffect(() => {
        if (getSteps.data?.steps !== undefined) {
            setSteps(getSteps.data.steps);
        }
    }, [getSteps.data]);

    // ✅ Compute money raised based on admin settings
    const totalMoney = useMemo(() => {
        if (!getSettings.data) return 0;
        const { stepThreshold, moneyPerThreshold } = getSettings.data;
        if (stepThreshold <= 0) return 0;
        return (steps / stepThreshold) * moneyPerThreshold;
    }, [steps, getSettings.data]);

    const handleUpdate = () => {
        updateSteps.mutate({ userId: user!.id, steps });
    };

    if (getSteps.isLoading || getSettings.isLoading) {
        return (
            <div className="text-center text-gray-500">
                Loading your progress...
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-md p-8 text-center space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">
                Your Steps
            </h2>

            {/* Steps Input */}
            <Input
                type="number"
                value={steps}
                onChange={(e) => setSteps(Number(e.target.value))}
                className="border p-3 rounded-lg w-full text-center text-xl"
            />

            {/* Money Raised */}
            <div className="bg-blue-50 rounded-xl py-4 mt-2">
                <p className="text-gray-500 text-sm">Total Raised</p>
                <p className="text-3xl font-bold text-blue-600">
                    {totalMoney.toFixed(2)} SEK
                </p>
            </div>

            {/* Update Button */}
            <Button
                onClick={handleUpdate}
                disabled={updateSteps.isPending}
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            >
                {updateSteps.isPending ? "Updating..." : "Update Steps"}
            </Button>
        </div>
    );
};
