import { NextRequest, NextResponse } from 'next/server';

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

// In-memory course storage
const courses = new Map<string, Course>();

// Initialize with comprehensive mock data
const initMockCourses = () => {
  if (courses.size === 0) {
    const mockCourses: Course[] = [
      {
        id: '1',
        title: 'Raw Feeding Fundamentals for Beginners',
        description: 'Complete beginner\'s guide to raw feeding. Learn the basics of canine nutrition, meal preparation, and safe handling practices.',
        instructor: 'Dr. Sarah Mitchell, DVM',
        instructorBio: 'Veterinarian with 15+ years experience in canine nutrition and raw feeding practices.',
        duration: '4 hours',
        lessons: 12,
        level: 'beginner',
        rating: 4.8,
        students: 2450,
        price: 0,
        thumbnail: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
        category: 'Nutrition Basics',
        isPremium: false,
        whatYouWillLearn: [
          'Understanding canine nutritional requirements',
          'Safe food handling and storage practices',
          'Creating balanced raw meals',
          'Transitioning from kibble to raw',
          'Common mistakes to avoid'
        ],
        requirements: [
          'Basic understanding of dog care',
          'Access to freezer storage',
          'Willingness to handle raw meat'
        ],
        lessonList: [
          {
            id: '1-1',
            title: 'Introduction to Raw Feeding',
            duration: '15:30',
            videoUrl: 'https://example.com/videos/raw-intro.mp4',
            description: 'Overview of raw feeding benefits and philosophy',
            order: 1,
            isPreview: true
          },
          {
            id: '1-2',
            title: 'Canine Digestive System',
            duration: '22:45',
            videoUrl: 'https://example.com/videos/digestive-system.mp4',
            description: 'Understanding how dogs digest food',
            order: 2,
            isPreview: true
          },
          {
            id: '1-3',
            title: 'Essential Nutrients',
            duration: '18:20',
            videoUrl: 'https://example.com/videos/nutrients.mp4',
            description: 'Proteins, fats, vitamins, and minerals',
            order: 3,
            isPreview: false
          }
        ]
      },
      {
        id: '2',
        title: 'Advanced Meal Planning & Balancing',
        description: 'Master the art of creating nutritionally balanced raw meals. Calculate portions, rotate proteins, and ensure optimal nutrition.',
        instructor: 'Jennifer Adams, CN',
        instructorBio: 'Certified Canine Nutritionist specializing in raw food diets for performance dogs.',
        duration: '6 hours',
        lessons: 18,
        level: 'intermediate',
        rating: 4.9,
        students: 1823,
        price: 79,
        thumbnail: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800',
        category: 'Meal Planning',
        isPremium: true,
        whatYouWillLearn: [
          'Advanced nutrient balancing techniques',
          'Protein rotation strategies',
          'Calculating precise portions',
          'Seasonal meal adjustments',
          'Supplements and when to use them'
        ],
        requirements: [
          'Completed Raw Feeding Fundamentals',
          'At least 3 months raw feeding experience',
          'Access to kitchen scale'
        ],
        lessonList: [
          {
            id: '2-1',
            title: 'Macronutrient Ratios',
            duration: '25:15',
            videoUrl: 'https://example.com/videos/macros.mp4',
            description: 'Understanding protein, fat, and carb ratios',
            order: 1,
            isPreview: true
          }
        ]
      },
      {
        id: '3',
        title: 'Puppies & Raw Feeding',
        description: 'Specialized course on raw feeding for growing puppies. Learn age-appropriate nutrition and developmental feeding.',
        instructor: 'Dr. Michael Chen, DVM',
        instructorBio: 'Veterinarian and breeder with expertise in puppy development and nutrition.',
        duration: '5 hours',
        lessons: 15,
        level: 'intermediate',
        rating: 4.7,
        students: 1456,
        price: 69,
        thumbnail: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800',
        category: 'Special Diets',
        isPremium: true,
        whatYouWillLearn: [
          'Puppy-specific nutritional needs',
          'Growth-stage feeding guidelines',
          'Calcium and phosphorus balance',
          'Weaning onto raw food',
          'Monitoring healthy development'
        ],
        requirements: [
          'Basic raw feeding knowledge',
          'Puppy under 12 months old'
        ],
        lessonList: []
      },
      {
        id: '4',
        title: 'Budget-Friendly Raw Feeding',
        description: 'Feed raw on a budget without compromising nutrition. Money-saving tips, bulk buying, and affordable options.',
        instructor: 'Maria Garcia',
        instructorBio: 'Raw feeding advocate helping families feed raw affordably for over 10 years.',
        duration: '3.5 hours',
        lessons: 11,
        level: 'beginner',
        rating: 4.7,
        students: 3200,
        price: 0,
        thumbnail: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800',
        category: 'Budget Tips',
        isPremium: false,
        whatYouWillLearn: [
          'Finding affordable protein sources',
          'Bulk buying strategies',
          'Making your own ground mix',
          'Seasonal shopping tips',
          'DIY supplements'
        ],
        requirements: [
          'Tight budget',
          'Willingness to hunt for deals'
        ],
        lessonList: []
      },
      {
        id: '5',
        title: 'Performance Dog Nutrition',
        description: 'Optimize nutrition for working, sporting, and athletic dogs. Energy requirements, recovery, and peak performance.',
        instructor: 'Robert Martinez, CN',
        instructorBio: 'Works with professional dog sports athletes and competitive handlers.',
        duration: '7 hours',
        lessons: 20,
        level: 'advanced',
        rating: 4.9,
        students: 892,
        price: 99,
        thumbnail: 'https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=800',
        category: 'Performance',
        isPremium: true,
        whatYouWillLearn: [
          'Calculating energy expenditure',
          'Pre and post-exercise nutrition',
          'Hydration strategies',
          'Recovery protocols',
          'Competition day feeding'
        ],
        requirements: [
          'Advanced raw feeding knowledge',
          'Active/working dog',
          'Understanding of canine physiology'
        ],
        lessonList: []
      }
    ];

    mockCourses.forEach(course => courses.set(course.id, course));
  }
};

export async function GET(req: NextRequest) {
  try {
    initMockCourses();

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    if (courseId) {
      const course = courses.get(courseId);
      if (!course) {
        return NextResponse.json(
          { success: false, error: 'Course not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        course
      });
    }

    return NextResponse.json({
      success: true,
      courses: Array.from(courses.values())
    });

  } catch (error) {
    console.error('Courses fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}
