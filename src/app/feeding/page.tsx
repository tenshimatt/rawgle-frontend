'use client';

import { MainNav } from '@/components/navigation/main-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { mockFeedingLogs, mockPets } from '@/lib/mock-data';

export default function FeedingPage() {
  return (
    <div className="min-h-screen page-gradient">
      <MainNav />

      <div className="container-page">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="hero-title">Smart Feeding</h1>
              <p className="hero-description">Track meals, calculate portions, and monitor digestion</p>
            </div>
            <Button className="btn-accent">
              <Plus className="h-5 w-5 mr-2" />
              Log Meal
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="card-feature-primary">
              <CardHeader>
                <CardTitle className="text-lg text-charcoal">Today's Meals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-persian-green">2/2</div>
                <p className="text-sm text-muted">All meals logged</p>
              </CardContent>
            </Card>

            <Card className="card-feature-secondary">
              <CardHeader>
                <CardTitle className="text-lg text-charcoal">Weekly Average</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-persian-green">475g</div>
                <p className="text-sm text-muted">Per meal</p>
              </CardContent>
            </Card>

            <Card className="card-feature-accent">
              <CardHeader>
                <CardTitle className="text-lg text-charcoal">Digestion Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-burnt-sienna">Excellent</div>
                <p className="text-sm text-muted">Last 7 days</p>
              </CardContent>
            </Card>
          </div>

          <h2 className="section-title">Recent Feeding Log</h2>

          <div className="space-y-4">
            {mockFeedingLogs.map((log) => {
              const pet = mockPets.find(p => p.id === log.petId);
              return (
                <Card key={log.id} className="card-glass">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-semibold text-lg text-charcoal">{pet?.name}</h3>
                          <span className="px-3 py-1 bg-sandy-brown/20 text-sandy-brown rounded-full text-sm">
                            {log.date} {log.time}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-muted">Food Type</p>
                            <p className="font-semibold text-charcoal">{log.foodType}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted">Protein Source</p>
                            <p className="font-semibold text-charcoal">{log.proteinSource}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted">Amount</p>
                            <p className="font-semibold text-charcoal">{log.amount}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted">Stool Quality</p>
                            <p className="font-semibold text-charcoal">{log.stoolQuality}</p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted">Appetite:</span>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-lg ${i < log.appetiteRating ? 'text-sandy-brown' : 'text-gray-300'}`}>★</span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted">Energy:</span>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-lg ${i < log.energyLevel ? 'text-persian-green' : 'text-gray-300'}`}>★</span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {log.digestionNotes && (
                          <div className="mt-3 p-3 bg-charcoal/5 rounded">
                            <p className="text-sm text-charcoal"><strong>Notes:</strong> {log.digestionNotes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
