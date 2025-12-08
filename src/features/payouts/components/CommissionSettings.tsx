import React, { useState, useEffect } from 'react';
import { useGetCommissionSettings, useUpdateCommissionSettings } from '../hooks/usePayouts';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/hooks/useToast';
import { Save, Plus, Trash2 } from 'lucide-react';

export const CommissionSettings = () => {
    const { data: settings, isLoading } = useGetCommissionSettings();
    const { mutate: updateSettings, isPending } = useUpdateCommissionSettings();
    const { addToast } = useToast();

    const [defaultRate, setDefaultRate] = useState<number>(0);
    const [allowVendorSpecific, setAllowVendorSpecific] = useState(false);
    const [vendorRates, setVendorRates] = useState<{ vendorId: string, vendorName: string, rate: number }[]>([]);

    // New rate inputs
    const [newVendorName, setNewVendorName] = useState('');
    const [newVendorRate, setNewVendorRate] = useState('');

    useEffect(() => {
        if (settings) {
            setDefaultRate(settings.defaultRate);
            setAllowVendorSpecific(settings.allowVendorSpecific);
            setVendorRates(settings.vendorRates);
        }
    }, [settings]);

    const handleSave = () => {
        updateSettings({
            defaultRate,
            allowVendorSpecific,
            vendorRates
        }, {
            onSuccess: () => {
                addToast({ title: "Settings Saved", description: "Commission rates updated successfully.", type: "success" });
            }
        });
    };

    const handleAddVendorRate = () => {
        if (!newVendorName || !newVendorRate) return;
        const rate = parseFloat(newVendorRate);
        if (isNaN(rate)) return;

        setVendorRates([...vendorRates, {
            vendorId: `custom-${Date.now()}`,
            vendorName: newVendorName,
            rate
        }]);
        setNewVendorName('');
        setNewVendorRate('');
    };

    const handleRemoveVendorRate = (id: string) => {
        setVendorRates(vendorRates.filter(v => v.vendorId !== id));
    };

    if (isLoading) return <Skeleton className="h-[400px] w-full" />;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
            <Card>
                <CardHeader>
                    <CardTitle>Global Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Default Commission Rate (%)</label>
                            <Input
                                type="number"
                                value={defaultRate}
                                onChange={(e) => setDefaultRate(parseFloat(e.target.value) || 0)}
                                placeholder="10"
                            />
                            <p className="text-xs text-muted-foreground">Applied to all vendors by default.</p>
                        </div>
                        <div className="space-y-2 flex flex-col justify-end">
                            <div className="flex items-center gap-2 border p-3 rounded-md">
                                <Toggle checked={allowVendorSpecific} onCheckedChange={setAllowVendorSpecific} />
                                <div className="flex flex-col">
                                    <span className="font-medium text-sm">Allow Vendor Overrides</span>
                                    <span className="text-xs text-muted-foreground">Enable specific rates for varying vendors.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {allowVendorSpecific && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Vendor Overrides</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4 items-end">
                            <div className="flex-1 space-y-1">
                                <label className="text-xs font-medium">Vendor Name</label>
                                <Input
                                    placeholder="Enter vendor name..."
                                    value={newVendorName}
                                    onChange={(e) => setNewVendorName(e.target.value)}
                                />
                            </div>
                            <div className="w-[120px] space-y-1">
                                <label className="text-xs font-medium">Rate (%)</label>
                                <Input
                                    type="number"
                                    placeholder="%"
                                    value={newVendorRate}
                                    onChange={(e) => setNewVendorRate(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" onClick={handleAddVendorRate}>
                                <Plus size={16} className="mr-2" /> Add
                            </Button>
                        </div>

                        <div className="border rounded-md overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Vendor</TableHead>
                                        <TableHead>Custom Rate</TableHead>
                                        <TableHead className="w-[100px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {vendorRates.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                                                No overrides configured.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        vendorRates.map((v) => (
                                            <TableRow key={v.vendorId}>
                                                <TableCell>{v.vendorName}</TableCell>
                                                <TableCell>{v.rate}%</TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                                        onClick={() => handleRemoveVendorRate(v.vendorId)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="flex justify-end">
                <Button onClick={handleSave} isLoading={isPending} className="w-full md:w-auto">
                    <Save size={16} className="mr-2" /> Save Changes
                </Button>
            </div>
        </div>
    );
};
