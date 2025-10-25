import { useState } from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import {Button} from "user-frontend/src/components/ui/button";
import {Input} from "user-frontend/src/components/ui/input";


interface ParticipantCardProps {
    id: string;
    name: string;
    steps: number;
    moneyPerStep: number;
    onDelete: (id: string) => void;
    onUpdateSteps: (id: string, steps: number) => void;
}

export const ParticipantCard = ({
                                    id,
                                    name,
                                    steps,
                                    moneyPerStep,
                                    onDelete,
                                    onUpdateSteps,
                                }: ParticipantCardProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedSteps, setEditedSteps] = useState(steps.toString());
    const totalMoney = (steps * moneyPerStep).toFixed(2);

    const handleStepChange = (delta: number) => {
        const newSteps = Math.max(0, steps + delta);
        onUpdateSteps(id, newSteps);
    };

    const handleSaveSteps = () => {
        const newSteps = parseInt(editedSteps) || 0;
        onUpdateSteps(id, Math.max(0, newSteps));
        setIsEditing(false);
    };

    return (
        <div className="glass-card rounded-2xl p-6 animate-slide-up float-animation shadow-lg hover:shadow-xl transition">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">{name}</h3>
                    <p className="text-sm text-muted-foreground">Participant</p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(id)}
                    className="text-destructive hover:bg-destructive/10"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-1">Steps</p>
                        {isEditing ? (
                            <Input
                                type="number"
                                value={editedSteps}
                                onChange={(e) => setEditedSteps(e.target.value)}
                                onBlur={handleSaveSteps}
                                onKeyDown={(e) => e.key === "Enter" && handleSaveSteps()}
                                className="text-2xl font-bold h-auto py-1"
                                autoFocus
                            />
                        ) : (
                            <p
                                className="text-3xl font-bold text-primary cursor-pointer"
                                onClick={() => {
                                    setIsEditing(true);
                                    setEditedSteps(steps.toString());
                                }}
                            >
                                {steps.toLocaleString()}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleStepChange(-100)}
                            className="rounded-full"
                        >
                            <Minus className="w-4 h-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleStepChange(100)}
                            className="rounded-full"
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="gradient-athletic rounded-xl p-4 glow-shadow">
                    <p className="text-sm text-primary-foreground/80 mb-1">
                        Total Contribution
                    </p>
                    <p className="text-3xl font-bold text-primary-foreground">
                        {totalMoney} SEK
                    </p>
                </div>
            </div>
        </div>
    );
};
