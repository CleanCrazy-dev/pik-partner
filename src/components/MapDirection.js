import React, {useMemo} from 'react';
import MapView from 'react-native-maps';
import decodePolyline from '../utils/decodePolyline';

const MapDirection = ({direction, startMarker, endMarker}) => {
    let orderPolyline = useMemo(() => {
        if(!direction?.routes)
            return null
        return decodePolyline(direction.routes[0].overview_polyline.points)
    }, [direction]);

    return !orderPolyline ? null : <>
        {!!startMarker && (
            <MapView.Marker
                coordinate={{
                    latitude: orderPolyline[0].latitude,
                    longitude: orderPolyline[0].longitude,
                }}
                anchor={{ x: 0.5, y: 0.5 }}
            >
                {startMarker}
            </MapView.Marker>
        )}
        {!!endMarker && (
            <MapView.Marker
                coordinate={{
                    latitude: orderPolyline.last().latitude,
                    longitude: orderPolyline.last().longitude,
                }}
                anchor={{ x: 0.5, y: 0.5 }}
            >
                {endMarker}
            </MapView.Marker>
        )}
        <MapView.Polyline
            coordinates={orderPolyline}
            strokeWidth={4}
            // strokeColor={COLOR_PRIMARY_600}
        />
    </>
}

export default MapDirection;
