'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Clock, Users, ChefHat, Loader2, ArrowLeft, Printer, AlertCircle, Award, Target
} from 'lucide-react';
import { SocialActions } from '@/components/community/social/social-actions';
import { StarRating, RatingDistribution } from '@/components/community/star-rating';
import { useToast } from '@/hooks/use-toast';

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  notes?: string;
}

interface NutritionInfo {
  protein: number;
  fat: number;
  carbs: number;
  calories: number;
}

interface Recipe {
  id: string;
  title: string;
  slug: string;
  description: string;
  author: { id: string; name: string; avatar: string; };
  petType: string;
  mealType: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: number;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  nutritionInfo: NutritionInfo;
  tags: string[];
  images: string[];
  ratings: {
    average: number;
    count: number;
  };
  saves: number;
  likes: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
}

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [review, setReview] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingsData, setRatingsData] = useState<any>(null);
  const [showRatingForm, setShowRatingForm] = useState(false);

  const fetchRatings = async () => {
    try {
      const response = await fetch(`/api/community/recipes/${params.id}/ratings`);
      const data = await response.json();
      if (data.success) {
        setRatingsData(data.data);
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

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
      fetchRatings();
    }
  }, [params.id]);

  const handleSubmitRating = async () => {
    if (userRating === 0) {
      toast({
        title: 'Please select a rating',
        description: 'Choose a star rating before submitting.',
        variant: 'destructive',
      });
      return;
    }

    setSubmittingRating(true);

    try {
      const response = await fetch(`/api/community/recipes/${params.id}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user',
        },
        body: JSON.stringify({ rating: userRating, review }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }

      toast({
        title: 'Rating submitted!',
        description: 'Thank you for your feedback.',
      });

      setUserRating(0);
      setReview('');
      setShowRatingForm(false);
      fetchRatings();

      // Refresh recipe to get updated average
      const recipeResponse = await fetch(`/api/community/recipes/${params.id}`);
      const recipeData = await recipeResponse.json();
      if (recipeData.success) {
        setRecipe(recipeData.data);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit rating. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmittingRating(false);
    }
  };

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

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      hard: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[difficulty as keyof typeof colors] || colors.easy;
  };

  const getPetTypeLabel = (petType: string) => {
    return petType === 'both' ? 'Dogs & Cats' : petType === 'dog' ? 'Dogs' : 'Cats';
  };

  if (loading) {
    return (
      <div className="min-h-screen page-gradient">
        
        <div className="container-page flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin icon-primary" />
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen page-gradient">
        
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
      <div className="container-page">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.push('/community/recipes')}
            className="mb-6 text-muted hover:text-teal-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Recipes
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="card-feature-primary">
                <CardContent className="p-0">
                  {/* Photo Gallery */}
                  {recipe.images && recipe.images.length > 0 && (
                    <div className="mb-6">
                      <div className="relative h-96 w-full overflow-hidden rounded-t-lg">
                        <img
                          src={recipe.images[selectedPhotoIndex]}
                          alt={recipe.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {recipe.images.length > 1 && (
                        <div className="flex gap-2 p-4 overflow-x-auto">
                          {recipe.images.map((photo, index) => (
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
                        <img
                          src={recipe.author.avatar}
                          alt={recipe.author.name}
                          className="h-12 w-12 rounded-full"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{recipe.author.name}</p>
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

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge className={getDifficultyBadge(recipe.difficulty)}>
                          {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
                        </Badge>
                        <Badge variant="outline">{getPetTypeLabel(recipe.petType)}</Badge>
                        <Badge variant="outline">{recipe.mealType}</Badge>
                      </div>

                      {/* Recipe Meta */}
                      <div className="flex items-center gap-6 text-muted">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          <span className="font-medium">{recipe.prepTime} min</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          <span className="font-medium">{recipe.servings} servings</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          <StarRating value={recipe.ratings.average} readonly showValue count={recipe.ratings.count} />
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    {recipe.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {recipe.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="bg-teal-50 text-teal-700">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <Separator />

                    {/* Ingredients */}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Ingredients</h2>
                      <ul className="space-y-2">
                        {recipe.ingredients.map((ingredient, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="h-6 w-6 bg-teal-600/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="h-2 w-2 bg-teal-600 rounded-full" />
                            </div>
                            <span className="text-gray-900">
                              <strong>{ingredient.amount} {ingredient.unit}</strong> {ingredient.name}
                              {ingredient.notes && <span className="text-muted"> ({ingredient.notes})</span>}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Separator />

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

                    <Separator />

                    {/* Social Actions */}
                    <SocialActions
                      itemId={recipe.id}
                      itemType="recipe"
                      title={recipe.title}
                      description={recipe.description}
                      initialLikes={recipe.likes}
                      initialLiked={false}
                      initialSaved={false}
                      initialComments={recipe.comments || 0}
                      showComments={true}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Nutrition Facts */}
              <Card className="card-feature-primary">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-teal-600" />
                    Nutrition Facts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="font-semibold">Per Serving</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Calories</span>
                      <span className="font-bold text-gray-900">{recipe.nutritionInfo.calories}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Protein</span>
                      <span className="font-semibold text-gray-900">{recipe.nutritionInfo.protein}g</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Fat</span>
                      <span className="font-semibold text-gray-900">{recipe.nutritionInfo.fat}g</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Carbs</span>
                      <span className="font-semibold text-gray-900">{recipe.nutritionInfo.carbs}g</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ratings & Reviews */}
              <Card className="card-feature-primary">
                <CardHeader>
                  <CardTitle>Ratings & Reviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-4">
                    <div className="text-5xl font-bold text-gray-900 mb-2">
                      {recipe.ratings.average.toFixed(1)}
                    </div>
                    <StarRating value={recipe.ratings.average} readonly size="lg" />
                    <p className="text-sm text-muted mt-2">{recipe.ratings.count} ratings</p>
                  </div>

                  {ratingsData && ratingsData.distribution && (
                    <>
                      <Separator />
                      <RatingDistribution
                        distribution={ratingsData.distribution}
                        total={ratingsData.count}
                      />
                    </>
                  )}

                  <Separator />

                  {!showRatingForm ? (
                    <Button
                      onClick={() => setShowRatingForm(true)}
                      className="w-full btn-secondary"
                    >
                      Write a Review
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <Label className="label-base mb-2 block">Your Rating</Label>
                        <StarRating value={userRating} onChange={setUserRating} size="lg" />
                      </div>
                      <div>
                        <Label className="label-base mb-2 block">Review (Optional)</Label>
                        <Textarea
                          value={review}
                          onChange={(e) => setReview(e.target.value)}
                          placeholder="Share your experience with this recipe..."
                          className="input-base min-h-[100px]"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowRatingForm(false);
                            setUserRating(0);
                            setReview('');
                          }}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSubmitRating}
                          disabled={submittingRating}
                          className="flex-1 btn-secondary"
                        >
                          {submittingRating ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            'Submit'
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Safety Notice */}
              <Card className="card-feature-primary bg-amber-50 border-amber-200">
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-gray-900 mb-1">Safety Reminder</p>
                      <p className="text-gray-700">
                        Always consult with your veterinarian before making significant changes to your pet's diet.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
