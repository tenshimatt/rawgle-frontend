'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Play,
  Clock,
  BookOpen,
  Star,
  CheckCircle,
  Lock,
  Download,
  Share2,
  Award
} from 'lucide-react';
import { useParams } from 'next/navigation';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  description: string;
  order: number;
  isPreview: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorBio: string;
  duration: string;
  lessons: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  students: number;
  price: number;
  thumbnail: string;
  category: string;
  isPremium: boolean;
  whatYouWillLearn: string[];
  requirements: string[];
  lessonList: Lesson[];
}

export default function CourseDetailPage() {
  const params = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [params.slug]);

  const fetchCourse = async () => {
    try {
      const res = await fetch(`/api/courses?courseId=${params.slug}`);
      const data = await res.json();
      if (data.success) {
        setCourse(data.course);
        if (data.course.lessonList.length > 0) {
          setCurrentLesson(data.course.lessonList[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = () => {
    setIsEnrolled(true);
    if (course && course.lessonList.length > 0) {
      setCurrentLesson(course.lessonList[0]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-6 py-12">
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h2>
          <p className="text-gray-600">The course you're looking for doesn't exist.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-seasalt">
      {/* Video Player Section */}
      {isEnrolled && currentLesson && (
        <div className="bg-black">
          <div className="container mx-auto">
            <div className="aspect-video bg-gray-900 flex items-center justify-center">
              <div className="text-center text-white">
                <Play className="h-20 w-20 mx-auto mb-4 opacity-50" />
                <p className="text-xl font-semibold">{currentLesson.title}</p>
                <p className="text-gray-400 mt-2">{currentLesson.duration}</p>
                <p className="text-sm text-gray-600 mt-4">
                  Video player integration: {currentLesson.videoUrl}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Header */}
      {!isEnrolled && (
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-12">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-teal-100 mb-6">{course.description}</p>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{course.rating}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>{course.lessons} lessons</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>{course.level}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {course.price === 0 ? (
                  <Button
                    onClick={handleEnroll}
                    size="lg"
                    className="bg-white text-teal-600 hover:bg-gray-100"
                  >
                    Enroll for Free
                  </Button>
                ) : (
                  <Button
                    onClick={handleEnroll}
                    size="lg"
                    className="bg-white text-teal-600 hover:bg-gray-100"
                  >
                    Enroll Now - ${course.price}
                  </Button>
                )}
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-teal-800">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What You'll Learn</h2>
              <ul className="space-y-3">
                {course.whatYouWillLearn.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Course Content */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Content</h2>
              <div className="space-y-2">
                {course.lessonList.length > 0 ? (
                  course.lessonList.map((lesson, index) => (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        if (isEnrolled || lesson.isPreview) {
                          setCurrentLesson(lesson);
                        }
                      }}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        currentLesson?.id === lesson.id
                          ? 'border-teal-600 bg-teal-50'
                          : 'border-gray-200 hover:border-teal-300'
                      } ${!isEnrolled && !lesson.isPreview ? 'opacity-60' : ''}`}
                      disabled={!isEnrolled && !lesson.isPreview}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {!isEnrolled && !lesson.isPreview ? (
                            <Lock className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Play className="h-5 w-5 text-teal-600" />
                          )}
                          <div>
                            <p className="font-medium text-gray-900">
                              {index + 1}. {lesson.title}
                            </p>
                            <p className="text-sm text-gray-600">{lesson.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {lesson.isPreview && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Preview
                            </span>
                          )}
                          <span className="text-sm text-gray-600">{lesson.duration}</span>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-8">
                    Lesson content will be available soon
                  </p>
                )}
              </div>
            </Card>

            {/* Requirements */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
              <ul className="space-y-2">
                {course.requirements.map((req, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Instructor */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Instructor</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <span className="text-teal-600 font-bold text-lg">
                      {course.instructor.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{course.instructor}</p>
                    <p className="text-sm text-gray-600">{course.category} Expert</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{course.instructorBio}</p>
              </div>
            </Card>

            {/* Course Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Course Details</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Students Enrolled</span>
                  <span className="font-medium text-gray-900">
                    {course.students.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Level</span>
                  <span className="font-medium text-gray-900 capitalize">{course.level}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium text-gray-900">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Lessons</span>
                  <span className="font-medium text-gray-900">{course.lessons}</span>
                </div>
                {course.isPremium && (
                  <div className="pt-3 border-t">
                    <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                      <Award className="h-4 w-4 mr-1" />
                      Premium Course
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* Share */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Share This Course</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
