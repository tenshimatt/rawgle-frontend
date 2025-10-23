import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MainNav } from '@/components/navigation/main-nav';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { blogArticles, blogCategories } from '@/data/blog/articles';
import { Calendar, Clock, User, ArrowLeft, Tag, Share2 } from 'lucide-react';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return blogArticles.map(article => ({
    slug: article.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const article = blogArticles.find(a => a.slug === slug);

  if (!article) {
    notFound();
  }

  const category = blogCategories.find(c => c.id === article.category);

  // Get related articles (same category, excluding current)
  const relatedArticles = blogArticles
    .filter(a => a.category === article.category && a.slug !== article.slug)
    .slice(0, 3);

  // Format the date
  const publishedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen page-gradient">
      <MainNav />
      <div className="container-page">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/education/blog">
            <Button variant="ghost" className="mb-6 -ml-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Articles
            </Button>
          </Link>

          {/* Article Header */}
          <article className="mb-12">
            <Card className="card-feature-primary p-8 md:p-12">
              {/* Category Badge */}
              {category && (
                <div className="mb-4">
                  <Link href={`/education/blog?category=${category.id}`}>
                    <span className="inline-block px-4 py-2 bg-teal-600/20 text-teal-600 text-sm font-semibold rounded-full hover:bg-teal-600/30 transition-colors">
                      {category.name}
                    </span>
                  </Link>
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {article.title}
              </h1>

              {/* Excerpt */}
              <p className="text-xl text-gray-900/70 mb-6 leading-relaxed">
                {article.excerpt}
              </p>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-900/60 border-t border-b border-gray-900/10 py-4 mb-8">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span className="font-medium">{article.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{publishedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{article.readTime} min read</span>
                </div>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: article.title,
                        text: article.excerpt,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }
                  }}
                  className="flex items-center gap-2 text-teal-600 hover:text-teal-600/80 transition-colors ml-auto"
                >
                  <Share2 className="h-5 w-5" />
                  <span>Share</span>
                </button>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {article.tags.map(tag => (
                  <Link key={tag} href={`/education/blog?tag=${tag}`}>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-700/10 text-teal-700 text-sm rounded-full hover:bg-teal-700/20 transition-colors">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  </Link>
                ))}
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                <div
                  className="article-content text-gray-900 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: article.content
                      .split('\n')
                      .map(line => {
                        // Convert markdown-style headers
                        if (line.startsWith('# ')) return `<h1 class="text-3xl font-bold mt-8 mb-4">${line.substring(2)}</h1>`;
                        if (line.startsWith('## ')) return `<h2 class="text-2xl font-bold mt-6 mb-3">${line.substring(3)}</h2>`;
                        if (line.startsWith('### ')) return `<h3 class="text-xl font-bold mt-4 mb-2">${line.substring(4)}</h3>`;

                        // Convert markdown-style bold
                        line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>');

                        // Convert markdown-style lists
                        if (line.startsWith('- ')) return `<li class="ml-6 mb-2">${line.substring(2)}</li>`;

                        // Empty lines
                        if (line.trim() === '') return '<br/>';

                        // Regular paragraphs
                        if (!line.startsWith('<')) return `<p class="mb-4">${line}</p>`;

                        return line;
                      })
                      .join('\n')
                  }}
                />
              </div>

              {/* Author Bio */}
              <div className="mt-12 pt-8 border-t border-gray-900/10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-teal-600/20 flex items-center justify-center">
                    <User className="h-8 w-8 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 mb-1">About the Author</h4>
                    <p className="text-gray-900/70">{article.author}</p>
                  </div>
                </div>
              </div>
            </Card>
          </article>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map(related => {
                  const relatedCategory = blogCategories.find(c => c.id === related.category);
                  return (
                    <Link href={`/education/blog/${related.slug}`} key={related.slug}>
                      <Card className="card-feature-secondary p-6 h-full hover:shadow-lg transition-shadow cursor-pointer">
                        {relatedCategory && (
                          <span className="inline-block px-3 py-1 bg-teal-600/20 text-teal-600 text-xs font-semibold rounded-full mb-3">
                            {relatedCategory.name}
                          </span>
                        )}
                        <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-teal-600 transition-colors line-clamp-2">
                          {related.title}
                        </h3>
                        <p className="text-sm text-gray-900/70 mb-3 line-clamp-2">
                          {related.excerpt}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-900/60">
                          <Clock className="h-3 w-3" />
                          <span>{related.readTime} min read</span>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* CTA Section */}
          <Card className="card-feature-primary p-8 text-center bg-gradient-to-br from-teal-600/10 to-teal-700/10 border-teal-600/20">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Start Raw Feeding?</h3>
            <p className="text-gray-900/70 mb-6 max-w-2xl mx-auto">
              Join thousands of pet owners who have transformed their pets' health through species-appropriate raw nutrition.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/pets/new">
                <Button variant="default" size="lg">
                  Add Your Pet
                </Button>
              </Link>
              <Link href="/community">
                <Button variant="outline" size="lg">
                  Join Community
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
