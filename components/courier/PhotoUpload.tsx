'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, X, MapPin } from 'lucide-react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface PhotoUploadProps {
    photos: File[];
    onPhotosChange: (photos: File[]) => void;
    maxPhotos?: number;
}

export function PhotoUpload({ photos, onPhotosChange, maxPhotos = 5 }: PhotoUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previews, setPreviews] = useState<string[]>([]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (photos.length + files.length > maxPhotos) {
            alert(`Maximum ${maxPhotos} photos allowed`);
            return;
        }

        const newPhotos = [...photos, ...files];
        onPhotosChange(newPhotos);

        // Generate previews
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleRemovePhoto = (index: number) => {
        const newPhotos = photos.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
        onPhotosChange(newPhotos);
        setPreviews(newPreviews);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-text-main dark:text-text-main-dark">
                    Delivery Photos
                </label>
                <Badge variant="info" size="sm">
                    {photos.length}/{maxPhotos}
                </Badge>
            </div>

            {/* Photo Grid */}
            {previews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {previews.map((preview, index) => (
                        <div key={index} className="relative group">
                            <Image
                                src={preview}
                                alt={`Photo ${index + 1}`}
                                fill
                                className="object-cover rounded-lg border border-border dark:border-border-dark"
                            />
                            <button
                                onClick={() => handleRemovePhoto(index)}
                                className="absolute top-2 right-2 p-1 bg-error text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Button */}
            {photos.length < maxPhotos && (
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        capture="environment"
                    />
                    <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        leftIcon={<Camera className="w-5 h-5" />}
                        className="w-full"
                    >
                        Take Photo / Upload
                    </Button>
                </div>
            )}

            <p className="text-xs text-text-dim dark:text-text-dim-dark">
                Upload photos of the delivered package. Maximum {maxPhotos} photos.
            </p>
        </div>
    );
}
