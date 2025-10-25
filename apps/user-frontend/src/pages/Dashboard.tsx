import { Layout } from "../components/Layout";
import { StepCard } from "../components/StepCard";

export const Dashboard = () => {
    return (
        <Layout>
            <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-800">
                    Welcome to your Dashboard
                </h2>
                <StepCard />
            </div>
        </Layout>
    );
};
