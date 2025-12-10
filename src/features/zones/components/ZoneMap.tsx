import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression, LeafletMouseEvent } from 'leaflet';
import { GeoJSONPolygon } from '../types/zone';
import { calculatePolygonAreaSqKm } from '../utils/geo';
import { Loader2, Trash2, Undo2, MousePointer2 } from 'lucide-react';

// Fix Leaflet Default Icon issue in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface ZoneMapProps {
    value?: GeoJSONPolygon;
    onChange?: (val: GeoJSONPolygon) => void;
    mode?: 'view' | 'draw' | 'edit';
    height?: string;
}

const DEFAULT_CENTER: LatLngExpression = [40.7128, -74.0060];
const DEFAULT_ZOOM = 13;

const ZoneMap: React.FC<ZoneMapProps> = ({
    value,
    onChange,
    mode = 'view',
    height = '400px'
}) => {
    // Internal state for coordinates: [lat, lng][] for easier Leaflet handling
    // GeoJSON is [lng, lat]
    const [coords, setCoords] = useState<[number, number][]>([]);

    useEffect(() => {
        console.log('ZoneMap value prop changed:', value);
        if (value && value.coordinates && value.coordinates.length > 0 && value.coordinates[0].length > 0) {
            // Convert GeoJSON [lng, lat] to Leaflet [lat, lng]
            const ring = value.coordinates[0];

            // Check if polygon is closed (first point === last point)
            const isClosed = ring.length > 1 &&
                ring[0][0] === ring[ring.length - 1][0] &&
                ring[0][1] === ring[ring.length - 1][1];

            // Remove closing point only if polygon is actually closed
            const pointsToConvert = isClosed ? ring.slice(0, -1) : ring;
            const leafCoords = pointsToConvert.map(p => [p[1], p[0]] as [number, number]);

            console.log('Setting coords from value:', leafCoords);
            setCoords(leafCoords);
        } else {
            console.log('Clearing coords - no valid value');
            setCoords([]);
        }
    }, [value]);

    const updateParent = (newCoords: [number, number][]) => {
        if (!onChange) return;

        // Always convert to GeoJSON, even for < 3 points
        // This allows the UI to show partial progress
        const geoJsonCoords = newCoords.map(c => [c[1], c[0]]); // [lng, lat]

        if (newCoords.length >= 3) {
            // Close the loop for valid polygons
            geoJsonCoords.push([newCoords[0][1], newCoords[0][0]]);
        }

        onChange({
            type: 'Polygon',
            coordinates: newCoords.length > 0 ? [geoJsonCoords] : []
        });
    };

    // Handlers
    const handleMapClick = (e: LeafletMouseEvent) => {
        console.log('Map clicked!', { mode, lat: e.latlng.lat, lng: e.latlng.lng });
        if (mode !== 'draw') {
            console.log('Click ignored - mode is not "draw", current mode:', mode);
            return;
        }
        const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng];
        const updated = [...coords, newPoint];
        console.log('Adding point:', newPoint, 'Total points:', updated.length);
        setCoords(updated);
        updateParent(updated);
    };

    const handleMarkerDrag = (index: number, lat: number, lng: number) => {
        const updated = [...coords];
        updated[index] = [lat, lng];
        setCoords(updated);
        updateParent(updated);
    };

    const handleUndo = () => {
        const updated = coords.slice(0, -1);
        setCoords(updated);
        updateParent(updated);
    };

    const handleClear = () => {
        setCoords([]);
        updateParent([]);
    };

    // Components
    const MapEvents = () => {
        useMapEvents({
            click: handleMapClick
        });
        return null;
    };

    // Calculated
    const area = useMemo(() => {
        if (coords.length < 3) return 0;
        // Construct temp GeoJSON
        const geoJson: GeoJSONPolygon = {
            type: 'Polygon',
            coordinates: [[...coords.map(c => [c[1], c[0]]), [coords[0][1], coords[0][0]]]]
        };
        return calculatePolygonAreaSqKm(geoJson);
    }, [coords]);

    const center = coords.length > 0 ? coords[0] : DEFAULT_CENTER;

    return (
        <div className="space-y-2">
            <div className="relative border rounded-md overflow-hidden bg-slate-100" style={{ height, isolation: 'isolate' }}>
                {mode !== 'view' && (
                    <div className="absolute top-2 right-2 z-[1000] flex flex-col gap-2">
                        <div className="bg-white/90 backdrop-blur p-2 rounded shadow text-xs font-mono">
                            Area: {area.toFixed(2)} sq km
                        </div>
                        <div className="flex gap-1 justify-end">
                            <button
                                type="button"
                                onClick={handleUndo}
                                className="p-2 bg-white rounded shadow hover:bg-slate-50 text-slate-700"
                                title="Undo last point"
                            >
                                <Undo2 size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={handleClear}
                                className="p-2 bg-white rounded shadow hover:bg-destructive/10 text-destructive"
                                title="Clear all"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {mode === 'draw' && (
                    <div className="absolute top-4 left-12 z-[1000] bg-blue-600 text-white text-xs px-3 py-1 rounded shadow-lg animate-pulse pointer-events-none">
                        Click map to add points
                    </div>
                )}

                <MapContainer
                    center={center}
                    zoom={DEFAULT_ZOOM}
                    scrollWheelZoom={true}
                    style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap'
                    />
                    <MapEvents />

                    {/* Polygon Display */}
                    {coords.length > 0 && (
                        <Polygon
                            positions={coords}
                            pathOptions={{
                                color: mode === 'view' ? '#2563eb' : '#9333ea',
                                fillColor: mode === 'view' ? '#3b82f6' : '#a855f7',
                                fillOpacity: 0.2
                            }}
                        />
                    )}

                    {/* Edit Markers */}
                    {(mode === 'edit' || mode === 'draw') && coords.map((pos, idx) => (
                        <Marker
                            key={`${idx}-${pos[0]}-${pos[1]}`}
                            position={pos}
                            draggable={mode === 'edit'}
                            title={`Point ${idx + 1}: [${pos[0].toFixed(6)}, ${pos[1].toFixed(6)}]`}
                            eventHandlers={{
                                dragend: (e) => {
                                    const marker = e.target;
                                    const { lat, lng } = marker.getLatLng();
                                    handleMarkerDrag(idx, lat, lng);
                                }
                            }}
                        />
                    ))}
                </MapContainer>
            </div>
            {mode !== 'view' && (
                <div className="space-y-2">
                    <p className="text-xs text-gray-600 text-center">
                        {mode === 'draw'
                            ? 'Click on the map to add points to the polygon.'
                            : 'Drag the markers to adjust the polygon shape.'}
                    </p>
                    {coords.length > 0 && (
                        <div className="text-xs text-gray-500 text-center">
                            {coords.length} point{coords.length !== 1 ? 's' : ''} added
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ZoneMap;
