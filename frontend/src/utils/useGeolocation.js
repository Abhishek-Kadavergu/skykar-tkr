import { useState, useEffect } from 'react';

/**
 * Custom hook for geolocation
 * Automatically detects user's location with permission
 */
export const useGeolocation = (options = {}) => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const {
        enableHighAccuracy = false,
        timeout = 10000,
        maximumAge = 0,
        watch = false
    } = options;

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setLoading(false);
            return;
        }

        const onSuccess = (position) => {
            setLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: position.timestamp
            });
            setError(null);
            setLoading(false);
        };

        const onError = (error) => {
            let errorMessage = 'Unable to retrieve location';
            
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'Location permission denied';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Location information unavailable';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'Location request timed out';
                    break;
                default:
                    errorMessage = 'An unknown error occurred';
            }

            setError(errorMessage);
            setLoading(false);
        };

        const geoOptions = {
            enableHighAccuracy,
            timeout,
            maximumAge
        };

        let watchId;

        if (watch) {
            watchId = navigator.geolocation.watchPosition(onSuccess, onError, geoOptions);
        } else {
            navigator.geolocation.getCurrentPosition(onSuccess, onError, geoOptions);
        }

        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [enableHighAccuracy, timeout, maximumAge, watch]);

    const refresh = () => {
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp
                });
                setError(null);
                setLoading(false);
            },
            (error) => {
                setError(error.message);
                setLoading(false);
            },
            { enableHighAccuracy, timeout, maximumAge }
        );
    };

    return { location, error, loading, refresh };
};

/**
 * Format location for display
 */
export const formatLocation = (location) => {
    if (!location) return 'Unknown location';
    return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
};

/**
 * Calculate distance between two coordinates (in km)
 */
export const calculateDistance = (loc1, loc2) => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(loc2.lat - loc1.lat);
    const dLon = toRad(loc2.lng - loc1.lng);
    
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(toRad(loc1.lat)) * Math.cos(toRad(loc2.lat)) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance;
};

const toRad = (value) => {
    return value * Math.PI / 180;
};

/**
 * Format distance for display
 */
export const formatDistance = (distanceKm) => {
    if (distanceKm < 1) {
        return `${Math.round(distanceKm * 1000)}m`;
    }
    return `${distanceKm.toFixed(1)}km`;
};

export default useGeolocation;
