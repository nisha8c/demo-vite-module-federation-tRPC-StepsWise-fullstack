import { useState } from "react";
import { UserPlus } from "lucide-react";
import {Button} from "user-frontend/src/components/ui/button";
import {Input} from "user-frontend/src/components/ui/input";

interface AddParticipantFormProps {
    onAdd: (name: string) => void;
}

export const AddParticipantForm = ({ onAdd }: AddParticipantFormProps) => {
    const [name, setName] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onAdd(name.trim());
            setName("");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="glass-card rounded-2xl p-6 animate-fade-in shadow-lg"
        >
            <div className="flex items-center gap-2 mb-4">
                <UserPlus className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Add Participant</h2>
            </div>

            <div className="flex gap-3">
                <Input
                    type="text"
                    placeholder="Enter participant name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 text-lg"
                />
                <Button
                    type="submit"
                    className="gradient-athletic text-primary-foreground font-semibold px-6"
                >
                    Add
                </Button>
            </div>
        </form>
    );
};
