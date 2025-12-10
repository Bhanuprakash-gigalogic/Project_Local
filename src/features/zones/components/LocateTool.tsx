import React, { useState } from 'react';
import { useLocateZone } from '../hooks/useZones';
import { Loader2, MapPin, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LocateTool: React.FC = () => {
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const navigate = useNavigate();

    const { mutate: locateZone, data, isPending, isError, error } = useLocateZone();

    const handleLocate = (e: React.FormEvent) => {
        e.preventDefault();

        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lng);

        if (isNaN(latNum) || isNaN(lngNum)) {
            return;
        }

        locateZone({ lat: latNum, lng: lngNum });
    };

    return (
        <div className="bg-white border rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin size={16} />
                Locate Zone by Coordinates
            </h3>

            <form onSubmit={handleLocate} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Latitude
                        </label>
                        <input
                            type="text"
                            value={lat}
                            onChange={(e) => setLat(e.target.value)}
                            placeholder="40.7128"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Longitude
                        </label>
                        <input
                            type="text"
                            value={lng}
                            onChange={(e) => setLng(e.target.value)}
                            placeholder="-74.0060"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isPending || !lat || !lng}
                    className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                            Locating...
                        </>
                    ) : (
                        <>
                            <Search size={16} className="-ml-1 mr-2" />
                            Find Zone
                        </>
                    )}
                </button>
            </form>

            {isError && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">
                        Error: {error instanceof Error ? error.message : 'Failed to locate zone'}
                    </p>
                </div>
            )}

            {data && (
                <div className="mt-3">
                    {data.zones.length === 0 ? (
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                            <p className="text-sm text-gray-600">
                                No zones found at this location
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-700">
                                Found {data.zones.length} zone(s):
                            </p>
                            {data.zones.map((zone) => (
                                <div
                                    key={zone.id}
                                    className="p-3 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 cursor-pointer transition-colors"
                                    onClick={() => navigate(`/admin/zones/${zone.id}`)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {zone.name}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {zone.city}, {zone.country}
                                            </p>
                                        </div>
                                        <span className="text-xs text-green-700 font-medium">
                                            View →
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LocateTool;
