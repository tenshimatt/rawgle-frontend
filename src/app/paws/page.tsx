'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, TrendingUp, Gift, Award } from 'lucide-react';

export default function PAWSPage() {
  return (
    <div className="min-h-screen page-gradient">
      

      <div className="container-page">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold mb-2 text-gray-900">🐾 PAWS Ecosystem</h1>
            <p className="hero-description text-xl">Earn rewards & manage tokens</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="card-feature-secondary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Coins className="h-6 w-6 icon-secondary" />
                  Your Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-sandy-brown">1,250 PAWS</div>
                <p className="text-sm text-muted mt-2">≈ $125.00 USD</p>
              </CardContent>
            </Card>

            <Card className="card-feature-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <TrendingUp className="h-6 w-6 icon-primary" />
                  This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-teal-600">+420 PAWS</div>
                <p className="text-sm text-muted mt-2">From logging & sharing</p>
              </CardContent>
            </Card>

            <Card className="card-feature-accent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Award className="h-6 w-6 icon-accent" />
                  Rank
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-burnt-sienna">Silver</div>
                <p className="text-sm text-muted mt-2">250 to Gold</p>
              </CardContent>
            </Card>
          </div>

          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Gift className="h-6 w-6 icon-accent" />
                Earn PAWS Tokens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-sandy-brown/10 rounded-lg">
                  <span className="text-gray-900">Log a meal</span>
                  <span className="font-bold text-sandy-brown">+10 PAWS</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-sandy-brown/10 rounded-lg">
                  <span className="text-gray-900">Write a review</span>
                  <span className="font-bold text-sandy-brown">+50 PAWS</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-sandy-brown/10 rounded-lg">
                  <span className="text-gray-900">Refer a friend</span>
                  <span className="font-bold text-sandy-brown">+100 PAWS</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-sandy-brown/10 rounded-lg">
                  <span className="text-gray-900">Complete health check</span>
                  <span className="font-bold text-sandy-brown">+25 PAWS</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
