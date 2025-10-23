'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { blogArticles, blogCategories } from '@/data/blog/articles';
import { Search, Clock, User, Calendar, Tag } from 'lucide-react';

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get all unique tags from articles
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    blogArticles.forEach(article => {
      article.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  // Filter articles based on search and filters
  const filteredArticles = useMemo(() => {
    return blogArticles.filter(article => {
      const matchesSearch = searchQuery === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = !selectedCategory || article.category === selectedCategory;
      const matchesTag = !selectedTag || article.tags.includes(selectedTag);

      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [searchQuery, selectedCategory, selectedTag]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedTag(null);
  };

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== null || selectedTag !== null;

  return (
    <div className="min-h-screen page-gradient">
      
      <div className="container-page">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="hero-title">Raw Feeding Education</h1>
            <p className="hero-description">
              Expert articles written by veterinarians and raw feeding professionals
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-6">
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-900/50" />
              <Input
                type="text"
                placeholder="Search articles by title, content, or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-base pl-10"
              />
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  All Categories
                </Button>
                {blogCategories.map(category => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="text-sm"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Popular Topics</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedTag === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(null)}
                >
                  All Topics
                </Button>
                {allTags.slice(0, 12).map(tag => (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTag(tag)}
                    className="text-sm capitalize"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>

            {/* Active Filters & Clear Button */}
            {hasActiveFilters && (
              <div className="flex items-center justify-between bg-teal-600/10 border border-teal-600/20 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm text-gray-900">
                  <span className="font-semibold">{filteredArticles.length}</span>
                  {filteredArticles.length === 1 ? 'article' : 'articles'} found
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-teal-600 hover:text-teal-600/80"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>

          {/* Featured Articles */}
          {!hasActiveFilters && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Articles</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {blogArticles
                  .filter(article => article.featured)
                  .slice(0, 2)
                  .map(article => {
                    const category = blogCategories.find(c => c.id === article.category);
                    return (
                      <Link href={`/education/blog/${article.slug}`} key={article.slug}>
                        <Card className="card-feature-primary p-6 h-full hover:shadow-lg transition-shadow cursor-pointer">
                          <div className="flex items-start gap-2 mb-3">
                            {category && (
                              <span className="px-3 py-1 bg-teal-600/20 text-teal-600 text-xs font-semibold rounded-full">
                                {category.name}
                              </span>
                            )}
                            <span className="px-3 py-1 bg-orange-500/20 text-orange-500 text-xs font-semibold rounded-full">
                              Featured
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-teal-600 transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-gray-900/70 mb-4 line-clamp-2">
                            {article.excerpt}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-900/60">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>{article.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(article.publishedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{article.readTime} min read</span>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
              </div>
            </div>
          )}

          {/* All Articles */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {hasActiveFilters ? 'Search Results' : 'All Articles'}
            </h2>

            {filteredArticles.length === 0 ? (
              <Card className="card-feature-primary p-12 text-center">
                <p className="text-gray-900/60 text-lg">
                  No articles found matching your criteria.
                </p>
                <Button
                  variant="default"
                  onClick={clearFilters}
                  className="mt-4"
                >
                  Clear filters
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles
                  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
                  .map(article => {
                    const category = blogCategories.find(c => c.id === article.category);
                    return (
                      <Link href={`/education/blog/${article.slug}`} key={article.slug}>
                        <Card className="card-feature-primary p-6 h-full hover:shadow-lg transition-shadow cursor-pointer">
                          {category && (
                            <span className="inline-block px-3 py-1 bg-teal-600/20 text-teal-600 text-xs font-semibold rounded-full mb-3">
                              {category.name}
                            </span>
                          )}
                          <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-teal-600 transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-gray-900/70 text-sm mb-4 line-clamp-3">
                            {article.excerpt}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-4">
                            {article.tags.slice(0, 3).map(tag => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-teal-700/10 text-teal-700 text-xs rounded"
                              >
                                <Tag className="h-3 w-3" />
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-900/60 border-t border-gray-900/10 pt-4">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span className="line-clamp-1">{article.author.split(',')[0]}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{article.readTime} min</span>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Category Overview */}
          {!hasActiveFilters && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {blogCategories.map(category => {
                  const articleCount = blogArticles.filter(a => a.category === category.id).length;
                  return (
                    <Card
                      key={category.id}
                      className="card-feature-secondary p-6 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{category.name}</h3>
                      <p className="text-sm text-gray-900/70 mb-3">{category.description}</p>
                      <p className="text-xs text-teal-600 font-semibold">
                        {articleCount} {articleCount === 1 ? 'article' : 'articles'}
                      </p>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
