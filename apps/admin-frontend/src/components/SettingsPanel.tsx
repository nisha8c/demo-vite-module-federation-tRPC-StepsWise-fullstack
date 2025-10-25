import { Settings } from "lucide-react";
import { Input } from "user-frontend/src/components/ui/input";
import { Label } from "user-frontend/src/components/ui/label";

interface SettingsPanelProps {
    stepThreshold: number;
    moneyPerThreshold: number;
    onStepThresholdChange: (value: number) => void;
    onMoneyPerThresholdChange: (value: number) => void;
}

export const SettingsPanel = ({
                                  stepThreshold,
                                  moneyPerThreshold,
                                  onStepThresholdChange,
                                  onMoneyPerThresholdChange,
                              }: SettingsPanelProps) => {
    return (
        <div className="glass-card rounded-2xl p-6 animate-fade-in shadow-lg">
            <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Settings</h2>
            </div>

            <div className="space-y-4">
                <div>
                    <Label
                        htmlFor="stepThreshold"
                        className="text-sm text-muted-foreground mb-2 block"
                    >
                        Steps per Payment Cycle
                    </Label>
                    <Input
                        id="stepThreshold"
                        type="number"
                        value={stepThreshold}
                        onChange={(e) =>
                            onStepThresholdChange(parseInt(e.target.value) || 100)
                        }
                        className="text-lg font-semibold"
                        min="1"
                    />
                </div>

                <div>
                    <Label
                        htmlFor="moneyPerThreshold"
                        className="text-sm text-muted-foreground mb-2 block"
                    >
                        Payment per Cycle (SEK)
                    </Label>
                    <Input
                        id="moneyPerThreshold"
                        type="number"
                        value={moneyPerThreshold}
                        onChange={(e) =>
                            onMoneyPerThresholdChange(parseFloat(e.target.value) || 10)
                        }
                        className="text-lg font-semibold"
                        min="0"
                        step="0.01"
                    />
                </div>

                <div className="gradient-energy rounded-xl p-4 mt-4">
                    <p className="text-sm text-secondary-foreground/80">
                        Current Rate
                    </p>
                    <p className="text-xl font-bold text-secondary-foreground">
                        {moneyPerThreshold} SEK per {stepThreshold} steps
                    </p>
                </div>
            </div>
        </div>
    );
};
