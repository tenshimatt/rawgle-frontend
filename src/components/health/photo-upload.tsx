'use client';

import { useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PhotoUploadProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
  label?: string;
}

export function PhotoUpload({ photos, onPhotosChange, maxPhotos = 5, label = 'Photos' }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const newPhotos: string[] = [];

      for (let i = 0; i < files.length; i++) {
        if (photos.length + newPhotos.length >= maxPhotos) break;

        const file = files[i];

        // Convert to base64 for demo (in production, upload to cloud storage)
        const reader = new FileReader();
        const photoUrl = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        newPhotos.push(photoUrl);
      }

      onPhotosChange([...photos, ...newPhotos]);
    } catch (error) {
      console.error('Error uploading photos:', error);
      alert('Failed to upload photos');
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="label-base">{label}</label>
        <span className="text-xs text-muted">
          {photos.length}/{maxPhotos} photos
        </span>
      </div>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {photos.map((photo, index) => (
            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-persian-green/20">
              <img
                src={photo}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-1 right-1 p-1 bg-burnt-sienna text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {photos.length < maxPhotos && (
        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-persian-green/30 rounded-lg cursor-pointer hover:border-persian-green/60 transition-colors bg-seasalt">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
          {uploading ? (
            <>
              <Loader2 className="h-10 w-10 icon-primary animate-spin mb-2" />
              <p className="text-sm text-muted">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="h-10 w-10 icon-primary mb-2" />
              <p className="text-sm font-medium text-charcoal mb-1">
                Click to upload photos
              </p>
              <p className="text-xs text-muted">
                PNG, JPG up to 10MB each
              </p>
            </>
          )}
        </label>
      )}
    </div>
  );
}
