'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, BookOpen, Filter, ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { GlossaryTerm, GlossaryCategory } from '@/data/glossary';

// Category colors for badges
const categoryColors: Record<GlossaryCategory, string> = {
  'Nutrition': 'bg-blue-100 text-blue-800 border-blue-200',
  'Anatomy': 'bg-purple-100 text-purple-800 border-purple-200',
  'Food Types': 'bg-green-100 text-green-800 border-green-200',
  'Feeding Methods': 'bg-teal-100 text-teal-800 border-teal-200',
  'Health': 'bg-red-100 text-red-800 border-red-200',
  'Supplements': 'bg-orange-100 text-orange-800 border-orange-200',
};

export default function GlossaryPage() {
  const [allTerms, setAllTerms] = useState<GlossaryTerm[]>([]);
  const [displayedTerms, setDisplayedTerms] = useState<GlossaryTerm[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategory | 'all'>('all');
  const [categories, setCategories] = useState<GlossaryCategory[]>([]);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch glossary data on mount
  useEffect(() => {
    async function fetchGlossary() {
      setIsLoading(true);
      try {
        // Fetch all terms
        const termsResponse = await fetch('/api/glossary');
        const termsData = await termsResponse.json();

        // Fetch metadata
        const metaResponse = await fetch('/api/glossary?meta=true');
        const metaData = await metaResponse.json();

        if (termsData.success) {
          setAllTerms(termsData.data);
          setDisplayedTerms(termsData.data);
        }

        if (metaData.success) {
          setCategories(metaData.data.categories);
          setAvailableLetters(metaData.data.availableLetters);
        }
      } catch (error) {
        console.error('Failed to fetch glossary:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchGlossary();
  }, []);

  // Filter terms based on search, letter, and category
  useEffect(() => {
    let filtered = [...allTerms];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        term =>
          term.name.toLowerCase().includes(query) ||
          term.shortDefinition.toLowerCase().includes(query) ||
          term.detailedExplanation.toLowerCase().includes(query) ||
          term.category.toLowerCase().includes(query)
      );
    }

    // Apply letter filter
    if (selectedLetter) {
      filtered = filtered.filter(term =>
        term.name.toUpperCase().startsWith(selectedLetter)
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(term => term.category === selectedCategory);
    }

    setDisplayedTerms(filtered);
  }, [searchQuery, selectedLetter, selectedCategory, allTerms]);

  // Group terms by first letter for display
  const groupedTerms = useMemo(() => {
    const groups: Record<string, GlossaryTerm[]> = {};

    displayedTerms.forEach(term => {
      const firstLetter = term.name.charAt(0).toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(term);
    });

    // Sort terms within each group
    Object.keys(groups).forEach(letter => {
      groups[letter].sort((a, b) => a.name.localeCompare(b.name));
    });

    return groups;
  }, [displayedTerms]);

  const handleLetterClick = (letter: string) => {
    if (selectedLetter === letter) {
      setSelectedLetter('');
    } else {
      setSelectedLetter(letter);
      // Scroll to the letter section
      const element = document.getElementById(`letter-${letter}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedLetter('');
    setSelectedCategory('all');
  };

  const hasActiveFilters = searchQuery || selectedLetter || selectedCategory !== 'all';

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-12 w-12 text-teal-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">
              Raw Feeding Glossary
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Your comprehensive guide to raw feeding terminology, nutrition, and dog health.
            {!isLoading && (
              <span className="block mt-2 text-teal-600 font-semibold">
                {allTerms.length}+ terms and counting
              </span>
            )}
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 shadow-lg border-teal-100">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search terms, definitions, or categories..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 text-lg border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Filter by:</span>
                </div>
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => setSelectedCategory(value as GlossaryCategory | 'all')}
                >
                  <SelectTrigger className="w-[200px] border-teal-200">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    onClick={handleClearFilters}
                    className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>

              {/* Results count */}
              <div className="text-sm text-gray-600">
                Showing {displayedTerms.length} of {allTerms.length} terms
              </div>
            </div>
          </CardContent>
        </Card>

        {/* A-Z Letter Navigation */}
        <div className="mb-8 bg-white rounded-lg shadow-md border border-teal-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-gray-700">Jump to:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableLetters.map(letter => (
              <Button
                key={letter}
                variant={selectedLetter === letter ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleLetterClick(letter)}
                className={
                  selectedLetter === letter
                    ? 'bg-teal-600 hover:bg-teal-700 text-white'
                    : 'border-teal-200 text-teal-600 hover:bg-teal-50 hover:text-teal-700'
                }
              >
                {letter}
              </Button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading glossary...</p>
          </div>
        )}

        {/* No Results */}
        {!isLoading && displayedTerms.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No terms found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filters
              </p>
              <Button onClick={handleClearFilters} className="bg-teal-600 hover:bg-teal-700">
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Glossary Terms */}
        {!isLoading && displayedTerms.length > 0 && (
          <div className="space-y-8">
            {Object.keys(groupedTerms)
              .sort()
              .map(letter => (
                <div key={letter} id={`letter-${letter}`} className="scroll-mt-24">
                  {/* Letter Header */}
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-teal-600 text-white rounded-lg flex items-center justify-center font-bold text-2xl shadow-md">
                      {letter}
                    </div>
                    <div className="ml-4 flex-grow border-b-2 border-teal-200"></div>
                    <span className="ml-4 text-sm text-gray-500 font-medium">
                      {groupedTerms[letter].length} term{groupedTerms[letter].length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Terms in this letter */}
                  <Accordion type="multiple" className="space-y-3">
                    {groupedTerms[letter].map(term => (
                      <AccordionItem
                        key={term.id}
                        value={term.id}
                        className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 hover:no-underline">
                          <div className="flex items-start justify-between w-full pr-4">
                            <div className="text-left flex-grow">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {term.name}
                              </h3>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {term.shortDefinition}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className={`ml-4 flex-shrink-0 ${categoryColors[term.category]}`}
                            >
                              {term.category}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                          <div className="space-y-4">
                            {/* Detailed Explanation */}
                            <div>
                              <h4 className="text-sm font-semibold text-teal-700 mb-2">
                                Detailed Explanation
                              </h4>
                              <p className="text-gray-700 leading-relaxed">
                                {term.detailedExplanation}
                              </p>
                            </div>

                            {/* Related Terms */}
                            {term.relatedTerms && term.relatedTerms.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold text-teal-700 mb-2">
                                  Related Terms
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {term.relatedTerms.map((relatedTerm, index) => (
                                    <Badge
                                      key={index}
                                      variant="secondary"
                                      className="bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100 cursor-pointer"
                                      onClick={() => setSearchQuery(relatedTerm)}
                                    >
                                      {relatedTerm}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-gray-600 bg-white rounded-lg shadow-sm border border-teal-100 p-6">
          <BookOpen className="h-8 w-8 text-teal-600 mx-auto mb-3" />
          <p className="mb-2">
            This glossary is continuously updated with new terms and expanded definitions.
          </p>
          <p className="text-teal-600 font-medium">
            Have a term suggestion? Contact us to help expand this resource!
          </p>
        </div>
      </div>
    </div>
  );
}
