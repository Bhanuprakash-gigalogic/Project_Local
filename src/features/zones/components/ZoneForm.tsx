import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, X, AlertCircle, Map as MapIcon, FileText } from 'lucide-react';
import { Zone, CreateZoneDTO, UpdateZoneDTO } from '../types/zone';
import ZoneMap from './ZoneMap';
import { GeoJSONPolygon } from '../types/zones.types';

const zoneSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    city: z.string().min(2, 'City is required'),
    state: z.string().optional(),
    country: z.string().min(2, 'Country is required'),
    is_active: z.boolean(),
});

type ZoneFormInputs = z.infer<typeof zoneSchema>;

interface ZoneFormProps {
    zone?: Zone;
    onSubmit: (data: CreateZoneDTO | UpdateZoneDTO) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

// Convert zone polygon_coords to GeoJSON
function coordsToGeoJSON(coords: number[][]): GeoJSONPolygon | undefined {
    if (!coords || coords.length < 3) return undefined;

    // Ensure polygon is closed
    const ring = [...coords];
    const first = coords[0];
    const last = coords[coords.length - 1];

    if (first[0] !== last[0] || first[1] !== last[1]) {
        ring.push([first[0], first[1]]);
    }

    return {
        type: 'Polygon',
        coordinates: [ring]
    };
}

// Convert GeoJSON to zone polygon_coords
function geoJSONToCoords(geoJSON: GeoJSONPolygon): number[][] {
    if (!geoJSON.coordinates || geoJSON.coordinates.length === 0) return [];

    const ring = geoJSON.coordinates[0];
    // Remove the closing point for storage
    return ring.slice(0, ring.length - 1);
}

const ZoneFormWithMap: React.FC<ZoneFormProps> = ({ zone, onSubmit, onCancel, isLoading }) => {
    const [inputMode, setInputMode] = useState<'map' | 'manual'>('map');
    const [polygonGeoJSON, setPolygonGeoJSON] = useState<GeoJSONPolygon | undefined>(
        zone?.polygon_coords ? coordsToGeoJSON(zone.polygon_coords) : undefined
    );
    const [manualCoords, setManualCoords] = useState<string>(
        zone?.polygon_coords ? JSON.stringify(zone.polygon_coords, null, 2) : ''
    );
    const [coordError, setCoordError] = useState<string>('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ZoneFormInputs>({
        resolver: zodResolver(zoneSchema),
        defaultValues: {
            name: zone?.name || '',
            city: zone?.city || '',
            state: zone?.state || '',
            country: zone?.country || '',
            is_active: zone?.is_active ?? true,
        },
    });

    // Sync manual input with map
    useEffect(() => {
        if (inputMode === 'manual' && polygonGeoJSON) {
            const coords = geoJSONToCoords(polygonGeoJSON);
            setManualCoords(JSON.stringify(coords, null, 2));
        }
    }, [polygonGeoJSON, inputMode]);

    const handleMapChange = (geoJSON: GeoJSONPolygon) => {
        setPolygonGeoJSON(geoJSON);
        setCoordError('');
    };

    const handleManualCoordsChange = (text: string) => {
        setManualCoords(text);

        try {
            const parsed = JSON.parse(text);
            if (Array.isArray(parsed) && parsed.length >= 3) {
                const geoJSON = coordsToGeoJSON(parsed);
                if (geoJSON) {
                    setPolygonGeoJSON(geoJSON);
                    setCoordError('');
                } else {
                    setCoordError('Invalid coordinates format');
                }
            } else {
                setCoordError('Need at least 3 coordinate pairs');
            }
        } catch (e) {
            setCoordError('Invalid JSON format');
        }
    };

    const handleFormSubmit = async (data: ZoneFormInputs) => {
        if (!polygonGeoJSON || !polygonGeoJSON.coordinates || polygonGeoJSON.coordinates.length === 0) {
            setCoordError('Please draw a polygon on the map or enter coordinates');
            return;
        }

        const coords = geoJSONToCoords(polygonGeoJSON);

        if (coords.length < 3) {
            setCoordError('Polygon must have at least 3 points');
            return;
        }

        const payload: CreateZoneDTO | UpdateZoneDTO = {
            name: data.name,
            city: data.city,
            state: data.state,
            country: data.country,
            polygon_coords: coords,
            is_active: data.is_active,
        };

        await onSubmit(payload);
    };

    const hasValidPolygon = polygonGeoJSON && polygonGeoJSON.coordinates && polygonGeoJSON.coordinates.length > 0;
    const pointCount = hasValidPolygon ? geoJSONToCoords(polygonGeoJSON).length : 0;

    return (
        <div className="bg-white rounded-lg shadow-sm max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
                <h2 className="text-lg font-semibold">
                    {zone ? 'Edit Zone' : 'Create New Zone'}
                </h2>
                <button
                    onClick={onCancel}
                    className="p-1 hover:bg-gray-100 rounded"
                >
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4 space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Zone Name *
                        </label>
                        <input
                            type="text"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.name ? 'border-red-300' : 'border-gray-300'
                                }`}
                            {...register('name')}
                            placeholder="e.g. Downtown Manhattan"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                        </label>
                        <input
                            type="text"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.city ? 'border-red-300' : 'border-gray-300'
                                }`}
                            {...register('city')}
                            placeholder="e.g. New York"
                        />
                        {errors.city && (
                            <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            State
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            {...register('state')}
                            placeholder="e.g. NY"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country *
                        </label>
                        <input
                            type="text"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${errors.country ? 'border-red-300' : 'border-gray-300'
                                }`}
                            {...register('country')}
                            placeholder="e.g. USA"
                        />
                        {errors.country && (
                            <p className="mt-1 text-xs text-red-600">{errors.country.message}</p>
                        )}
                    </div>
                </div>

                {/* Input Mode Toggle */}
                <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                            Zone Boundary *
                        </label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setInputMode('map')}
                                className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${inputMode === 'map'
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <MapIcon size={14} className="mr-1.5" />
                                Map Draw
                            </button>
                            <button
                                type="button"
                                onClick={() => setInputMode('manual')}
                                className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${inputMode === 'manual'
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <FileText size={14} className="mr-1.5" />
                                Manual Input
                            </button>
                        </div>
                    </div>

                    {/* Map Mode */}
                    {inputMode === 'map' && (
                        <div className="space-y-2">
                            <ZoneMap
                                value={polygonGeoJSON}
                                onChange={handleMapChange}
                                mode={zone ? 'edit' : 'draw'}
                                height="500px"
                            />
                            {hasValidPolygon && (
                                <p className="text-xs text-green-600">
                                    ✓ Polygon with {pointCount} points defined
                                </p>
                            )}
                        </div>
                    )}

                    {/* Manual Mode */}
                    {inputMode === 'manual' && (
                        <div className="space-y-2">
                            <textarea
                                rows={8}
                                value={manualCoords}
                                onChange={(e) => handleManualCoordsChange(e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary ${coordError ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder={`Enter coordinates as JSON array:\n[[-74.0060, 40.7128], [-74.0160, 40.7228], [-73.9960, 40.7328]]`}
                            />
                            {coordError && (
                                <p className="text-xs text-red-600 flex items-center gap-1">
                                    <AlertCircle size={12} />
                                    {coordError}
                                </p>
                            )}
                            {hasValidPolygon && !coordError && (
                                <p className="text-xs text-green-600">
                                    ✓ {pointCount} coordinates parsed
                                </p>
                            )}
                            <p className="text-xs text-gray-500">
                                Format: JSON array of [longitude, latitude] pairs
                            </p>
                        </div>
                    )}

                    {!hasValidPolygon && !coordError && (
                        <p className="text-xs text-gray-500 mt-2">
                            {inputMode === 'map'
                                ? 'Click on the map to draw the zone boundary'
                                : 'Enter at least 3 coordinate pairs'}
                        </p>
                    )}
                </div>

                {/* Active Toggle */}
                <div className="flex items-center pt-2">
                    <input
                        type="checkbox"
                        id="is_active"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        {...register('is_active')}
                    />
                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                        Active
                    </label>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading || !hasValidPolygon}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
                        {zone ? 'Update Zone' : 'Create Zone'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ZoneFormWithMap;
