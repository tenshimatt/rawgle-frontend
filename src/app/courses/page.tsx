'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Play,
  Clock,
  BookOpen,
  Star,
  Search,
  Filter,
  TrendingUp,
  Award,
  Users
} from 'lucide-react';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  lessons: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  students: number;
  price: number;
  thumbnail: string;
  category: string;
  isPremium: boolean;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === 'all' || course.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-seasalt">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Raw Feeding Education
          </h1>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl">
            Master the art of raw feeding with expert-led courses. Learn proper nutrition,
            meal planning, and feeding techniques from certified professionals.
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center space-x-2 text-teal-100">
              <BookOpen className="h-5 w-5" />
              <span>{courses.length} Courses Available</span>
            </div>
            <div className="flex items-center space-x-2 text-teal-100">
              <Users className="h-5 w-5" />
              <span>
                {courses.reduce((sum, c) => sum + c.students, 0).toLocaleString()} Students Enrolled
              </span>
            </div>
            <div className="flex items-center space-x-2 text-teal-100">
              <Award className="h-5 w-5" />
              <span>Certificate of Completion</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterLevel === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterLevel('all')}
                className={filterLevel === 'all' ? 'bg-teal-600 hover:bg-teal-700' : ''}
              >
                All Levels
              </Button>
              <Button
                variant={filterLevel === 'beginner' ? 'default' : 'outline'}
                onClick={() => setFilterLevel('beginner')}
                className={filterLevel === 'beginner' ? 'bg-teal-600 hover:bg-teal-700' : ''}
              >
                Beginner
              </Button>
              <Button
                variant={filterLevel === 'intermediate' ? 'default' : 'outline'}
                onClick={() => setFilterLevel('intermediate')}
                className={filterLevel === 'intermediate' ? 'bg-teal-600 hover:bg-teal-700' : ''}
              >
                Intermediate
              </Button>
              <Button
                variant={filterLevel === 'advanced' ? 'default' : 'outline'}
                onClick={() => setFilterLevel('advanced')}
                className={filterLevel === 'advanced' ? 'bg-teal-600 hover:bg-teal-700' : ''}
              >
                Advanced
              </Button>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Link key={course.id} href={`/courses/${course.id}`}>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer h-full">
                <div className="relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    {course.isPremium && (
                      <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">
                        Premium
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelBadgeColor(course.level)}`}>
                      {course.level}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="font-medium">{course.rating}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600">
                      {course.students.toLocaleString()} students
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      <span>{course.lessons} lessons</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600">Instructor</p>
                        <p className="font-medium text-gray-900">{course.instructor}</p>
                      </div>
                      <div className="text-right">
                        {course.price === 0 ? (
                          <span className="text-2xl font-bold text-green-600">Free</span>
                        ) : (
                          <span className="text-2xl font-bold text-teal-600">
                            ${course.price}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <Card className="p-12">
            <div className="text-center">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
