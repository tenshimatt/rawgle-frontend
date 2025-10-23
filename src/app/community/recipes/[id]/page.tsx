'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainNav } from '@/components/navigation/main-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, ChefHat, Loader2, ArrowLeft, Printer } from 'lucide-react';
import { SocialActions } from '@/components/community/social/social-actions';

interface Recipe {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  photos?: string[];
  prepTime: string;
  servings: string;
  likes: number;
  saves: number;
  liked?: boolean;
  saved?: boolean;
  comments?: number;
  createdAt: string;
}

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/community/recipes/${params.id}`, {
          headers: { 'x-user-id': 'demo-user' },
        });
        const data = await response.json();
        if (data.success) {
          setRecipe(data.data);
        } else {
          console.error('Recipe not found');
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchRecipe();
    }
  }, [params.id]);

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen page-gradient">
        <MainNav />
        <div className="container-page flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin icon-primary" />
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen page-gradient">
        <MainNav />
        <div className="container-page">
          <div className="max-w-4xl mx-auto text-center py-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Recipe Not Found</h1>
            <p className="text-muted mb-6">The recipe you're looking for doesn't exist.</p>
            <Button onClick={() => router.push('/community/recipes')} className="btn-secondary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Recipes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-gradient">
      <MainNav />

      <div className="container-page">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.push('/community/recipes')}
            className="mb-6 text-muted hover:text-teal-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Recipes
          </Button>

          <Card className="card-feature-primary">
            <CardContent className="p-0">
              {/* Photo Gallery */}
              {recipe.photos && recipe.photos.length > 0 && (
                <div className="mb-6">
                  <div className="relative h-96 w-full overflow-hidden rounded-t-lg">
                    <img
                      src={recipe.photos[selectedPhotoIndex]}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {recipe.photos.length > 1 && (
                    <div className="flex gap-2 p-4 overflow-x-auto">
                      {recipe.photos.map((photo, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedPhotoIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            selectedPhotoIndex === index
                              ? 'border-teal-600'
                              : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={photo}
                            alt={`${recipe.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="p-6 space-y-6">
                {/* Header */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 bg-teal-600 rounded-full flex items-center justify-center text-gray-900 font-bold">
                      {recipe.userName[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{recipe.userName}</p>
                      <p className="text-sm text-muted">{formatTimestamp(recipe.createdAt)}</p>
                    </div>
                    <div className="flex-1" />
                    <Button variant="outline" size="sm" onClick={handlePrint} className="btn-outline">
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                  </div>

                  <h1 className="text-3xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <ChefHat className="h-8 w-8 text-teal-600" />
                    {recipe.title}
                  </h1>
                  <p className="text-gray-900 mb-4">{recipe.description}</p>

                  {/* Recipe Meta */}
                  <div className="flex items-center gap-6 text-muted">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      <span className="font-medium">{recipe.prepTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      <span className="font-medium">{recipe.servings}</span>
                    </div>
                  </div>
                </div>

                {/* Ingredients */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Ingredients</h2>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="h-6 w-6 bg-teal-600/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="h-2 w-2 bg-teal-600 rounded-full" />
                        </div>
                        <span className="text-gray-900">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructions</h2>
                  <ol className="space-y-4">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <Badge
                            variant="outline"
                            className="bg-maize/20 border-maize/30 text-gray-900 font-bold w-8 h-8 rounded-full flex items-center justify-center"
                          >
                            {index + 1}
                          </Badge>
                        </div>
                        <p className="text-gray-900 pt-1 flex-1">{instruction}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Social Actions */}
                <div className="pt-6 border-t-2 border-gray-900/10">
                  <SocialActions
                    itemId={recipe.id}
                    itemType="recipe"
                    title={recipe.title}
                    description={recipe.description}
                    initialLikes={recipe.likes}
                    initialLiked={recipe.liked}
                    initialSaved={recipe.saved}
                    initialComments={recipe.comments || 0}
                    showComments={true}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
