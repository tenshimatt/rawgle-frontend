'use client';

import { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { UserLocation } from '@/types/supplier';

interface LocationControlsProps {
  userLocation: UserLocation | null;
  isLoading?: boolean;
  onFindNearby?: () => void;
  radius: number;
  onRadiusChange: (radius: number) => void;
}

export default function LocationControls({
  userLocation,
  isLoading = false,
  onFindNearby,
  radius,
  onRadiusChange,
}: LocationControlsProps) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      {/* Location display */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-teal-600 text-white p-2 rounded-full">
            <MapPin className="w-5 h-5" />
          </div>
          {userLocation ? (
            <div>
              <p className="text-sm font-medium text-gray-900-600">Your Location</p>
              <p className="text-base font-bold text-gray-900-800">
                {userLocation.city}, {userLocation.region}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium text-gray-900-600">Detecting location...</p>
              <div className="h-2 w-32 bg-seasalt-300 animate-pulse rounded mt-1"></div>
            </div>
          )}
        </div>

        {/* Find Nearby button */}
        <button
          onClick={onFindNearby}
          disabled={isLoading || !userLocation}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white
            transition-all duration-200 shadow-md hover:shadow-lg
            ${
              isLoading || !userLocation
                ? 'bg-gray-900-300 cursor-not-allowed'
                : 'bg-teal-600 hover:bg-myrtle-green active:scale-95'
            }
          `}
        >
          <Navigation className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Searching...' : 'Find Nearby'}</span>
        </button>
      </div>

      {/* Radius slider */}
      <div className="pt-4 border-t border-seasalt-300">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-900-700">
            Search Radius
          </label>
          <span className="text-lg font-bold text-teal-600">
            {radius} km
          </span>
        </div>

        <div className="relative">
          {/* Slider track */}
          <div className="relative h-2 bg-seasalt-300 rounded-full">
            {/* Filled portion */}
            <div
              className="absolute h-2 bg-teal-600 rounded-full transition-all duration-200"
              style={{ width: `${((radius - 5) / 95) * 100}%` }}
            />
          </div>

          {/* Slider input */}
          <input
            type="range"
            min="5"
            max="100"
            value={radius}
            onChange={(e) => onRadiusChange(parseInt(e.target.value))}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            className={`
              absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer
              ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
            `}
            style={{ marginTop: '0' }}
          />

          {/* Slider thumb (custom) */}
          <div
            className={`
              absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-3 border-teal-600
              rounded-full shadow-lg transition-all duration-200
              ${isDragging ? 'scale-125' : 'scale-100'}
            `}
            style={{
              left: `calc(${((radius - 5) / 95) * 100}% - 10px)`,
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Distance markers */}
        <div className="flex justify-between mt-2 px-1">
          <span className="text-xs text-gray-900-500">5 km</span>
          <span className="text-xs text-gray-900-500">25 km</span>
          <span className="text-xs text-gray-900-500">50 km</span>
          <span className="text-xs text-gray-900-500">100 km</span>
        </div>
      </div>

      {/* Quick radius buttons */}
      <div className="flex gap-2 flex-wrap">
        {[10, 25, 50, 75].map((quickRadius) => (
          <button
            key={quickRadius}
            onClick={() => onRadiusChange(quickRadius)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${
                radius === quickRadius
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-seasalt-200 text-gray-900-700 hover:bg-seasalt-300'
              }
            `}
          >
            {quickRadius}km
          </button>
        ))}
      </div>
    </div>
  );
}
