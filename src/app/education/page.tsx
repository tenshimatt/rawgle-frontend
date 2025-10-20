'use client';

import { MainNav } from '@/components/navigation/main-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Video, FileText, Award } from 'lucide-react';

export default function EducationPage() {
  const guides = [
    { title: 'Getting Started with Raw Feeding', type: 'Guide', icon: BookOpen },
    { title: 'Safe Food Handling Practices', type: 'Video', icon: Video },
    { title: 'Nutrition 101: BARF Diet Basics', type: 'Article', icon: FileText },
    { title: 'Transitioning Your Pet to Raw', type: 'Course', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50">
      <MainNav />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Education & Learning</h1>
            <p className="text-gray-600">Guides, tutorials, and expert advice on raw pet nutrition</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guides.map((guide, idx) => {
              const Icon = guide.icon;
              return (
                <Card key={idx} className="hover:shadow-xl transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-persian-green" />
                      </div>
                      <div>
                        <span className="text-sm text-persian-green font-semibold">{guide.type}</span>
                        <CardTitle className="text-lg">{guide.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">
                      Learn essential information about raw pet nutrition and best practices.
                    </p>
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
