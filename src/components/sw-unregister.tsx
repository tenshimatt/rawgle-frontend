'use client';

import { useEffect } from 'react';

/**
 * Unregister old PWA service workers to prevent aggressive caching issues
 * This component runs once on mount to clean up legacy service workers
 */
export function ServiceWorkerUnregister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().then((success) => {
            if (success) {
              console.log('✅ Unregistered old service worker:', registration.scope);
            }
          });
        }
      }).catch((error) => {
        console.error('Failed to unregister service workers:', error);
      });
    }
  }, []);

  return null;
}
