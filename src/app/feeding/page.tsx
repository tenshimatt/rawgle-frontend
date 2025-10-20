'use client';

import { MainNav } from '@/components/navigation/main-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { mockFeedingLogs, mockPets } from '@/lib/mock-data';

export default function FeedingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-blue-50">
      <MainNav />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Smart Feeding</h1>
              <p className="text-gray-600">Track meals, calculate portions, and monitor digestion</p>
            </div>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Plus className="h-5 w-5 mr-2" />
              Log Meal
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today's Meals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600">2/2</div>
                <p className="text-sm text-gray-600">All meals logged</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Weekly Average</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-persian-green">475g</div>
                <p className="text-sm text-gray-600">Per meal</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Digestion Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-purple-600">Excellent</div>
                <p className="text-sm text-gray-600">Last 7 days</p>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-2xl font-bold mb-4">Recent Feeding Log</h2>

          <div className="space-y-4">
            {mockFeedingLogs.map((log) => {
              const pet = mockPets.find(p => p.id === log.petId);
              return (
                <Card key={log.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-semibold text-lg">{pet?.name}</h3>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            {log.date} {log.time}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Food Type</p>
                            <p className="font-semibold">{log.foodType}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Protein Source</p>
                            <p className="font-semibold">{log.proteinSource}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Amount</p>
                            <p className="font-semibold">{log.amount}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Stool Quality</p>
                            <p className="font-semibold">{log.stoolQuality}</p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Appetite:</span>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-lg ${i < log.appetiteRating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Energy:</span>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-lg ${i < log.energyLevel ? 'text-green-400' : 'text-gray-300'}`}>★</span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {log.digestionNotes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded">
                            <p className="text-sm text-gray-700"><strong>Notes:</strong> {log.digestionNotes}</p>
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
