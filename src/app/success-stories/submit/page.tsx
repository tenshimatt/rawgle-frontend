'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  Image as ImageIcon,
  PawPrint,
  Sparkles,
  Loader2,
} from 'lucide-react';

type FormData = {
  petName: string;
  petType: 'dog' | 'cat' | 'other';
  breed: string;
  age: string;
  ownerName: string;
  location: string;
  transformationType: string;
  timeframe: string;
  beforePhoto: string;
  afterPhoto: string;
  storyText: string;
  healthImprovements: string[];
  weightBefore: string;
  weightAfter: string;
};

export default function SubmitStoryPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    petName: '',
    petType: 'dog',
    breed: '',
    age: '',
    ownerName: '',
    location: '',
    transformationType: 'overall',
    timeframe: '3-months',
    beforePhoto: '',
    afterPhoto: '',
    storyText: '',
    healthImprovements: [],
    weightBefore: '',
    weightAfter: '',
  });

  const [improvementInput, setImprovementInput] = useState('');

  const totalSteps = 3;

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addHealthImprovement = () => {
    if (improvementInput.trim()) {
      updateFormData('healthImprovements', [...formData.healthImprovements, improvementInput.trim()]);
      setImprovementInput('');
    }
  };

  const removeHealthImprovement = (index: number) => {
    const newImprovements = formData.healthImprovements.filter((_, i) => i !== index);
    updateFormData('healthImprovements', newImprovements);
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.petName.trim() &&
          formData.breed.trim() &&
          formData.age.trim() &&
          formData.ownerName.trim() &&
          formData.location.trim()
        );
      case 2:
        return formData.beforePhoto && formData.afterPhoto;
      case 3:
        return formData.storyText.trim().length >= 50 && formData.healthImprovements.length > 0;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const submitData = {
        ...formData,
        age: parseInt(formData.age),
        weightBefore: formData.weightBefore ? parseFloat(formData.weightBefore) : undefined,
        weightAfter: formData.weightAfter ? parseFloat(formData.weightAfter) : undefined,
      };

      const response = await fetch('/api/success-stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/success-stories/${data.data.id}`);
      }
    } catch (error) {
      console.error('Error submitting story:', error);
      alert('Failed to submit story. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen page-gradient">
      <div className="container-page">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <Link href="/success-stories">
            <Button variant="ghost" className="btn-ghost mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Stories
            </Button>
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-teal-600" />
              <h1 className="text-4xl font-bold text-charcoal">
                Share Your <span className="text-gradient-brand">Success Story</span>
              </h1>
            </div>
            <p className="text-lg text-charcoal/80 max-w-2xl mx-auto">
              Inspire other pet parents by sharing your raw feeding transformation journey
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex-1 flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step < currentStep
                        ? 'bg-teal-600 text-white'
                        : step === currentStep
                        ? 'bg-teal-600 text-white ring-4 ring-teal-600/20'
                        : 'bg-seasalt text-charcoal/50'
                    }`}
                  >
                    {step < currentStep ? <Check className="h-5 w-5" /> : step}
                  </div>
                  {step < totalSteps && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        step < currentStep ? 'bg-teal-600' : 'bg-seasalt'
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm">
              <span className={currentStep >= 1 ? 'text-teal-600 font-medium' : 'text-charcoal/50'}>
                Pet Info
              </span>
              <span className={currentStep >= 2 ? 'text-teal-600 font-medium' : 'text-charcoal/50'}>
                Photos
              </span>
              <span className={currentStep >= 3 ? 'text-teal-600 font-medium' : 'text-charcoal/50'}>
                Story
              </span>
            </div>
          </div>

          {/* Form Content */}
          <Card className="card-feature-primary mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-charcoal">
                {currentStep === 1 && 'Step 1: Pet Information'}
                {currentStep === 2 && 'Step 2: Before & After Photos'}
                {currentStep === 3 && 'Step 3: Your Story'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Step 1: Pet Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="label-base">Pet's Name *</Label>
                      <Input
                        type="text"
                        value={formData.petName}
                        onChange={(e) => updateFormData('petName', e.target.value)}
                        placeholder="e.g., Max"
                        className="input-base"
                      />
                    </div>
                    <div>
                      <Label className="label-base">Pet Type *</Label>
                      <select
                        value={formData.petType}
                        onChange={(e) => updateFormData('petType', e.target.value)}
                        className="w-full px-3 py-2 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                      >
                        <option value="dog">Dog</option>
                        <option value="cat">Cat</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="label-base">Breed *</Label>
                      <Input
                        type="text"
                        value={formData.breed}
                        onChange={(e) => updateFormData('breed', e.target.value)}
                        placeholder="e.g., Golden Retriever"
                        className="input-base"
                      />
                    </div>
                    <div>
                      <Label className="label-base">Age (years) *</Label>
                      <Input
                        type="number"
                        value={formData.age}
                        onChange={(e) => updateFormData('age', e.target.value)}
                        placeholder="e.g., 5"
                        className="input-base"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="label-base">Your Name *</Label>
                      <Input
                        type="text"
                        value={formData.ownerName}
                        onChange={(e) => updateFormData('ownerName', e.target.value)}
                        placeholder="e.g., Sarah Johnson"
                        className="input-base"
                      />
                    </div>
                    <div>
                      <Label className="label-base">Location *</Label>
                      <Input
                        type="text"
                        value={formData.location}
                        onChange={(e) => updateFormData('location', e.target.value)}
                        placeholder="e.g., Portland, OR"
                        className="input-base"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="label-base">Transformation Type</Label>
                      <select
                        value={formData.transformationType}
                        onChange={(e) => updateFormData('transformationType', e.target.value)}
                        className="w-full px-3 py-2 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                      >
                        <option value="overall">Overall Health</option>
                        <option value="weight-loss">Weight Loss</option>
                        <option value="energy">Energy Boost</option>
                        <option value="coat-health">Coat Health</option>
                        <option value="digestive">Digestive Health</option>
                        <option value="allergies">Allergy Relief</option>
                        <option value="behavior">Behavior Improvement</option>
                      </select>
                    </div>
                    <div>
                      <Label className="label-base">Timeframe</Label>
                      <select
                        value={formData.timeframe}
                        onChange={(e) => updateFormData('timeframe', e.target.value)}
                        className="w-full px-3 py-2 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                      >
                        <option value="1-month">1 Month</option>
                        <option value="3-months">3 Months</option>
                        <option value="6-months">6 Months</option>
                        <option value="1-year">1 Year</option>
                        <option value="2-years+">2+ Years</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="label-base">Weight Before (lbs) - Optional</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.weightBefore}
                        onChange={(e) => updateFormData('weightBefore', e.target.value)}
                        placeholder="e.g., 95"
                        className="input-base"
                      />
                    </div>
                    <div>
                      <Label className="label-base">Weight After (lbs) - Optional</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.weightAfter}
                        onChange={(e) => updateFormData('weightAfter', e.target.value)}
                        placeholder="e.g., 75"
                        className="input-base"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Photos */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-maize/20 rounded-lg p-4 mb-6">
                    <p className="text-sm text-charcoal/80">
                      For this demo, please provide Unsplash image URLs. In production, you would upload actual photos.
                    </p>
                  </div>

                  <div>
                    <Label className="label-base">Before Photo URL *</Label>
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        value={formData.beforePhoto}
                        onChange={(e) => updateFormData('beforePhoto', e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="input-base flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="btn-outline flex-shrink-0"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                    {formData.beforePhoto && (
                      <div className="mt-4 relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={formData.beforePhoto}
                          alt="Before preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="label-base">After Photo URL *</Label>
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        value={formData.afterPhoto}
                        onChange={(e) => updateFormData('afterPhoto', e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="input-base flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="btn-outline flex-shrink-0"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                    {formData.afterPhoto && (
                      <div className="mt-4 relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={formData.afterPhoto}
                          alt="After preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="bg-teal-600/10 rounded-lg p-4">
                    <p className="text-sm text-charcoal/80 flex items-start gap-2">
                      <ImageIcon className="h-4 w-4 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span>
                        Tip: Clear, well-lit photos showing your pet's transformation work best. Side-by-side comparison helps others see the amazing changes!
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Story */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label className="label-base">Your Story * (minimum 50 characters)</Label>
                    <textarea
                      value={formData.storyText}
                      onChange={(e) => updateFormData('storyText', e.target.value)}
                      placeholder="Tell us about your pet's transformation journey. What were the challenges? What improvements did you see? How did raw feeding change your pet's life?"
                      rows={8}
                      className="w-full px-4 py-3 border border-charcoal/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 resize-none"
                    />
                    <p className="text-xs text-charcoal/50 mt-2">
                      {formData.storyText.length} / 50 characters minimum
                    </p>
                  </div>

                  <div>
                    <Label className="label-base">Health Improvements * (at least 1)</Label>
                    <div className="flex gap-2 mb-3">
                      <Input
                        type="text"
                        value={improvementInput}
                        onChange={(e) => setImprovementInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addHealthImprovement();
                          }
                        }}
                        placeholder="e.g., Lost 20 lbs"
                        className="input-base flex-1"
                      />
                      <Button
                        type="button"
                        onClick={addHealthImprovement}
                        className="btn-primary flex-shrink-0"
                      >
                        Add
                      </Button>
                    </div>

                    {formData.healthImprovements.length > 0 && (
                      <div className="space-y-2">
                        {formData.healthImprovements.map((improvement, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-seasalt rounded-lg px-4 py-3"
                          >
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-teal-600" />
                              <span className="text-sm text-charcoal">{improvement}</span>
                            </div>
                            <button
                              onClick={() => removeHealthImprovement(index)}
                              className="text-xs text-charcoal/50 hover:text-burnt-sienna"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-teal-600/10 rounded-lg p-4">
                    <p className="text-sm text-charcoal/80 flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span>
                        Be specific! Include details like weight changes, energy levels, coat improvements, digestive health, or behavioral changes. Your story will inspire others!
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mb-12">
            {currentStep > 1 ? (
              <Button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                variant="outline"
                className="btn-outline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            ) : (
              <div></div>
            )}

            {currentStep < totalSteps ? (
              <Button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                disabled={!canProceedToNextStep()}
                className="btn-primary"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceedToNextStep() || submitting}
                className="btn-primary"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <PawPrint className="mr-2 h-4 w-4" />
                    Submit Story
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
