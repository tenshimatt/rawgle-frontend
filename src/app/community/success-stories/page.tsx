'use client';

import { Award } from 'lucide-react';

export default function SuccessStoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sea-salt via-white to-sea-salt">
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Success Stories</h1>
          <p className="text-sea-salt text-lg">Real transformations from our raw feeding community</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Award className="h-16 w-16 text-teal-600 mx-auto mb-4" />
          <p className="text-gray-900 text-lg">Success Stories feature coming soon!</p>
        </div>
      </div>
    </div>
  );
}
