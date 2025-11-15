'use client';

import { useState, useCallback } from 'react';

interface ToastProps {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = useCallback((props: ToastProps) => {
    // Simple console log implementation
    // In production, this would integrate with a proper toast library like sonner
    if (props.variant === 'destructive') {
      console.error(`[Toast] ${props.title}${props.description ? ': ' + props.description : ''}`);
    } else {
      console.log(`[Toast] ${props.title}${props.description ? ': ' + props.description : ''}`);
    }

    // Show browser notification
    if (typeof window !== 'undefined') {
      const message = `${props.title}${props.description ? '\n' + props.description : ''}`;
      alert(message);
    }

    setToasts(prev => [...prev, props]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.slice(1));
    }, 5000);
  }, []);

  return { toast, toasts };
}
