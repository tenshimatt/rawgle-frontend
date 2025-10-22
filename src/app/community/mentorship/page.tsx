'use client';

import { Users, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MentorshipPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sea-salt via-white to-sea-salt">
      <div className="bg-gradient-to-r from-persian-green to-moss-green text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Mentorship Program</h1>
          <p className="text-sea-salt text-lg">Connect with experienced raw feeders or become a mentor</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-8 shadow-md">
            <Heart className="h-12 w-12 text-persian-green mb-4" />
            <h2 className="text-2xl font-bold text-charcoal mb-4">Find a Mentor</h2>
            <p className="text-charcoal/70 mb-6">Get guidance from experienced raw feeding enthusiasts</p>
            <Button className="w-full">Browse Mentors</Button>
          </div>
          <div className="bg-white rounded-lg p-8 shadow-md">
            <Star className="h-12 w-12 text-maize mb-4" />
            <h2 className="text-2xl font-bold text-charcoal mb-4">Become a Mentor</h2>
            <p className="text-charcoal/70 mb-6">Share your knowledge and help newcomers succeed</p>
            <Button className="w-full" variant="outline">Apply to Mentor</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
