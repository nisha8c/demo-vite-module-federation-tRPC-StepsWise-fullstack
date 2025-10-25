import { Users, TrendingUp, FootprintsIcon } from "lucide-react";

interface StatsDisplayProps {
    totalParticipants: number;
    totalSteps: number;
    totalMoney: number;
}

export const StatsDisplay = ({
                                 totalParticipants,
                                 totalSteps,
                                 totalMoney,
                             }: StatsDisplayProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
            <div className="glass-card rounded-2xl p-6 float-animation shadow-md">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 rounded-full gradient-athletic">
                        <Users className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">Participants</p>
                </div>
                <p className="text-4xl font-bold text-foreground">
                    {totalParticipants}
                </p>
            </div>

            <div
                className="glass-card rounded-2xl p-6 float-animation shadow-md"
                style={{ animationDelay: "0.1s" }}
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 rounded-full gradient-athletic">
                        <FootprintsIcon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">Total Steps</p>
                </div>
                <p className="text-4xl font-bold text-foreground">
                    {totalSteps.toLocaleString()}
                </p>
            </div>

            <div
                className="glass-card rounded-2xl p-6 glow-shadow float-animation gradient-energy shadow-md"
                style={{ animationDelay: "0.2s" }}
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 rounded-full bg-secondary-foreground/20">
                        <TrendingUp className="w-6 h-6 text-secondary-foreground" />
                    </div>
                    <p className="text-sm text-secondary-foreground/80">Total Raised</p>
                </div>
                <p className="text-4xl font-bold text-secondary-foreground">
                    {totalMoney.toFixed(2)} SEK
                </p>
            </div>
        </div>
    );
};
