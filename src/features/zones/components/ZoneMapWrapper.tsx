import React, { Suspense, lazy } from 'react';
import { GeoJSONPolygon } from '../types/zones.types';
import { Loader2 } from 'lucide-react';

const ZoneMapLazy = lazy(() => import('./ZoneMap'));

interface ZoneMapWrapperProps {
    value?: GeoJSONPolygon;
    onChange?: (val: GeoJSONPolygon) => void;
    mode?: 'view' | 'draw' | 'edit';
    height?: string;
}

const ZoneMapWrapper: React.FC<ZoneMapWrapperProps> = (props) => {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center bg-slate-100 rounded-md border" style={{ height: props.height || '400px' }}>
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <ZoneMapLazy {...props} />
        </Suspense>
    );
};

export default ZoneMapWrapper;
