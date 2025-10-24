'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, MapPin, Calendar, Heart, ShoppingBag, BookOpen, Users, Award, Star } from 'lucide-react';
import { supplements } from '@/data/products/supplements';

export default function HomePage() {
  const featuredSupplements = supplements.filter(s => s.featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-seasalt">
      {/* Hero Section */}
      <div className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-teal-50 via-white to-orange-50">
        <div className="relative">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block mb-6 px-4 py-2 bg-teal-600 text-white rounded-full text-sm font-medium">
                AI-Powered Pet Nutrition Platform
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-charcoal">
                Transform Your Pet's Health with Raw Nutrition
              </h1>
              <p className="text-xl mb-4 text-gray-700">
                Expert guidance, local supplier discovery, and complete health tracking
              </p>
              <p className="text-lg mb-8 text-gray-600">
                Join thousands of pet parents who've switched to raw feeding with confidence
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/ai-assistant">
                  <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Talk to AI Assistant
                  </Button>
                </Link>
                <Link href="/map">
                  <Button size="lg" variant="outline" className="border-teal-600 text-teal-700 hover:bg-teal-50">
                    <MapPin className="mr-2 h-5 w-5" />
                    Find Suppliers
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-teal-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">9,190+</div>
              <div className="text-base md:text-lg opacity-90">Verified Suppliers</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50K+</div>
              <div className="text-base md:text-lg opacity-90">Happy Pets</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">1M+</div>
              <div className="text-base md:text-lg opacity-90">Meals Tracked</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-base md:text-lg opacity-90">AI Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-charcoal">
          Everything You Need for Raw Pet Nutrition
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Comprehensive tools and expert guidance to make raw feeding simple, safe, and successful
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/ai-assistant">
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-burnt-sienna h-full bg-white">
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-12 w-12 text-burnt-sienna mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2 text-charcoal">AI Assistant</h3>
                <p className="text-gray-600 text-sm">
                  Get expert answers on raw nutrition, portions, safety, and meal planning
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/pets">
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-teal-500 h-full bg-white">
              <CardContent className="p-6 text-center">
                <Heart className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2 text-charcoal">Pet Management</h3>
                <p className="text-gray-600 text-sm">
                  Manage profiles, health records, and track your pet's well-being
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/feeding">
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-yellow-500 h-full bg-white">
              <CardContent className="p-6 text-center">
                <Calendar className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2 text-charcoal">Smart Feeding</h3>
                <p className="text-gray-600 text-sm">
                  Calculate portions, track meals, and monitor digestion patterns
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/map">
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-red-500 h-full bg-white">
              <CardContent className="p-6 text-center">
                <MapPin className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2 text-charcoal">Find Suppliers</h3>
                <p className="text-gray-600 text-sm">
                  Discover verified raw pet food suppliers near you on interactive map
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/health">
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-green-500 h-full bg-white">
              <CardContent className="p-6 text-center">
                <Heart className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2 text-charcoal">Health Tracking</h3>
                <p className="text-gray-600 text-sm">
                  Track symptoms, monitor progress, and share with your vet
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/community/forums">
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-purple-500 h-full bg-white">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2 text-charcoal">Community</h3>
                <p className="text-gray-600 text-sm">
                  Connect with other raw feeders, share tips, and learn together
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/shop">
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-blue-500 h-full bg-white">
              <CardContent className="p-6 text-center">
                <ShoppingBag className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2 text-charcoal">Shop</h3>
                <p className="text-gray-600 text-sm">
                  Browse premium supplements and essential feeding supplies
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/education/blog">
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-pink-500 h-full bg-white">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-12 w-12 text-pink-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2 text-charcoal">Education</h3>
                <p className="text-gray-600 text-sm">
                  Guides, tutorials, and expert advice on raw pet nutrition
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Featured Supplements Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-charcoal">
              Featured Supplements
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Premium supplements to support your pet's raw diet and optimal health
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {featuredSupplements.map((supplement) => (
              <Link href={`/shop/${supplement.id}`} key={supplement.id}>
                <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-teal-500 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-xs font-semibold text-teal-600 uppercase">
                        {supplement.category}
                      </div>
                      <div className="flex items-center text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="ml-1 text-sm font-medium text-gray-700">
                          {supplement.rating}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-charcoal">
                      {supplement.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{supplement.brand}</p>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {supplement.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-teal-600">
                        ${supplement.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500">{supplement.size}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/shop">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white">
                View All Supplements
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Success Stories Preview */}
      <div className="bg-gradient-to-br from-teal-50 to-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-charcoal">
              Success Stories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real results from pet parents who switched to raw feeding
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Max's allergies completely cleared up after switching to raw. His coat is shinier than ever!"
                </p>
                <div className="font-semibold text-charcoal">Sarah M.</div>
                <div className="text-sm text-gray-500">Golden Retriever owner</div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "The AI assistant helped me transition Luna safely. No more digestive issues!"
                </p>
                <div className="font-semibold text-charcoal">James L.</div>
                <div className="text-sm text-gray-500">Cat owner</div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "At 12 years old, Rocky has more energy than ever. Raw feeding changed his life!"
                </p>
                <div className="font-semibold text-charcoal">Emily K.</div>
                <div className="text-sm text-gray-500">Senior dog owner</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-teal-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Pet's Health?
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Join thousands of pet parents who've switched to raw feeding with confidence
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/pets">
                <Button size="lg" className="bg-burnt-sienna hover:bg-orange-700 text-white">
                  <Heart className="mr-2 h-5 w-5" />
                  Add Your Pet
                </Button>
              </Link>
              <Link href="/education">
                <Button size="lg" variant="outline" className="bg-white text-teal-700 hover:bg-gray-100 border-0">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
