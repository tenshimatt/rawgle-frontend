'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowLeft,
  Dog,
  Heart,
  Activity,
  Ruler,
  Clock,
  AlertCircle,
  Utensils,
  Scissors,
  Volume2,
  Users,
  Briefcase
} from 'lucide-react';
import { getBreedBySlug } from '@/data/breeds';

export default function BreedDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const breed = getBreedBySlug(slug);

  if (!breed) {
    return (
      <div className="min-h-screen bg-seasalt flex items-center justify-center">
        <div className="text-center">
          <Dog className="h-20 w-20 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-700 mb-2">Breed Not Found</h1>
          <p className="text-gray-600 mb-6">
            The breed you're looking for doesn't exist
          </p>
          <Link href="/breed-guides">
            <Button className="bg-teal-600 hover:bg-teal-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Breed Guides
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-seasalt">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-700 text-white py-12">
        <div className="container mx-auto px-4">
          <Link href="/breed-guides">
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Breeds
            </Button>
          </Link>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* Breed Image */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg p-6 shadow-xl">
                <div className="aspect-square bg-gradient-to-br from-teal-50 to-orange-50 rounded-lg flex items-center justify-center">
                  <Dog className="h-32 w-32 text-teal-600 opacity-30" />
                </div>
              </div>
            </div>

            {/* Breed Header Info */}
            <div className="md:col-span-2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">
                    {breed.name}
                  </h1>
                  {breed.alternateNames && breed.alternateNames.length > 0 && (
                    <p className="text-teal-100 text-lg">
                      Also known as: {breed.alternateNames.join(', ')}
                    </p>
                  )}
                </div>
                {breed.featured && (
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Popular
                  </span>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-teal-100 text-sm mb-1">Group</div>
                  <div className="font-semibold">{breed.group}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-teal-100 text-sm mb-1">Size</div>
                  <div className="font-semibold">{breed.size}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-teal-100 text-sm mb-1">Energy</div>
                  <div className="font-semibold">{breed.energyLevel}</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-teal-100 text-sm mb-1">Life Span</div>
                  <div className="font-semibold">{breed.lifeSpan}</div>
                </div>
              </div>

              {/* Temperament Tags */}
              <div className="mt-6">
                <div className="text-teal-100 text-sm mb-2">Temperament</div>
                <div className="flex flex-wrap gap-2">
                  {breed.temperament.map((trait, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* History & Characteristics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Briefcase className="mr-3 h-6 w-6 text-teal-600" />
                  History & Background
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {breed.history}
                </p>
                <h3 className="font-semibold text-lg mb-3 text-charcoal">Characteristics</h3>
                <p className="text-gray-700 leading-relaxed">
                  {breed.characteristics}
                </p>
              </CardContent>
            </Card>

            {/* Raw Feeding Guidelines */}
            <Card className="border-teal-200 border-2">
              <CardHeader className="bg-teal-50">
                <CardTitle className="flex items-center text-2xl">
                  <Utensils className="mr-3 h-6 w-6 text-teal-600" />
                  Raw Feeding Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="font-semibold text-charcoal mb-2">Daily Feeding Amount</div>
                    <p className="text-gray-700">{breed.rawFeedingGuide.dailyPercentage}</p>
                  </div>
                  <div>
                    <div className="font-semibold text-charcoal mb-2">Bone/Meat Ratio</div>
                    <p className="text-gray-700">{breed.rawFeedingGuide.boneMeatRatio}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="font-semibold text-charcoal mb-2">Recommended Protein Sources</div>
                  <div className="flex flex-wrap gap-2">
                    {breed.rawFeedingGuide.proteinSources.map((protein, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm"
                      >
                        {protein}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="font-semibold text-charcoal mb-2">Organ Meat Distribution</div>
                  <p className="text-gray-700">{breed.rawFeedingGuide.organMeatRatio}</p>
                </div>

                <div className="mb-6">
                  <div className="font-semibold text-charcoal mb-3">Special Considerations</div>
                  <ul className="space-y-2">
                    {breed.rawFeedingGuide.specialConsiderations.map((consideration, index) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <AlertCircle className="h-5 w-5 mr-2 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span>{consideration}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-teal-50 p-4 rounded-lg">
                  <div className="font-semibold text-charcoal mb-2">Sample Daily Meal Plan</div>
                  <p className="text-gray-700">{breed.rawFeedingGuide.sampleMealPlan}</p>
                </div>
              </CardContent>
            </Card>

            {/* Health Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <AlertCircle className="mr-3 h-6 w-6 text-teal-600" />
                  Health Considerations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3 text-charcoal">Common Health Issues</h3>
                  <div className="flex flex-wrap gap-2">
                    {breed.commonHealthIssues.map((issue, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                      >
                        {issue}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3 text-charcoal">Genetic Conditions</h3>
                  <div className="flex flex-wrap gap-2">
                    {breed.geneticConditions.map((condition, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>Important:</strong> Always consult with your veterinarian about your dog's specific health needs
                    and any breed-specific concerns.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Physical Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Ruler className="mr-2 h-5 w-5 text-teal-600" />
                  Physical Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Male Weight</div>
                  <div className="font-semibold text-charcoal">{breed.weight.male}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Female Weight</div>
                  <div className="font-semibold text-charcoal">{breed.weight.female}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Male Height</div>
                  <div className="font-semibold text-charcoal">{breed.height.male}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Female Height</div>
                  <div className="font-semibold text-charcoal">{breed.height.female}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Coat Type</div>
                  <div className="font-semibold text-charcoal">{breed.coatType}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Coat Colors</div>
                  <div className="flex flex-wrap gap-1">
                    {breed.coatColors.map((color, index) => (
                      <span
                        key={index}
                        className="text-sm text-charcoal"
                      >
                        {color}{index < breed.coatColors.length - 1 && ','}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Care Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-2 h-5 w-5 text-teal-600" />
                  Care Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Activity className="mr-2 h-4 w-4" />
                    Exercise Needs
                  </div>
                  <div className="font-semibold text-charcoal">{breed.exerciseNeeds}</div>
                </div>
                <div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Scissors className="mr-2 h-4 w-4" />
                    Grooming
                  </div>
                  <div className="font-semibold text-charcoal">{breed.groomingNeeds}</div>
                </div>
                <div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Volume2 className="mr-2 h-4 w-4" />
                    Barking Level
                  </div>
                  <div className="font-semibold text-charcoal">{breed.barkingLevel}</div>
                </div>
                <div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Users className="mr-2 h-4 w-4" />
                    Trainability
                  </div>
                  <div className="font-semibold text-charcoal">{breed.trainability}</div>
                </div>
              </CardContent>
            </Card>

            {/* Family Compatibility */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-teal-600" />
                  Family Compatibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Good with Children</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    breed.goodWithChildren
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {breed.goodWithChildren ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Good with Other Pets</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    breed.goodWithPets
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {breed.goodWithPets ? 'Yes' : 'No'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* CTA Card */}
            <Card className="bg-teal-50 border-teal-200">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2 text-charcoal">
                  Ready to Start Raw Feeding?
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  Get personalized feeding plans and expert guidance for your {breed.name}
                </p>
                <Link href="/ai-assistant">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700">
                    Talk to AI Assistant
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
