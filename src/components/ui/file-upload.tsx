'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  label?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
  showPreview?: boolean;
}

export function FileUpload({
  value,
  onChange,
  accept = 'image/*',
  multiple = false,
  maxFiles = 5,
  maxSizeMB = 10,
  label,
  description,
  className,
  disabled = false,
  showPreview = true,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const files = multiple && Array.isArray(value) ? value : value ? [value as string] : [];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setError(null);
    setUploading(true);

    try {
      const newFiles: string[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        if (files.length + newFiles.length >= maxFiles) {
          setError(`Maximum ${maxFiles} file${maxFiles > 1 ? 's' : ''} allowed`);
          break;
        }

        const file = selectedFiles[i];

        // Check file size
        if (file.size > maxSizeMB * 1024 * 1024) {
          setError(`File size must be less than ${maxSizeMB}MB`);
          continue;
        }

        // Convert to base64 for demo (in production, upload to cloud storage like S3)
        const reader = new FileReader();
        const fileUrl = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        });

        newFiles.push(fileUrl);
      }

      if (multiple) {
        onChange([...files, ...newFiles]);
      } else {
        onChange(newFiles[0] || '');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      setError('Failed to upload files');
    } finally {
      setUploading(false);
      // Reset input
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const removeFile = (index: number) => {
    if (multiple && Array.isArray(value)) {
      const newFiles = files.filter((_, i) => i !== index);
      onChange(newFiles);
    } else {
      onChange('');
    }
  };

  const isImage = (url: string) => {
    return url.startsWith('data:image/') || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Label and File Count */}
      {(label || multiple) && (
        <div className="flex items-center justify-between">
          {label && <label className="text-sm font-medium text-gray-900">{label}</label>}
          {multiple && (
            <span className="text-xs text-gray-600">
              {files.length}/{maxFiles} file{maxFiles > 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}

      {/* Preview Grid */}
      {showPreview && files.length > 0 && (
        <div className={cn(
          'grid gap-3',
          multiple ? 'grid-cols-3' : 'grid-cols-1'
        )}>
          {files.map((file, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border-2 border-teal-600/20 bg-seasalt"
            >
              {isImage(file) ? (
                <img
                  src={file}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <File className="h-12 w-12 text-teal-600 mb-2" />
                  <span className="text-xs text-gray-600 px-2 text-center truncate w-full">
                    File {index + 1}
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={() => removeFile(index)}
                disabled={disabled}
                className="absolute top-1 right-1 p-1 bg-burnt-sienna text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {(multiple ? files.length < maxFiles : files.length === 0) && (
        <label
          className={cn(
            'flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors bg-seasalt',
            disabled
              ? 'border-gray-300 cursor-not-allowed opacity-50'
              : 'border-teal-600/30 cursor-pointer hover:border-teal-600/60'
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled || uploading}
          />
          {uploading ? (
            <>
              <Loader2 className="h-10 w-10 text-teal-600 animate-spin mb-2" />
              <p className="text-sm text-gray-600">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="h-10 w-10 text-teal-600 mb-2" />
              <p className="text-sm font-medium text-gray-900 mb-1">
                Click to upload {multiple ? 'files' : 'a file'}
              </p>
              {description ? (
                <p className="text-xs text-gray-600">{description}</p>
              ) : (
                <p className="text-xs text-gray-600">
                  {accept === 'image/*' ? 'PNG, JPG, GIF' : 'Any file type'} up to {maxSizeMB}MB
                  {multiple && ` (max ${maxFiles} files)`}
                </p>
              )}
            </>
          )}
        </label>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-burnt-sienna">{error}</p>
      )}
    </div>
  );
}
