'use client';

import Link from 'next/link';
import { MainNav } from '@/components/navigation/main-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dog, MapPin, MessageSquare, Calendar, Heart, ShoppingBag, BookOpen, Users, Award } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-green-50">
      <MainNav />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              🐾 Raw Pet Food
            </h1>
            <p className="text-2xl mb-4">Your AI-Assisted Pet Health Companion</p>
            <p className="text-lg mb-8 opacity-90">
              Expert nutrition guidance, local supplier discovery, and complete health tracking for raw-fed pets
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/ai-assistant">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-6 text-lg">
                  💬 Talk to AI Assistant
                </Button>
              </Link>
              <Link href="/suppliers">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-6 text-lg">
                  📍 Find Suppliers
                </Button>
              </Link>
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
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-orange-300 h-full">
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">AI Assistant</h3>
                <p className="text-gray-600 text-sm">
                  Get expert answers on raw nutrition, portions, safety, and meal planning
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/pets">
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-green-300 h-full">
              <CardContent className="p-6 text-center">
                <Heart className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Pet Management</h3>
                <p className="text-gray-600 text-sm">
                  Manage profiles, health records, and track your pet's well-being
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/feeding">
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-blue-300 h-full">
              <CardContent className="p-6 text-center">
                <Calendar className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Smart Feeding</h3>
                <p className="text-gray-600 text-sm">
                  Calculate portions, track meals, and monitor digestion patterns
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/suppliers">
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-purple-300 h-full">
              <CardContent className="p-6 text-center">
                <MapPin className="h-16 w-16 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Find Suppliers</h3>
                <p className="text-gray-600 text-sm">
                  Discover 9,190+ verified raw pet food suppliers near you
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/health">
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-red-300 h-full">
              <CardContent className="p-6 text-center">
                <Heart className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Health & Wellness</h3>
                <p className="text-gray-600 text-sm">
                  Track symptoms, monitor progress, and share with your vet
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/community">
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-yellow-300 h-full">
              <CardContent className="p-6 text-center">
                <Users className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Community</h3>
                <p className="text-gray-600 text-sm">
                  Connect with other raw feeders, share tips, and learn together
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/shop">
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-indigo-300 h-full">
              <CardContent className="p-6 text-center">
                <ShoppingBag className="h-16 w-16 text-indigo-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Shop & Marketplace</h3>
                <p className="text-gray-600 text-sm">
                  Browse products, supplements, and essential feeding supplies
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/education">
            <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-pink-300 h-full">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-16 w-16 text-pink-500 mx-auto mb-4" />
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
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-16">
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
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Ready to Transform Your Pet's Health?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of pet parents who've switched to raw feeding with confidence
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/pets">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 px-8 py-6 text-lg">
                🐾 Add Your Pet
              </Button>
            </Link>
            <Link href="/education">
              <Button size="lg" variant="outline" className="border-2 px-8 py-6 text-lg">
                📚 Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
