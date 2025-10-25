'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Heart,
  MessageCircle,
  ArrowLeft,
  MapPin,
  Calendar,
  Check,
  TrendingDown,
  Sparkles,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SuccessStory {
  id: string;
  petName: string;
  petType: 'dog' | 'cat' | 'other';
  breed: string;
  age: number;
  ownerName: string;
  location: string;
  transformationType: string;
  timeframe: string;
  beforePhoto: string;
  afterPhoto: string;
  storyText: string;
  healthImprovements: string[];
  weightBefore?: number;
  weightAfter?: number;
  vetApproved: boolean;
  dateSubmitted: string;
  likes: number;
  comments: number;
}

export default function StoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [story, setStory] = useState<SuccessStory | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [showBefore, setShowBefore] = useState(true);
  const [sliderPosition, setSliderPosition] = useState(50);

  useEffect(() => {
    fetchStory();
  }, [params.storyId]);

  const fetchStory = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/success-stories');
      const data = await response.json();
      const foundStory = data.data?.find((s: SuccessStory) => s.id === params.storyId);
      if (foundStory) {
        setStory(foundStory);
      }
    } catch (error) {
      console.error('Error fetching story:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeframeLabel = (timeframe: string) => {
    const labels: Record<string, string> = {
      '1-month': '1 Month',
      '3-months': '3 Months',
      '6-months': '6 Months',
      '1-year': '1 Year',
      '2-years+': '2+ Years',
    };
    return labels[timeframe] || timeframe;
  };

  const getTransformationLabel = (type: string) => {
    const labels: Record<string, string> = {
      'weight-loss': 'Weight Loss Journey',
      'energy': 'Energy Transformation',
      'coat-health': 'Coat Health Improvement',
      'digestive': 'Digestive Health Recovery',
      'allergies': 'Allergy Relief Story',
      'behavior': 'Behavior Transformation',
      'overall': 'Complete Health Transformation',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen page-gradient flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen page-gradient flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-charcoal mb-4">Story Not Found</h1>
          <Link href="/success-stories">
            <Button className="btn-primary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Stories
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-gradient">
      <div className="container-page">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Link href="/success-stories">
            <Button variant="ghost" className="btn-ghost mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Stories
            </Button>
          </Link>

          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow-sm border border-charcoal/10 p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-charcoal">{story.petName}</h1>
                  {story.vetApproved && (
                    <div className="bg-teal-600 text-white text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Vet Approved
                    </div>
                  )}
                </div>
                <p className="text-lg text-charcoal/80 mb-4">
                  {story.breed} " {story.age} years old
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-charcoal/70">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {story.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(story.dateSubmitted).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    {getTimeframeLabel(story.timeframe)}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-teal-600/10 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-teal-600 mb-2">
                {getTransformationLabel(story.transformationType)}
              </h2>
              <p className="text-sm text-charcoal/80">
                Shared by {story.ownerName}
              </p>
            </div>
          </div>

          {/* Before/After Comparison */}
          <Card className="card-feature-primary mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-charcoal flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-teal-600" />
                The Transformation
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Slider Toggle */}
              <div className="flex items-center gap-4 mb-6">
                <Button
                  onClick={() => setShowBefore(true)}
                  variant={showBefore ? 'default' : 'outline'}
                  className={showBefore ? 'btn-primary' : 'btn-outline'}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Before
                </Button>
                <Button
                  onClick={() => setShowBefore(false)}
                  variant={!showBefore ? 'default' : 'outline'}
                  className={!showBefore ? 'btn-primary' : 'btn-outline'}
                >
                  After
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>

              {/* Side by Side Comparison */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="relative">
                  <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={story.beforePhoto}
                      alt={`${story.petName} before`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-sm font-semibold text-charcoal">Before</p>
                    {story.weightBefore && (
                      <p className="text-xs text-charcoal/70">{story.weightBefore} lbs</p>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={story.afterPhoto}
                      alt={`${story.petName} after`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-sm font-semibold text-teal-600">After</p>
                    {story.weightAfter && (
                      <p className="text-xs text-charcoal/70">{story.weightAfter} lbs</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Weight Change Card */}
              {story.weightBefore && story.weightAfter && (
                <div className="bg-gradient-to-r from-maize/20 to-coral/10 rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingDown className="h-5 w-5 text-teal-600" />
                    <p className="text-sm font-medium text-charcoal/70">Total Weight Loss</p>
                  </div>
                  <p className="text-4xl font-bold text-teal-600">
                    {story.weightBefore - story.weightAfter} lbs
                  </p>
                  <p className="text-sm text-charcoal/70 mt-2">
                    From {story.weightBefore} lbs to {story.weightAfter} lbs in {getTimeframeLabel(story.timeframe)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Full Story */}
          <Card className="card-feature-accent mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-charcoal">{story.ownerName}'s Story</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-charcoal/90 leading-relaxed whitespace-pre-line">
                {story.storyText}
              </p>
            </CardContent>
          </Card>

          {/* Health Improvements */}
          <Card className="card-feature-primary mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-charcoal flex items-center gap-2">
                <Check className="h-6 w-6 text-teal-600" />
                Health Improvements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {story.healthImprovements.map((improvement, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 bg-seasalt rounded-lg"
                  >
                    <Check className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-charcoal font-medium">{improvement}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timeline Visualization */}
          <Card className="card-feature-primary mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-charcoal flex items-center gap-2">
                <Calendar className="h-6 w-6 text-teal-600" />
                Transformation Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-teal-600/20"></div>
                <div className="space-y-6">
                  <div className="relative pl-16">
                    <div className="absolute left-6 top-2 w-5 h-5 rounded-full bg-charcoal border-4 border-white"></div>
                    <div className="bg-white border-2 border-charcoal/10 rounded-lg p-4">
                      <p className="text-sm font-semibold text-charcoal mb-1">Day 0 - Before</p>
                      <p className="text-sm text-charcoal/70">
                        Started raw feeding journey
                        {story.weightBefore && ` at ${story.weightBefore} lbs`}
                      </p>
                    </div>
                  </div>

                  <div className="relative pl-16">
                    <div className="absolute left-6 top-2 w-5 h-5 rounded-full bg-teal-600/30 border-4 border-white"></div>
                    <div className="bg-white border-2 border-teal-600/20 rounded-lg p-4">
                      <p className="text-sm font-semibold text-charcoal mb-1">During Transformation</p>
                      <p className="text-sm text-charcoal/70">
                        {getTimeframeLabel(story.timeframe)} of consistent raw feeding
                      </p>
                    </div>
                  </div>

                  <div className="relative pl-16">
                    <div className="absolute left-6 top-2 w-5 h-5 rounded-full bg-teal-600 border-4 border-white"></div>
                    <div className="bg-teal-600/10 border-2 border-teal-600 rounded-lg p-4">
                      <p className="text-sm font-semibold text-teal-600 mb-1">After - Amazing Results!</p>
                      <p className="text-sm text-charcoal/80">
                        {story.healthImprovements.length} health improvements achieved
                        {story.weightAfter && ` " Now ${story.weightAfter} lbs`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section Placeholder */}
          <Card className="card-feature-accent mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-charcoal flex items-center gap-2">
                <MessageCircle className="h-6 w-6 text-teal-600" />
                Comments ({story.comments})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-charcoal/70">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-charcoal/30" />
                <p className="text-sm">Comments section coming soon!</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-charcoal/10 p-6 mb-12">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLiked(!liked)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:bg-seasalt"
              >
                <Heart
                  className={`h-6 w-6 ${
                    liked ? 'fill-teal-600 text-teal-600' : 'text-charcoal/70'
                  }`}
                />
                <span className={`font-medium ${liked ? 'text-teal-600' : 'text-charcoal'}`}>
                  {story.likes + (liked ? 1 : 0)} Likes
                </span>
              </button>
            </div>
            <Link href="/success-stories">
              <Button className="btn-primary">
                Read More Stories
              </Button>
            </Link>
          </div>

          {/* Share Your Story CTA */}
          <div className="bg-gradient-to-r from-teal-600/10 to-coral/10 rounded-lg p-8 text-center mb-12">
            <h2 className="text-3xl font-bold text-charcoal mb-4">
              Inspired by {story.petName}'s Story?
            </h2>
            <p className="text-lg text-charcoal/80 mb-6 max-w-2xl mx-auto">
              Share your own raw feeding transformation and help other pet parents make the switch!
            </p>
            <Link href="/success-stories/submit">
              <Button className="btn-primary text-lg px-8 py-6">
                <Sparkles className="mr-2 h-5 w-5" />
                Share Your Story
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
