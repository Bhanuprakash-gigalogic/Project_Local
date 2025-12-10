import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateZone, useGetZone, useUpdateZone } from '../hooks/useZones';
import ZoneMap from '../components/ZoneMap';
import { GeoJSONPolygon } from '../types/zone';
import { Loader2, ArrowLeft, Save, MapPin, Trash2 } from 'lucide-react';

const zoneSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    city: z.string().min(2, 'City is required'),
    state: z.string().optional(),
    country: z.string().min(2, 'Country is required'),
    is_active: z.boolean(),
});

type ZoneFormInputs = z.infer<typeof zoneSchema>;

// Convert zone polygon_coords to GeoJSON
function coordsToGeoJSON(coords: number[][]): GeoJSONPolygon | undefined {
    if (!coords || coords.length < 3) return undefined;

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
    return ring.slice(0, ring.length - 1);
}

const ZonesMapEditor: React.FC = () => {
    const { zoneId } = useParams<{ zoneId: string }>();
    const navigate = useNavigate();
    const isEditMode = !!zoneId;

    const [polygonGeoJSON, setPolygonGeoJSON] = useState<GeoJSONPolygon | undefined>();

    // Only fetch zone data in edit mode
    const { data: zone, isLoading: isLoadingZone } = useGetZone(zoneId || '');
    const createMutation = useCreateZone();
    const updateMutation = useUpdateZone();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ZoneFormInputs>({
        resolver: zodResolver(zoneSchema),
        defaultValues: {
            name: '',
            city: '',
            state: '',
            country: '',
            is_active: true,
        },
    });

    // Load zone data for edit mode
    useEffect(() => {
        if (zone) {
            setValue('name', zone.name);
            setValue('city', zone.city);
            setValue('state', zone.state || '');
            setValue('country', zone.country);
            setValue('is_active', zone.is_active);
            setPolygonGeoJSON(coordsToGeoJSON(zone.polygon_coords));
        }
    }, [zone, setValue]);

    const handleMapChange = (geoJSON: GeoJSONPolygon) => {
        setPolygonGeoJSON(geoJSON);
    };

    const onSubmit = async (data: ZoneFormInputs) => {
        if (!polygonGeoJSON || !polygonGeoJSON.coordinates || polygonGeoJSON.coordinates.length === 0) {
            alert('Please draw a polygon on the map');
            return;
        }

        const coords = geoJSONToCoords(polygonGeoJSON);

        if (coords.length < 3) {
            alert('Polygon must have at least 3 points');
            return;
        }

        const payload = {
            name: data.name,
            city: data.city,
            state: data.state,
            country: data.country,
            polygon_coords: coords,
            is_active: data.is_active,
        };

        try {
            if (isEditMode && zoneId) {
                await updateMutation.mutateAsync({ id: zoneId, data: payload });
            } else {
                await createMutation.mutateAsync(payload);
            }
            navigate('/admin/zones');
        } catch (error) {
            console.error('Failed to save zone:', error);
        }
    };

    const hasValidPolygon = polygonGeoJSON && polygonGeoJSON.coordinates && polygonGeoJSON.coordinates.length > 0;
    const pointCount = hasValidPolygon ? geoJSONToCoords(polygonGeoJSON).length : 0;

    if (isEditMode && isLoadingZone) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/admin/zones')}
                    className="p-2 hover:bg-gray-100 rounded"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEditMode ? 'Edit Zone' : 'Create New Zone'}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {isEditMode ? 'Update zone details and boundary' : 'Draw a polygon to define the delivery zone'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Map Section */}
                <div className="bg-white border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Zone Boundary</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                {isEditMode ? 'Drag markers to adjust the polygon' : 'Click on the map to draw the zone polygon'}
                            </p>
                        </div>
                        {hasValidPolygon && (
                            <div className="text-sm text-green-600 font-medium">
                                ✓ {pointCount} points defined
                            </div>
                        )}
                    </div>

                    <ZoneMap
                        value={polygonGeoJSON}
                        onChange={handleMapChange}
                        mode={isEditMode ? 'edit' : 'draw'}
                        height="500px"
                    />
                </div>

                {/* Form Fields */}
                <div className="bg-white border rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Zone Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <div className="mt-4 flex items-center">
                        <input
                            type="checkbox"
                            id="is_active"
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            {...register('is_active')}
                        />
                        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                            Active (zone is available for deliveries)
                        </label>
                    </div>

                    {/* Manual Coordinate Input */}
                    <div className="mt-6 border-t pt-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Polygon Coordinates</h3>
                        <p className="text-xs text-gray-600 mb-3">
                            Click on the map above to add points, or enter coordinates manually below (latitude, longitude)
                        </p>

                        {polygonGeoJSON && polygonGeoJSON.coordinates && polygonGeoJSON.coordinates.length > 0 && (
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {geoJSONToCoords(polygonGeoJSON).map((coord, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-gray-500 w-16">Point {idx + 1}:</span>
                                        <input
                                            type="number"
                                            step="any"
                                            value={coord[1]}
                                            onChange={(e) => {
                                                const newCoords = geoJSONToCoords(polygonGeoJSON);
                                                newCoords[idx] = [parseFloat(e.target.value) || coord[0], coord[1]];
                                                const geoJson: GeoJSONPolygon = {
                                                    type: 'Polygon',
                                                    coordinates: [[...newCoords.map(c => [c[1], c[0]]), [newCoords[0][1], newCoords[0][0]]]]
                                                };
                                                setPolygonGeoJSON(geoJson);
                                            }}
                                            placeholder="Latitude"
                                            className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                        <input
                                            type="number"
                                            step="any"
                                            value={coord[0]}
                                            onChange={(e) => {
                                                const newCoords = geoJSONToCoords(polygonGeoJSON);
                                                newCoords[idx] = [coord[0], parseFloat(e.target.value) || coord[1]];
                                                const geoJson: GeoJSONPolygon = {
                                                    type: 'Polygon',
                                                    coordinates: [[...newCoords.map(c => [c[1], c[0]]), [newCoords[0][1], newCoords[0][0]]]]
                                                };
                                                setPolygonGeoJSON(geoJson);
                                            }}
                                            placeholder="Longitude"
                                            className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newCoords = geoJSONToCoords(polygonGeoJSON);
                                                newCoords.splice(idx, 1);
                                                if (newCoords.length < 3) {
                                                    setPolygonGeoJSON({ type: 'Polygon', coordinates: [] });
                                                } else {
                                                    const geoJson: GeoJSONPolygon = {
                                                        type: 'Polygon',
                                                        coordinates: [[...newCoords.map(c => [c[1], c[0]]), [newCoords[0][1], newCoords[0][0]]]]
                                                    };
                                                    setPolygonGeoJSON(geoJson);
                                                }
                                            }}
                                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                                            title="Remove point"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {(!polygonGeoJSON || !polygonGeoJSON.coordinates || polygonGeoJSON.coordinates.length === 0) && (
                            <p className="text-xs text-gray-500 italic">No points added yet. Click on the map to start.</p>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/zones')}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!hasValidPolygon || createMutation.isPending || updateMutation.isPending}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {(createMutation.isPending || updateMutation.isPending) && (
                            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        )}
                        <Save size={16} className="mr-2" />
                        {isEditMode ? 'Update Zone' : 'Create Zone'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ZonesMapEditor;
