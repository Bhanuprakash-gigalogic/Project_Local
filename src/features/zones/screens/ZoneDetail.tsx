import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetZone, useDeleteZone, useRestoreZone, useUpdateZone } from '../hooks/useZones';
import { Loader2, ArrowLeft, Edit2, Trash2, MapPin, CheckCircle2, XCircle, RotateCcw, Copy } from 'lucide-react';
import ZoneForm from '../components/ZoneForm';
import ZoneAllocationComponent from '../components/ZoneAllocationComponent';
import { UpdateZoneDTO } from '../types/zone';
import * as Dialog from '@radix-ui/react-dialog';

// Simple SVG map visualization
const StaticMap: React.FC<{ coords: number[][] }> = ({ coords }) => {
    if (coords.length < 3) return null;

    // Calculate bounds
    const lngs = coords.map(c => c[0]);
    const lats = coords.map(c => c[1]);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);

    const width = 400;
    const height = 300;
    const padding = 20;

    // Scale coordinates to SVG viewport
    const scaleX = (lng: number) =>
        ((lng - minLng) / (maxLng - minLng)) * (width - 2 * padding) + padding;
    const scaleY = (lat: number) =>
        height - (((lat - minLat) / (maxLat - minLat)) * (height - 2 * padding) + padding);

    const pathData = coords.map((coord, i) => {
        const x = scaleX(coord[0]);
        const y = scaleY(coord[1]);
        return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    }).join(' ') + ' Z';

    return (
        <svg width={width} height={height} className="border rounded-lg bg-gray-50">
            {/* Grid */}
            <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
                </pattern>
            </defs>
            <rect width={width} height={height} fill="url(#grid)" />

            {/* Polygon */}
            <path
                d={pathData}
                fill="#3b82f6"
                fillOpacity="0.2"
                stroke="#2563eb"
                strokeWidth="2"
            />

            {/* Vertices */}
            {coords.map((coord, i) => (
                <circle
                    key={i}
                    cx={scaleX(coord[0])}
                    cy={scaleY(coord[1])}
                    r="4"
                    fill="#2563eb"
                />
            ))}
        </svg>
    );
};

const ZoneDetail: React.FC = () => {
    const { zoneId } = useParams<{ zoneId: string }>();
    const navigate = useNavigate();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'details' | 'allocations'>('details');

    const { data: zone, isLoading } = useGetZone(zoneId!);
    const deleteMutation = useDeleteZone();
    const restoreMutation = useRestoreZone();
    const updateMutation = useUpdateZone();

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this zone?')) return;
        await deleteMutation.mutateAsync(zoneId!);
        navigate('/admin/zones');
    };

    const handleRestore = async () => {
        await restoreMutation.mutateAsync(zoneId!);
    };

    const handleUpdate = async (data: UpdateZoneDTO) => {
        await updateMutation.mutateAsync({ id: zoneId!, data });
        setIsEditOpen(false);
    };

    const copyCoordinates = () => {
        if (zone) {
            navigator.clipboard.writeText(JSON.stringify(zone.polygon_coords, null, 2));
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!zone) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <p className="text-gray-600">Zone not found</p>
                    <button
                        onClick={() => navigate('/admin/zones')}
                        className="mt-4 text-primary hover:underline"
                    >
                        Back to Zones
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/zones')}
                        className="p-2 hover:bg-gray-100 rounded"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{zone.name}</h1>
                        <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                            <MapPin size={14} />
                            {zone.city}{zone.state ? `, ${zone.state}` : ''}, {zone.country}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {zone.deleted_at ? (
                        <button
                            onClick={handleRestore}
                            disabled={restoreMutation.isPending}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                            {restoreMutation.isPending ? (
                                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                            ) : (
                                <RotateCcw size={16} className="-ml-1 mr-2" />
                            )}
                            Restore
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsEditOpen(true)}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                <Edit2 size={16} className="-ml-1 mr-2" />
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleteMutation.isPending}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
                            >
                                {deleteMutation.isPending ? (
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                ) : (
                                    <Trash2 size={16} className="-ml-1 mr-2" />
                                )}
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Status Badges */}
            <div className="flex gap-2">
                {zone.is_active ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <CheckCircle2 size={14} className="mr-1" />
                        Active
                    </span>
                ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        <XCircle size={14} className="mr-1" />
                        Inactive
                    </span>
                )}
                {zone.deleted_at && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        Deleted on {new Date(zone.deleted_at).toLocaleDateString()}
                    </span>
                )}
            </div>

            {/* Tabs */}
            <div className="border-b">
                <nav className="flex gap-4">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Zone Details
                    </button>
                    <button
                        onClick={() => setActiveTab('allocations')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'allocations'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Seller Allocations
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'details' ? (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Map Visualization */}
                        <div className="bg-white border rounded-lg p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Zone Boundary</h2>
                            <StaticMap coords={zone.polygon_coords} />
                            <p className="text-xs text-gray-500 mt-2">
                                Static visualization of polygon boundary
                            </p>
                        </div>

                        {/* Metadata */}
                        <div className="bg-white border rounded-lg p-6 space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900">Details</h2>

                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Zone ID</p>
                                <p className="text-sm text-gray-900 mt-1">{zone.id}</p>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Location</p>
                                <p className="text-sm text-gray-900 mt-1">
                                    {zone.city}{zone.state ? `, ${zone.state}` : ''}, {zone.country}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Coordinates</p>
                                <p className="text-sm text-gray-900 mt-1">
                                    {zone.polygon_coords.length} points
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Created</p>
                                <p className="text-sm text-gray-900 mt-1">
                                    {new Date(zone.created_at).toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Last Updated</p>
                                <p className="text-sm text-gray-900 mt-1">
                                    {new Date(zone.updated_at).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Polygon Coordinates */}
                    <div className="bg-white border rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Polygon Coordinates</h2>
                            <button
                                onClick={copyCoordinates}
                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                            >
                                <Copy size={14} className="-ml-1 mr-1.5" />
                                Copy JSON
                            </button>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                            <pre className="text-xs font-mono text-gray-800">
                                {JSON.stringify(zone.polygon_coords, null, 2)}
                            </pre>
                        </div>
                    </div>
                </>
            ) : (
                <div className="bg-white border rounded-lg p-6">
                    <ZoneAllocationComponent zoneId={zone.id} zoneName={zone.name} />
                </div>
            )}

            {/* Edit Modal */}
            <Dialog.Root open={isEditOpen} onOpenChange={setIsEditOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50">
                        <ZoneForm
                            zone={zone}
                            onSubmit={handleUpdate}
                            onCancel={() => setIsEditOpen(false)}
                            isLoading={updateMutation.isPending}
                        />
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
};

export default ZoneDetail;
