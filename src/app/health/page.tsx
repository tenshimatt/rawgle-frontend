'use client';

import { MainNav } from '@/components/navigation/main-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Heart, Activity, Calendar } from 'lucide-react';

export default function HealthPage() {
  return (
    <div className="min-h-screen page-gradient">
      <MainNav />

      <div className="container-page">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="hero-title">Health & Wellness</h1>
              <p className="hero-description">Track symptoms, monitor progress, share with your vet</p>
            </div>
            <Button className="btn-accent">
              <Plus className="h-5 w-5 mr-2" />
              Log Health Event
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="card-feature-accent">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-charcoal">
                  <Heart className="h-5 w-5 icon-accent" />
                  Overall Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-persian-green">Excellent</div>
              </CardContent>
            </Card>

            <Card className="card-feature-primary">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-charcoal">
                  <Activity className="h-5 w-5 icon-primary" />
                  Energy Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-persian-green">High</div>
              </CardContent>
            </Card>

            <Card className="card-feature-secondary">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-charcoal">
                  <Calendar className="h-5 w-5 icon-secondary" />
                  Last Checkup
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-sandy-brown">2 weeks ago</div>
              </CardContent>
            </Card>
          </div>

          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="text-charcoal">Health Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted">Health tracking data will appear here</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
