'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, Dog, Heart, Activity, Ruler } from 'lucide-react';
import {
  breeds,
  breedGroups,
  breedSizes,
  energyLevels,
  type Breed
} from '@/data/breeds';

export default function BreedGuidesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedEnergy, setSelectedEnergy] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'popularity'>('popularity');

  const filteredBreeds = useMemo(() => {
    let result = breeds;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(breed =>
        breed.name.toLowerCase().includes(query) ||
        breed.alternateNames?.some(name => name.toLowerCase().includes(query)) ||
        breed.temperament.some(trait => trait.toLowerCase().includes(query)) ||
        breed.group.toLowerCase().includes(query)
      );
    }

    // Apply group filter
    if (selectedGroup && selectedGroup !== 'all') {
      result = result.filter(breed => breed.group === selectedGroup);
    }

    // Apply size filter
    if (selectedSize && selectedSize !== 'all') {
      result = result.filter(breed => breed.size === selectedSize);
    }

    // Apply energy level filter
    if (selectedEnergy && selectedEnergy !== 'all') {
      result = result.filter(breed => breed.energyLevel === selectedEnergy);
    }

    // Sort results
    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      result.sort((a, b) => a.popularity - b.popularity);
    }

    return result;
  }, [searchQuery, selectedGroup, selectedSize, selectedEnergy, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGroup('all');
    setSelectedSize('all');
    setSelectedEnergy('all');
  };

  const hasActiveFilters = searchQuery || selectedGroup !== 'all' || selectedSize !== 'all' || selectedEnergy !== 'all';

  return (
    <div className="min-h-screen bg-seasalt py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-teal-600 text-white rounded-full text-sm font-medium">
            <Dog className="inline-block mr-2 h-4 w-4" />
            150+ Dog Breeds
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-charcoal">
            Complete Breed Guides
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Comprehensive raw feeding guidelines, health information, and breed characteristics
            for every dog breed
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search breeds by name, temperament, or group..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Group Filter */}
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger>
                <SelectValue placeholder="All Groups" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                {breedGroups.map(group => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Size Filter */}
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger>
                <SelectValue placeholder="All Sizes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                {breedSizes.map(size => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Energy Level Filter */}
            <Select value={selectedEnergy} onValueChange={setSelectedEnergy}>
              <SelectTrigger>
                <SelectValue placeholder="All Energy Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Energy Levels</SelectItem>
                {energyLevels.map(level => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'name' | 'popularity')}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Most Popular</SelectItem>
                <SelectItem value="name">Alphabetical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between pt-4 border-t">
              <p className="text-sm text-gray-600">
                Showing {filteredBreeds.length} of {breeds.length} breeds
              </p>
              <Button
                onClick={clearFilters}
                variant="outline"
                size="sm"
                className="text-teal-600 hover:bg-teal-50"
              >
                <Filter className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Breed Grid */}
        {filteredBreeds.length === 0 ? (
          <div className="text-center py-12">
            <Dog className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No breeds found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filters
            </p>
            <Button onClick={clearFilters} className="bg-teal-600 hover:bg-teal-700">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBreeds.map((breed) => (
              <Link key={breed.id} href={`/breed-guides/${breed.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardContent className="p-0">
                    {/* Breed Image */}
                    <div className="relative h-48 bg-gradient-to-br from-teal-50 to-orange-50 rounded-t-lg overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Dog className="h-20 w-20 text-teal-600 opacity-20" />
                      </div>
                      {breed.featured && (
                        <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          Popular
                        </div>
                      )}
                    </div>

                    {/* Breed Info */}
                    <div className="p-4">
                      <h3 className="text-xl font-bold text-charcoal mb-2 group-hover:text-teal-600 transition-colors">
                        {breed.name}
                      </h3>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="inline-block w-16 font-medium">Group:</span>
                          <span>{breed.group}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Ruler className="h-4 w-4 mr-2" />
                          <span className="font-medium mr-2">Size:</span>
                          <span>{breed.size}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Activity className="h-4 w-4 mr-2" />
                          <span className="font-medium mr-2">Energy:</span>
                          <span>{breed.energyLevel}</span>
                        </div>
                      </div>

                      {/* Temperament Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {breed.temperament.slice(0, 3).map((trait, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-teal-50 text-teal-700 rounded-full text-xs"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>

                      {/* Good With Tags */}
                      <div className="flex items-center gap-3 pt-3 border-t">
                        {breed.goodWithChildren && (
                          <div className="flex items-center text-xs text-gray-600">
                            <Heart className="h-3 w-3 mr-1 text-teal-600" />
                            Kids
                          </div>
                        )}
                        {breed.goodWithPets && (
                          <div className="flex items-center text-xs text-gray-600">
                            <Heart className="h-3 w-3 mr-1 text-teal-600" />
                            Pets
                          </div>
                        )}
                        <div className="ml-auto text-xs text-gray-500">
                          {breed.lifeSpan}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Bottom Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            All breeds include comprehensive raw feeding guidelines tailored to their specific nutritional needs
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <div className="flex items-center text-sm text-gray-700">
              <Dog className="h-5 w-5 mr-2 text-teal-600" />
              150+ Breeds
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <Heart className="h-5 w-5 mr-2 text-teal-600" />
              Health Guidelines
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <Activity className="h-5 w-5 mr-2 text-teal-600" />
              Raw Feeding Plans
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
