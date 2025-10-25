import { trpc } from "../lib/trpc";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {Input} from "../components/ui/input";
import {Button} from "../components/ui/button";

export const StepCard = () => {
    const { user } = useAuth();

    const getSteps = trpc.getUserSteps.useQuery(
        { userId: user!.id },
        { enabled: !!user }
    );

    const updateSteps = trpc.updateSteps.useMutation({
        onSuccess: () => {
            toast.success("Steps updated!");
            getSteps.refetch(); // ✅ refresh latest data after update
        },
        onError: () => {
            toast.error("Failed to update steps");
        },
    });

    const [steps, setSteps] = useState(0);

    // ✅ Keep local state synced with backend data
    useEffect(() => {
        if (getSteps.data?.steps !== undefined) {
            setSteps(getSteps.data.steps);
        }
    }, [getSteps.data]);

    const handleUpdate = () => {
        updateSteps.mutate({ userId: user!.id, steps });
    };

    if (getSteps.isLoading) {
        return <div className="text-center text-gray-500">Loading your steps...</div>;
    }

    return (
        <div className="bg-white rounded-2xl shadow-md p-8 text-center space-y-4">
            <h2 className="text-2xl font-semibold">Your Steps</h2>

            <Input
                type="number"
                value={steps}
                onChange={(e) => setSteps(Number(e.target.value))}
                className="border p-3 rounded-lg w-full text-center text-xl"
            />

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
