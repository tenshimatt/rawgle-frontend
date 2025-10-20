'use client';

import { MainNav } from '@/components/navigation/main-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Heart, Activity, Calendar } from 'lucide-react';

export default function HealthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-pink-50">
      <MainNav />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Health & Wellness</h1>
              <p className="text-gray-600">Track symptoms, monitor progress, share with your vet</p>
            </div>
            <Button className="bg-red-500 hover:bg-red-600">
              <Plus className="h-5 w-5 mr-2" />
              Log Health Event
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Overall Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">Excellent</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-persian-green" />
                  Energy Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-persian-green">High</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  Last Checkup
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">2 weeks ago</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Health Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Health tracking data will appear here</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
