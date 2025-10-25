'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Dog, Menu, X, ChevronDown, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationCenter } from '@/components/notifications/notification-center';
import { SearchButton } from '@/components/search/search-button';
import { useGlobalSearch } from '@/components/search/global-search';

export function MainNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setOpen: setSearchOpen } = useGlobalSearch();

  const navItems = [
    { name: 'Home', href: '/' },
    {
      name: 'AI Assistant',
      href: '/ai-assistant',
      description: 'Your expert in raw pet nutrition'
    },
    {
      name: 'Pet Management',
      href: '/pets',
      description: 'Manage your pets & health records'
    },
    {
      name: 'Smart Feeding',
      href: '/feeding',
      description: 'Calculate portions & track meals'
    },
    {
      name: 'Health & Wellness',
      href: '/health',
      description: 'Track health & symptoms'
    },
    {
      name: 'Community & Social',
      href: '/community',
      description: 'Connect with other pet parents'
    },
    {
      name: 'Location Services',
      href: '/suppliers',
      description: 'Find suppliers near you'
    },
    {
      name: 'Shop & Marketplace',
      href: '/shop',
      description: 'Browse products & supplements'
    },
    {
      name: 'Education & Learning',
      href: '/education',
      description: 'Guides, tutorials & expert advice'
    },
    {
      name: 'PAWS Ecosystem',
      href: '/paws',
      description: 'Earn rewards & manage tokens'
    },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Dog className="h-8 w-8 text-orange-500" />
            <span className="text-2xl font-bold text-orange-500">RAWGLE</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            {navItems.slice(0, 6).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors rounded-md hover:bg-orange-50"
              >
                {item.name}
              </Link>
            ))}

            {/* More Menu */}
            <div className="relative group">
              <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors rounded-md hover:bg-orange-50">
                More
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute right-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  {navItems.slice(6).map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                    >
                      <div className="font-medium">{item.name}</div>
                      {item.description && (
                        <div className="text-xs text-gray-600 mt-0.5">{item.description}</div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex lg:items-center lg:space-x-3">
            <SearchButton onClick={() => setSearchOpen(true)} showLabel />
            <NotificationCenter />
            <Link href="/wishlist">
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Wishlist
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" size="sm">
                Profile
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                Get Started Free
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-orange-50"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-white">
          <div className="container mx-auto px-4 py-4 space-y-1">
            {/* Mobile Search */}
            <div className="mb-3">
              <SearchButton
                onClick={() => {
                  setSearchOpen(true);
                  setMobileMenuOpen(false);
                }}
                variant="outline"
                className="w-full justify-start"
                showLabel
              />
            </div>

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50"
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t space-y-2">
              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
