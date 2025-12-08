import React from 'react';
import { MetricCard } from '../../components/ui/MetricCard';
import { Users, DollarSign, ShoppingCart, Activity } from 'lucide-react';

const Dashboard = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Total Revenue"
                    value="$45,231.89"
                    description="+20.1% from last month"
                    trend={{ value: 20.1, isPositive: true }}
                    icon={DollarSign}
                />
                <MetricCard
                    title="Subscriptions"
                    value="+2350"
                    description="+180.1% from last month"
                    trend={{ value: 180.1, isPositive: true }}
                    icon={Users}
                />
                <MetricCard
                    title="Sales"
                    value="+12,234"
                    description="+19% from last month"
                    trend={{ value: 19, isPositive: true }}
                    icon={ShoppingCart}
                />
                <MetricCard
                    title="Active Now"
                    value="+573"
                    description="+201 since last hour"
                    trend={{ value: 201, isPositive: true }}
                    icon={Activity}
                />
            </div>
        </div>
    );
};

export default Dashboard;
