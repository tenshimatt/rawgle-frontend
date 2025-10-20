'use client';

import Link from 'next/link';
import { MainNav } from '@/components/navigation/main-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dog, MapPin, MessageSquare, Calendar, Heart, ShoppingBag, BookOpen, Users, Award } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <MainNav />

      {/* Hero Section */}
      <div className="relative py-24 px-4 overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-persian-green/5 via-sandy-brown/5 to-burnt-sienna/5"></div>
        <div className="relative">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-charcoal">
                🐾 Raw Pet Food
              </h1>
              <p className="text-2xl mb-4 text-charcoal/90">Your AI-Assisted Pet Health Companion</p>
              <p className="text-lg mb-8 text-charcoal/70">
                Expert nutrition guidance, local supplier discovery, and complete health tracking for raw-fed pets
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/ai-assistant">
                  <Button size="lg" className="bg-persian-green text-white hover:bg-persian-green-600 px-8 py-6 text-lg shadow-lg">
                    💬 Talk to AI Assistant
                  </Button>
                </Link>
                <Link href="/suppliers">
                  <Button size="lg" className="bg-sandy-brown text-charcoal hover:bg-sandy-brown-600 px-8 py-6 text-lg shadow-lg">
                    📍 Find Suppliers
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Everything You Need for Raw Pet Nutrition
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/ai-assistant">
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-sandy-brown h-full bg-white/80 backdrop-blur">
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-16 w-16 text-sandy-brown mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">AI Assistant</h3>
                <p className="text-gray-600 text-sm">
                  Get expert answers on raw nutrition, portions, safety, and meal planning
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/pets">
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-persian-green h-full bg-white/80 backdrop-blur">
              <CardContent className="p-6 text-center">
                <Heart className="h-16 w-16 text-persian-green mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Pet Management</h3>
                <p className="text-gray-600 text-sm">
                  Manage profiles, health records, and track your pet's well-being
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/feeding">
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-charcoal h-full bg-white/80 backdrop-blur">
              <CardContent className="p-6 text-center">
                <Calendar className="h-16 w-16 text-charcoal mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Smart Feeding</h3>
                <p className="text-gray-600 text-sm">
                  Calculate portions, track meals, and monitor digestion patterns
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/suppliers">
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-burnt-sienna h-full bg-white/80 backdrop-blur">
              <CardContent className="p-6 text-center">
                <MapPin className="h-16 w-16 text-burnt-sienna mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Find Suppliers</h3>
                <p className="text-gray-600 text-sm">
                  Discover 9,190+ verified raw pet food suppliers near you
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/health">
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-persian-green h-full bg-white/80 backdrop-blur">
              <CardContent className="p-6 text-center">
                <Heart className="h-16 w-16 text-persian-green mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Health & Wellness</h3>
                <p className="text-gray-600 text-sm">
                  Track symptoms, monitor progress, and share with your vet
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/community">
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-burnt-sienna h-full bg-white/80 backdrop-blur">
              <CardContent className="p-6 text-center">
                <Users className="h-16 w-16 text-burnt-sienna mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Community</h3>
                <p className="text-gray-600 text-sm">
                  Connect with other raw feeders, share tips, and learn together
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/shop">
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-sandy-brown h-full bg-white/80 backdrop-blur">
              <CardContent className="p-6 text-center">
                <ShoppingBag className="h-16 w-16 text-sandy-brown mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Shop & Marketplace</h3>
                <p className="text-gray-600 text-sm">
                  Browse products, supplements, and essential feeding supplies
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/education">
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-charcoal h-full bg-white/80 backdrop-blur">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-16 w-16 text-charcoal mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Education</h3>
                <p className="text-gray-600 text-sm">
                  Guides, tutorials, and expert advice on raw pet nutrition
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-persian-green to-persian-green-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">9,190+</div>
              <div className="text-lg opacity-90">Verified Suppliers</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50K+</div>
              <div className="text-lg opacity-90">Happy Pets</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">1M+</div>
              <div className="text-lg opacity-90">Meals Tracked</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">24/7</div>
              <div className="text-lg opacity-90">AI Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-charcoal">
            Ready to Transform Your Pet's Health?
          </h2>
          <p className="text-xl text-charcoal/70 mb-8">
            Join thousands of pet parents who've switched to raw feeding with confidence
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/pets">
              <Button size="lg" className="bg-burnt-sienna text-white hover:bg-burnt-sienna-600 px-8 py-6 text-lg shadow-lg">
                🐾 Add Your Pet
              </Button>
            </Link>
            <Link href="/education">
              <Button size="lg" variant="outline" className="border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white px-8 py-6 text-lg">
                📚 Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
