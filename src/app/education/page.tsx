'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Clock, User, Search, ChevronRight, Star, Tag } from 'lucide-react';
import type { Article } from '@/data/articles';

const categories = [
  'All',
  'Getting Started',
  'Nutrition',
  'Safety',
  'Recipes',
  'Health',
  'Advanced'
];

export default function EducationPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [activeCategory, searchQuery, articles]);

  const loadArticles = async () => {
    try {
      const response = await fetch('/api/education');
      const data = await response.json();
      if (data.success) {
        setArticles(data.articles);
      }
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    let results = [...articles];

    // Filter by category
    if (activeCategory !== 'All') {
      results = results.filter(article => article.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredArticles(results);
  };

  const featuredArticles = articles.filter(article => article.featured).slice(0, 3);

  return (
    <div className="min-h-screen page-gradient">
      {/* Hero Section */}
      <div className="section-gradient-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Raw Feeding Education Hub
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Expert guides, scientific research, and practical advice for raw pet nutrition
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search articles, topics, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-base bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container-page">
        <div className="max-w-7xl mx-auto">

          {/* Featured Articles Carousel */}
          {featuredArticles.length > 0 && (
            <div className="mb-12">
              <h2 className="section-title mb-6">Featured Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredArticles.map((article) => (
                  <Card key={article.id} className="card-feature-accent overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
                    <div className="h-48 bg-gradient-to-br from-teal-600 to-teal-700 flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-white/80" />
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold px-2 py-1 bg-burnt-sienna/10 text-burnt-sienna rounded">
                          {article.category}
                        </span>
                        <Star className="h-4 w-4 fill-sandy-brown text-sandy-brown" />
                      </div>
                      <CardTitle className="text-xl group-hover:text-teal-600 transition-colors line-clamp-2">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted line-clamp-2 mb-4">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {article.readTime} min
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {article.author.split(',')[0]}
                          </span>
                        </div>
                      </div>
                      <Link href={`/education/${article.slug}`}>
                        <Button className="btn-accent w-full mt-4">
                          Read Article
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Category Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  variant={activeCategory === category ? 'default' : 'outline'}
                  className={activeCategory === category ? 'btn-primary' : ''}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {activeCategory === 'All' ? 'All Articles' : activeCategory}
              </h2>
              <span className="text-sm text-muted">
                {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
              </span>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin h-12 w-12 border-4 border-teal-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted">Loading articles...</p>
              </div>
            ) : filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <Card key={article.id} className="card-feature-primary overflow-hidden group cursor-pointer hover:shadow-lg transition-all">
                    <div className="h-40 bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-white/70" />
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold px-2 py-1 bg-teal-600/10 text-teal-600 rounded">
                          {article.category}
                        </span>
                      </div>
                      <CardTitle className="text-lg group-hover:text-teal-600 transition-colors line-clamp-2">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted line-clamp-3 mb-4">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap mb-4">
                        {article.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded flex items-center gap-1"
                          >
                            <Tag className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {article.readTime} min read
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {article.author.split(',')[0]}
                        </span>
                      </div>
                      <Link href={`/education/${article.slug}`}>
                        <Button variant="outline" className="w-full">
                          Read More
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No articles found
                </h3>
                <p className="text-muted mb-4">
                  Try adjusting your search or category filter
                </p>
                <Button onClick={() => { setSearchQuery(''); setActiveCategory('All'); }} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Raw Feeding?
            </h2>
            <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">
              Find local suppliers, connect with the community, and get personalized guidance from our AI assistant.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/suppliers">
                <Button size="lg" variant="secondary">
                  Find Suppliers Near You
                </Button>
              </Link>
              <Link href="/ai-assistant">
                <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white">
                  Ask AI Assistant
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
