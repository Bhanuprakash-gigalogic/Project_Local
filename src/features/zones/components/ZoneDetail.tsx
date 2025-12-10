import React from 'react';
import { Zone } from '../types/zones.types';
import ZoneMap from './ZoneMapWrapper';
import { Copy, Download, MapPin, X } from 'lucide-react';
import { calculatePolygonAreaSqKm } from '../utils/geo';

interface ZoneDetailProps {
    zone: Zone;
    onClose: () => void;
}

const ZoneDetail: React.FC<ZoneDetailProps> = ({ zone, onClose }) => {
    const area = calculatePolygonAreaSqKm(zone.polygon).toFixed(2);

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(zone.polygon.coordinates, null, 2));
        // In a real app, use toast here
        alert('Coordinates copied to clipboard!');
    };

    const handleDownload = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(zone.polygon, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${zone.code}_polygon.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
                <div>
                    <h2 className="text-xl font-bold tracking-tight">{zone.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                            {zone.code}
                        </span>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${zone.status === 'active'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-gray-50 text-gray-700 border-gray-200'
                            }`}>
                            {zone.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border bg-card">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <MapPin className="w-4 h-4" />
                            Area Size
                        </div>
                        <div className="text-2xl font-bold">{area} <span className="text-sm font-normal text-muted-foreground">km²</span></div>
                    </div>
                    <div className="p-4 rounded-lg border bg-card">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <MapPin className="w-4 h-4" />
                            Stores
                        </div>
                        <div className="text-2xl font-bold">{zone.storeCount}</div>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <h3 className="text-sm font-medium text-foreground mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {zone.description || 'No description provided.'}
                    </p>
                </div>

                {/* Map Preview */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-foreground">Geographic Boundary</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={handleCopy}
                                className="inline-flex items-center text-xs font-medium text-primary hover:underline"
                            >
                                <Copy className="w-3 h-3 mr-1" />
                                Copy Coords
                            </button>
                            <button
                                onClick={handleDownload}
                                className="inline-flex items-center text-xs font-medium text-primary hover:underline"
                            >
                                <Download className="w-3 h-3 mr-1" />
                                Export JSON
                            </button>
                        </div>
                    </div>
                    <div className="border rounded-lg overflow-hidden relative">
                        <ZoneMap value={zone.polygon} mode="view" height="300px" />
                    </div>
                </div>

                {/* Metadata */}
                <div className="pt-6 border-t grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                    <div>
                        <span className="block font-medium text-foreground">Created</span>
                        {new Date(zone.createdAt).toLocaleString()}
                    </div>
                    <div>
                        <span className="block font-medium text-foreground">Last Updated</span>
                        {new Date(zone.updatedAt).toLocaleString()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ZoneDetail;
