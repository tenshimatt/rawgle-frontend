"use client"

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export function ShoppingCartDialog() {
  const [open, setOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchCart();
    }
  }, [open]);

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        headers: { 'x-user-id': 'demo-user' },
      });
      const data = await response.json();
      setCartItems(data.data || []);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setLoading(true);
    try {
      await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      await fetchCart();
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    setLoading(true);
    try {
      await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: { 'x-user-id': 'demo-user' },
      });
      await fetchCart();
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setLoading(false);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-secondary relative">
          <ShoppingCart className="h-5 w-5" />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-burnt-sienna text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-charcoal">Shopping Cart</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-sandy-brown/10 rounded flex items-center justify-center">
                    <ShoppingCart className="h-8 w-8 text-sandy-brown" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-charcoal">{item.name}</h4>
                    <p className="text-lg text-persian-green font-bold">${item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="btn-ghost h-8 w-8 p-0"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={loading}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center text-charcoal font-semibold">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="btn-ghost h-8 w-8 p-0"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={loading}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="btn-ghost"
                    onClick={() => removeItem(item.id)}
                    disabled={loading}
                  >
                    <Trash2 className="h-4 w-4 text-burnt-sienna" />
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted py-8">Your cart is empty</p>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-charcoal">Total:</span>
              <span className="text-2xl font-bold text-persian-green">${total.toFixed(2)}</span>
            </div>
            <Button className="btn-primary w-full">
              Proceed to Checkout
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
