import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

interface PlaceholderPageProps {
    title: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Coming Soon</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">This feature is under development.</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default PlaceholderPage;
