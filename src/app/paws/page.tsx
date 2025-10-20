'use client';

import { MainNav } from '@/components/navigation/main-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, TrendingUp, Gift, Award } from 'lucide-react';

export default function PAWSPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-orange-50">
      <MainNav />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold mb-2">🐾 PAWS Ecosystem</h1>
            <p className="text-gray-600 text-xl">Earn rewards & manage tokens</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-6 w-6 text-yellow-500" />
                  Your Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-yellow-600">1,250 PAWS</div>
                <p className="text-sm text-gray-600 mt-2">≈ $125.00 USD</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                  This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600">+420 PAWS</div>
                <p className="text-sm text-gray-600 mt-2">From logging & sharing</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-purple-500" />
                  Rank
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-purple-600">Silver</div>
                <p className="text-sm text-gray-600 mt-2">250 to Gold</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-6 w-6 text-orange-500" />
                Earn PAWS Tokens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span>Log a meal</span>
                  <span className="font-bold text-yellow-600">+10 PAWS</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span>Write a review</span>
                  <span className="font-bold text-yellow-600">+50 PAWS</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span>Refer a friend</span>
                  <span className="font-bold text-yellow-600">+100 PAWS</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span>Complete health check</span>
                  <span className="font-bold text-yellow-600">+25 PAWS</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
