'use client';

import { useState, useEffect } from 'react';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface GPSCaptureProps {
    onLocationCapture: (coords: { latitude: number; longitude: number }) => void;
    coordinates?: { latitude: number; longitude: number };
}

export function GPSCapture({ onLocationCapture, coordinates }: GPSCaptureProps) {
    const [isCapturing, setIsCapturing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const captureLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }

        setIsCapturing(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
                onLocationCapture(coords);
                setIsCapturing(false);
            },
            (err) => {
                setError('Failed to get location. Please enable location services.');
                setIsCapturing(false);
                console.error('Geolocation error:', err);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-text-main dark:text-text-main-dark">
                GPS Location
            </label>

            {coordinates ? (
                <Card variant="default" className="p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-success mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-text-main dark:text-text-main-dark">
                                    Location Captured
                                </p>
                                <p className="text-xs text-text-dim dark:text-text-dim-dark mt-1">
                                    Lat: {coordinates.latitude.toFixed(6)}
                                </p>
                                <p className="text-xs text-text-dim dark:text-text-dim-dark">
                                    Lng: {coordinates.longitude.toFixed(6)}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={captureLocation}
                            isLoading={isCapturing}
                        >
                            Update
                        </Button>
                    </div>
                </Card>
            ) : (
                <Button
                    variant="outline"
                    onClick={captureLocation}
                    isLoading={isCapturing}
                    leftIcon={isCapturing ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
                    className="w-full"
                >
                    {isCapturing ? 'Capturing Location...' : 'Capture Current Location'}
                </Button>
            )}

            {error && (
                <div className="flex items-start gap-2 p-3 bg-error/5 dark:bg-error/10 rounded-lg border border-error/20">
                    <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-error">{error}</p>
                </div>
            )}

            <p className="text-xs text-text-dim dark:text-text-dim-dark">
                Capture your current GPS coordinates to verify delivery location.
            </p>
        </div>
    );
}
