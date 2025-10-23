'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Supplier, UserLocation } from '@/types/supplier';

// Fix for default marker icons in Next.js
const defaultIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNSIgaGVpZ2h0PSI0MSIgdmlld0JveD0iMCAwIDI1IDQxIj48cGF0aCBmaWxsPSIjMjY0NjUzIiBkPSJNMTIuNSAwQzUuNiAwIDAgNS42IDAgMTIuNWMwIDguMyAxMi41IDI4LjUgMTIuNSAyOC41UzI1IDIwLjggMjUgMTIuNUMyNSA1LjYgMTkuNCAwIDEyLjUgMHptMCAxN2MtMi41IDAtNC41LTItNC41LTQuNXMyLTQuNSA0LjUtNC41IDQuNSAyIDQuNSA0LjUtMiA0LjUtNC41IDQuNXoiLz48L3N2Zz4=',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const userIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNSIgaGVpZ2h0PSI0MSIgdmlld0JveD0iMCAwIDI1IDQxIj48cGF0aCBmaWxsPSIjMmJhMTkzIiBkPSJNMTIuNSAwQzUuNiAwIDAgNS42IDAgMTIuNWMwIDguMyAxMi41IDI4LjUgMTIuNSAyOC41UzI1IDIwLjggMjUgMTIuNUMyNSA1LjYgMTkuNCAwIDEyLjUgMHptMCAxN2MtMi41IDAtNC41LTItNC41LTQuNXMyLTQuNSA0LjUtNC41IDQuNSAyIDQuNSA0LjUtMiA0LjUtNC41IDQuNXoiLz48L3N2Zz4=',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const supplierIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNSIgaGVpZ2h0PSI0MSIgdmlld0JveD0iMCAwIDI1IDQxIj48cGF0aCBmaWxsPSIjZWU4OTU5IiBkPSJNMTIuNSAwQzUuNiAwIDAgNS42IDAgMTIuNWMwIDguMyAxMi41IDI4LjUgMTIuNSAyOC41UzI1IDIwLjggMjUgMTIuNUMyNSA1LjYgMTkuNCAwIDEyLjUgMHptMCAxN2MtMi41IDAtNC41LTItNC41LTQuNXMyLTQuNSA0LjUtNC41IDQuNSAyIDQuNSA0LjUtMiA0LjUtNC41IDQuNXoiLz48L3N2Zz4=',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Component to handle map view updates
function MapViewController({
  suppliers,
  userLocation,
  radius
}: {
  suppliers: Supplier[];
  userLocation: UserLocation | null;
  radius: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (!userLocation) return;

    // Fit bounds to show all suppliers + user location
    const bounds = L.latLngBounds([]);
    bounds.extend([userLocation.latitude, userLocation.longitude]);

    suppliers.forEach(supplier => {
      if (supplier.latitude && supplier.longitude) {
        bounds.extend([supplier.latitude, supplier.longitude]);
      }
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [suppliers, userLocation, map]);

  return null;
}

interface SupplierMapProps {
  suppliers: Supplier[];
  userLocation: UserLocation | null;
  onSupplierClick?: (supplier: Supplier) => void;
  selectedSupplierId?: string | null;
  radius?: number; // in km
}

export default function SupplierMap({
  suppliers,
  userLocation,
  onSupplierClick,
  selectedSupplierId,
  radius = 25,
}: SupplierMapProps) {
  const [isClient, setIsClient] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  // Handle SSR - only render map on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !userLocation) {
    return (
      <div className="w-full h-full bg-seasalt-200 rounded-lg flex items-center justify-center">
        <div className="text-gray-900-600">Loading map...</div>
      </div>
    );
  }

  const center: [number, number] = [userLocation.latitude, userLocation.longitude];

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={10}
        scrollWheelZoom={true}
        className="w-full h-full"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location marker */}
        <Marker position={center} icon={userIcon}>
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-teal-600">Your Location</h3>
              <p className="text-sm text-gray-900-600">
                {userLocation.city}, {userLocation.region}
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Radius circle */}
        <Circle
          center={center}
          radius={radius * 1000} // Convert km to meters
          pathOptions={{
            fillColor: '#2ba193',
            fillOpacity: 0.1,
            color: '#2ba193',
            weight: 2,
          }}
        />

        {/* Supplier markers */}
        {suppliers.map((supplier) => {
          if (!supplier.latitude || !supplier.longitude) return null;

          const isSelected = supplier.id === selectedSupplierId;
          const icon = isSelected ?
            L.icon({
              iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSI0OSIgdmlld0JveD0iMCAwIDMwIDQ5Ij48cGF0aCBmaWxsPSIjZjRhMjYxIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTE1IDBDNi43IDAgMCA2LjcgMCAxNWMwIDEwIDE1IDM0IDE1IDM0czE1LTI0IDE1LTM0YzAtOC4zLTYuNy0xNS0xNS0xNXptMCAyMGMtMyAwLTUuNS0yLjUtNS41LTUuNXMyLjUtNS41IDUuNS01LjUgNS41IDIuNSA1LjUgNS41LTIuNSA1LjUtNS41IDUuNXoiLz48L3N2Zz4=',
              iconSize: [30, 49],
              iconAnchor: [15, 49],
              popupAnchor: [1, -40],
            })
            : supplierIcon;

          return (
            <Marker
              key={supplier.id}
              position={[supplier.latitude, supplier.longitude]}
              icon={icon}
              eventHandlers={{
                click: () => {
                  onSupplierClick?.(supplier);
                },
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-bold text-orange-500 text-lg mb-2">{supplier.name}</h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-900-700">{supplier.address}</p>
                    <p className="text-gray-900-600">
                      {supplier.city}, {supplier.state}
                    </p>
                    {supplier.distance && (
                      <p className="text-teal-600 font-semibold">
                        ~{Math.round(supplier.distance)} km away
                      </p>
                    )}
                    {supplier.phone && (
                      <p className="text-gray-900-700">
                        <span className="font-semibold">Phone:</span> {supplier.phone}
                      </p>
                    )}
                    {supplier.website && (
                      <a
                        href={supplier.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 hover:text-myrtle-green underline block"
                      >
                        Visit Website
                      </a>
                    )}
                    {supplier.rating && (
                      <p className="text-sandy-brown font-semibold">
                        Rating: {supplier.rating.toFixed(1)}/5
                        {supplier.reviews && ` (${supplier.reviews} reviews)`}
                      </p>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <MapViewController
          suppliers={suppliers}
          userLocation={userLocation}
          radius={radius}
        />
      </MapContainer>
    </div>
  );
}
