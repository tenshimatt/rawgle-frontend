'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, MessageCircle, ArrowRight, Filter, Loader2, PawPrint, Sparkles } from 'lucide-react';

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

export default function SuccessStoriesPage() {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedStories, setLikedStories] = useState<Set<string>>(new Set());

  // Filters
  const [petTypeFilter, setPetTypeFilter] = useState('all');
  const [transformationFilter, setTransformationFilter] = useState('all');
  const [timeframeFilter, setTimeframeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('likes');

  useEffect(() => {
    fetchStories();
  }, [petTypeFilter, transformationFilter, timeframeFilter, sortBy]);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (petTypeFilter !== 'all') params.append('petType', petTypeFilter);
      if (transformationFilter !== 'all') params.append('transformationType', transformationFilter);
      if (timeframeFilter !== 'all') params.append('timeframe', timeframeFilter);
      params.append('sortBy', sortBy);

      const response = await fetch(`/api/success-stories?${params.toString()}`);
      const data = await response.json();
      setStories(data.data || []);
    } catch (error) {
      console.error('Error fetching success stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = (storyId: string) => {
    setLikedStories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(storyId)) {
        newSet.delete(storyId);
      } else {
        newSet.add(storyId);
      }
      return newSet;
    });
  };

  const getTransformationBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      'weight-loss': 'bg-coral/10 text-coral',
      'energy': 'bg-maize/30 text-charcoal',
      'coat-health': 'bg-persian-green/10 text-persian-green',
      'digestive': 'bg-moss-green/20 text-charcoal',
      'allergies': 'bg-burnt-sienna/10 text-burnt-sienna',
      'behavior': 'bg-myrtle-green/10 text-myrtle-green',
      'overall': 'bg-teal-600/10 text-teal-600',
    };
    return colors[type] || 'bg-gray-100 text-gray-600';
  };

  const getTransformationLabel = (type: string) => {
    const labels: Record<string, string> = {
      'weight-loss': 'Weight Loss',
      'energy': 'Energy Boost',
      'coat-health': 'Coat Health',
      'digestive': 'Digestive Health',
      'allergies': 'Allergy Relief',
      'behavior': 'Behavior',
      'overall': 'Overall Health',
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen page-gradient">
      <div className="hero-gradient border-b border-charcoal/10">
        <div className="container-page">
          <div className="max-w-4xl mx-auto text-center py-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-teal-600" />
              <h1 className="hero-title text-4xl md:text-5xl">
                Amazing Transformations
              </h1>
            </div>
            <p className="hero-description text-lg mb-8">
              Real stories from real pet parents who switched to raw feeding. See the incredible results!
            </p>
            <Link href="/success-stories/submit">
              <Button className="btn-primary text-lg px-8 py-6">
                <PawPrint className="mr-2 h-5 w-5" />
                Share Your Story
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container-page">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-charcoal/10 p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-teal-600" />
              <h2 className="text-lg font-semibold text-charcoal">Filter Stories</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Pet Type</label>
                <select
                  value={petTypeFilter}
                  onChange={(e) => setPetTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <option value="all">All Pets</option>
                  <option value="dog">Dogs</option>
                  <option value="cat">Cats</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Transformation</label>
                <select
                  value={transformationFilter}
                  onChange={(e) => setTransformationFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <option value="all">All Types</option>
                  <option value="weight-loss">Weight Loss</option>
                  <option value="energy">Energy Boost</option>
                  <option value="coat-health">Coat Health</option>
                  <option value="digestive">Digestive</option>
                  <option value="allergies">Allergies</option>
                  <option value="behavior">Behavior</option>
                  <option value="overall">Overall Health</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Timeframe</label>
                <select
                  value={timeframeFilter}
                  onChange={(e) => setTimeframeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <option value="all">All Timeframes</option>
                  <option value="1-month">1 Month</option>
                  <option value="3-months">3 Months</option>
                  <option value="6-months">6 Months</option>
                  <option value="1-year">1 Year</option>
                  <option value="2-years+">2+ Years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <option value="likes">Most Liked</option>
                  <option value="recent">Most Recent</option>
                  <option value="comments">Most Comments</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-teal-600" />
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-20">
              <PawPrint className="h-24 w-24 mx-auto mb-4 text-charcoal/30" />
              <h2 className="text-2xl font-bold text-charcoal mb-2">No stories found</h2>
              <p className="text-charcoal/70 mb-6">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-sm text-charcoal/70">
                  Showing <span className="font-semibold text-teal-600">{stories.length}</span> inspiring {stories.length === 1 ? 'story' : 'stories'}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {stories.map((story) => (
                  <Card key={story.id} className="card-feature-primary overflow-hidden group">
                    <CardContent className="p-0">
                      <div className="relative h-64 bg-gray-100">
                        <div className="grid grid-cols-2 h-full">
                          <div className="relative">
                            <Image
                              src={story.beforePhoto}
                              alt={`${story.petName} before`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, 25vw"
                            />
                            <div className="absolute top-2 left-2 bg-charcoal/80 text-white text-xs px-2 py-1 rounded">
                              Before
                            </div>
                          </div>
                          <div className="relative">
                            <Image
                              src={story.afterPhoto}
                              alt={`${story.petName} after`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, 25vw"
                            />
                            <div className="absolute top-2 right-2 bg-teal-600 text-white text-xs px-2 py-1 rounded">
                              After
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-charcoal mb-1">
                              {story.petName}
                            </h3>
                            <p className="text-sm text-charcoal/70">
                              {story.breed} " {story.age} years old
                            </p>
                          </div>
                          {story.vetApproved && (
                            <div className="bg-teal-600/10 text-teal-600 text-xs px-2 py-1 rounded font-medium">
                              Vet Approved
                            </div>
                          )}
                        </div>

                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${getTransformationBadgeColor(story.transformationType)}`}>
                          {getTransformationLabel(story.transformationType)}
                        </div>

                        <p className="text-sm text-charcoal/80 mb-4 line-clamp-3">
                          {story.storyText}
                        </p>

                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {story.healthImprovements.slice(0, 3).map((improvement, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-seasalt text-charcoal px-2 py-1 rounded"
                              >
                                {improvement}
                              </span>
                            ))}
                            {story.healthImprovements.length > 3 && (
                              <span className="text-xs text-teal-600 px-2 py-1">
                                +{story.healthImprovements.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        {story.weightBefore && story.weightAfter && (
                          <div className="bg-maize/20 rounded-lg p-3 mb-4">
                            <p className="text-xs text-charcoal/70 mb-1">Weight Change</p>
                            <p className="text-sm font-semibold text-charcoal">
                              {story.weightBefore} lbs to {story.weightAfter} lbs
                              <span className="text-teal-600 ml-2">
                                (-{story.weightBefore - story.weightAfter} lbs)
                              </span>
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-charcoal/10">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => toggleLike(story.id)}
                              className="flex items-center gap-1 text-sm transition-colors hover:text-teal-600"
                            >
                              <Heart
                                className={`h-5 w-5 ${
                                  likedStories.has(story.id)
                                    ? 'fill-teal-600 text-teal-600'
                                    : 'text-charcoal/70'
                                }`}
                              />
                              <span className={likedStories.has(story.id) ? 'text-teal-600 font-medium' : 'text-charcoal/70'}>
                                {story.likes + (likedStories.has(story.id) ? 1 : 0)}
                              </span>
                            </button>
                            <div className="flex items-center gap-1 text-sm text-charcoal/70">
                              <MessageCircle className="h-5 w-5" />
                              <span>{story.comments}</span>
                            </div>
                          </div>
                          <Link href={`/success-stories/${story.id}`}>
                            <Button variant="ghost" size="sm" className="btn-ghost text-teal-600 hover:text-teal-700">
                              Read More
                              <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          <div className="bg-gradient-to-r from-teal-600/10 to-coral/10 rounded-lg p-8 text-center mb-12">
            <h2 className="text-3xl font-bold text-charcoal mb-4">
              Have Your Own Success Story?
            </h2>
            <p className="text-lg text-charcoal/80 mb-6 max-w-2xl mx-auto">
              Inspire other pet parents by sharing your raw feeding journey. Your story could help someone make the switch!
            </p>
            <Link href="/success-stories/submit">
              <Button className="btn-primary text-lg px-8 py-6">
                <PawPrint className="mr-2 h-5 w-5" />
                Share Your Transformation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
