'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Scan, Loader2, Package } from 'lucide-react';

interface Product {
  barcode: string;
  name: string;
  brand: string;
  category: string;
  protein?: number;
  fat?: number;
  fiber?: number;
}

interface BarcodeScannerProps {
  onProductFound: (product: Product) => void;
}

export function BarcodeScanner({ onProductFound }: BarcodeScannerProps) {
  const [open, setOpen] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async () => {
    if (!barcode) return;

    setLoading(true);
    setError('');

    try {
      // In production, this would call a real barcode API like Open Food Facts
      const response = await fetch(`/api/barcode/${barcode}`, {
        headers: { 'x-user-id': 'demo-user' },
      });

      if (!response.ok) {
        throw new Error('Product not found');
      }

      const data = await response.json();
      onProductFound(data.product);
      setOpen(false);
      setBarcode('');
    } catch (error) {
      console.error('Error scanning barcode:', error);
      setError('Product not found. Please try manual entry.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleScan();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="btn-outline">
          <Scan className="h-4 w-4 mr-2" />
          Scan Barcode
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Scan className="h-6 w-6 icon-primary" />
            Scan Product Barcode
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Barcode Input */}
          <div className="space-y-2">
            <Label htmlFor="barcode" className="label-base">
              Barcode Number
            </Label>
            <Input
              id="barcode"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input-base text-lg font-mono"
              placeholder="Enter or scan barcode..."
              autoFocus
            />
            <p className="text-xs text-muted">
              Use a USB barcode scanner or enter the code manually
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-burnt-sienna/10 border border-burnt-sienna/30 rounded-lg">
              <p className="text-sm text-gray-900">{error}</p>
            </div>
          )}

          {/* Sample Barcodes */}
          <div className="p-4 bg-seasalt rounded-lg">
            <p className="text-sm font-semibold text-gray-900 mb-2">Try these demo barcodes:</p>
            <div className="space-y-1">
              {['123456789012', '987654321098', '555666777888'].map((code) => (
                <button
                  key={code}
                  onClick={() => setBarcode(code)}
                  className="block text-sm text-teal-600 hover:underline font-mono"
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                setBarcode('');
                setError('');
              }}
              className="flex-1 btn-outline"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleScan}
              className="flex-1 btn-primary"
              disabled={loading || !barcode}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Scan className="h-4 w-4 mr-2" />
                  Scan
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
