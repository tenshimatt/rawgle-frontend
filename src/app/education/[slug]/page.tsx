'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Clock, User, Calendar, Tag, BookOpen, Share2 } from 'lucide-react';
import type { Article } from '@/data/articles';
import { getArticleBySlug } from '@/data/articles';

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [readProgress, setReadProgress] = useState(0);
  const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>([]);

  useEffect(() => {
    loadArticle();
  }, [slug]);

  useEffect(() => {
    // Extract table of contents from markdown
    if (article) {
      const headings: { id: string; text: string; level: number }[] = [];
      const lines = article.content.split('\n');
      lines.forEach((line) => {
        const match = line.match(/^(#{1,3})\s+(.+)$/);
        if (match) {
          const level = match[1].length;
          const text = match[2];
          const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
          headings.push({ id, text, level });
        }
      });
      setToc(headings);
    }

    // Reading progress scroll listener
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [article]);

  const loadArticle = () => {
    try {
      const foundArticle = getArticleBySlug(slug);
      setArticle(foundArticle || null);
    } catch (error) {
      console.error('Failed to load article:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen page-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-teal-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen page-gradient flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h1>
          <p className="text-muted mb-6">The article you're looking for doesn't exist.</p>
          <Link href="/education">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Education Hub
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-gradient">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-teal-600 transition-all duration-150"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* Back Button */}
      <div className="container mx-auto px-4 pt-8">
        <Link href="/education">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Button>
        </Link>
      </div>

      {/* Article Header */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-semibold px-3 py-1 bg-white/20 rounded">
                {article.category}
              </span>
              {article.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-white/10 rounded flex items-center gap-1"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {article.title}
            </h1>
            <p className="text-xl text-white/90 mb-6">
              {article.excerpt}
            </p>
            <div className="flex items-center gap-6 text-sm text-white/80">
              <span className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {article.author}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {article.readTime} min read
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(article.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content with Sidebar */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Table of Contents Sidebar */}
            {toc.length > 0 && (
              <div className="lg:col-span-1">
                <Card className="sticky top-20">
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-teal-600" />
                      Table of Contents
                    </h3>
                    <nav className="space-y-2">
                      {toc.map((heading) => (
                        <a
                          key={heading.id}
                          href={`#${heading.id}`}
                          className={`block text-sm hover:text-teal-600 transition-colors ${
                            heading.level === 1 ? 'font-semibold text-gray-900' :
                            heading.level === 2 ? 'pl-4 text-gray-700' :
                            'pl-8 text-gray-600'
                          }`}
                        >
                          {heading.text}
                        </a>
                      ))}
                    </nav>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Article Content */}
            <div className={toc.length > 0 ? 'lg:col-span-3' : 'lg:col-span-4'}>
              <Card className="p-8 md:p-12">
                <article className="prose prose-lg max-w-none
                  prose-headings:text-gray-900 prose-headings:font-bold
                  prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8
                  prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-6
                  prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-5
                  prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                  prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-gray-900 prose-strong:font-semibold
                  prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
                  prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
                  prose-li:text-gray-700 prose-li:mb-2
                  prose-blockquote:border-l-4 prose-blockquote:border-teal-600
                  prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
                  prose-code:text-teal-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded
                  prose-pre:bg-gray-900 prose-pre:text-gray-100
                ">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => {
                        const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                        return <h1 id={id}>{children}</h1>;
                      },
                      h2: ({ children }) => {
                        const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                        return <h2 id={id}>{children}</h2>;
                      },
                      h3: ({ children }) => {
                        const id = children?.toString().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                        return <h3 id={id}>{children}</h3>;
                      },
                    }}
                  >
                    {article.content}
                  </ReactMarkdown>
                </article>
              </Card>

              {/* Related Actions */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="card-feature-primary p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    Find Raw Food Suppliers
                  </h3>
                  <p className="text-sm text-muted mb-4">
                    Discover local suppliers in your area to start your raw feeding journey.
                  </p>
                  <Link href="/suppliers">
                    <Button className="btn-primary w-full">
                      Browse Suppliers
                    </Button>
                  </Link>
                </Card>

                <Card className="card-feature-accent p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    Ask Our AI Assistant
                  </h3>
                  <p className="text-sm text-muted mb-4">
                    Get personalized raw feeding advice from Dr. Raw, our AI nutritionist.
                  </p>
                  <Link href="/ai-assistant">
                    <Button className="btn-accent w-full">
                      Chat with Dr. Raw
                    </Button>
                  </Link>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
