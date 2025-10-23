'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, ShoppingBag, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Pet {
  id: string;
  name: string;
  species: 'dog' | 'cat';
  breed: string;
  weight: number;
  birthdate: string;
}

interface NutritionResults {
  dailyCalories: number;
  totalGrams: number;
  muscleMeat: number;
  bone: number;
  organ: number;
  vegetables: number;
  totalOunces: number;
  muscleMeatOz: number;
  boneOz: number;
  organOz: number;
  vegetablesOz: number;
}

export function NutritionCalculator() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'moderate' | 'active' | 'very_active'>('moderate');
  const [lifeStage, setLifeStage] = useState<'puppy' | 'kitten' | 'adult' | 'senior'>('adult');
  const [results, setResults] = useState<NutritionResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState<'grams' | 'ounces'>('ounces'); // Default to oz for USA

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch('/api/pets?active=true', {
          headers: { 'x-user-id': 'demo-user' },
        });
        const data = await response.json();
        if (data.success) {
          setPets(data.data || []);
          if (data.data.length > 0) {
            setSelectedPetId(data.data[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching pets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const activityMultipliers = {
    sedentary: 1.2,
    moderate: 1.4,
    active: 1.6,
    very_active: 1.8,
  };

  const lifeStageMultipliers = {
    puppy: 2.0,
    kitten: 2.5,
    adult: 1.0,
    senior: 0.8,
  };

  const calculateNutrition = () => {
    const pet = pets.find((p) => p.id === selectedPetId);
    if (!pet) return;

    // Convert lbs to kg
    const weightKg = pet.weight * 0.453592;

    // Calculate RER (Resting Energy Requirement)
    const rer = 70 * Math.pow(weightKg, 0.75);

    // Calculate DER (Daily Energy Requirement)
    const der = rer * activityMultipliers[activityLevel] * lifeStageMultipliers[lifeStage];

    // BARF diet targets 2-3% of body weight for adults
    // Adjust based on life stage
    let percentageOfBodyWeight = 0.02; // 2% for adults

    if (lifeStage === 'puppy' || lifeStage === 'kitten') {
      percentageOfBodyWeight = 0.05; // 5% for growing animals
    } else if (lifeStage === 'senior') {
      percentageOfBodyWeight = 0.015; // 1.5% for seniors
    }

    // Adjust for activity level
    if (activityLevel === 'very_active') {
      percentageOfBodyWeight *= 1.2;
    } else if (activityLevel === 'active') {
      percentageOfBodyWeight *= 1.1;
    } else if (activityLevel === 'sedentary') {
      percentageOfBodyWeight *= 0.9;
    }

    // Total daily food in grams
    const totalGrams = Math.round(pet.weight * 453.592 * percentageOfBodyWeight);

    // BARF ratios differ by species
    // Dogs: 70% muscle meat, 10% bone, 10% organ, 10% vegetables
    // Cats: 80% muscle meat, 10% bone, 10% organ, 0% vegetables (obligate carnivores)
    const isDog = pet.species === 'dog';
    const muscleMeatPercent = isDog ? 0.70 : 0.80;
    const bonePercent = 0.10;
    const organPercent = 0.10;
    const vegetablePercent = isDog ? 0.10 : 0.00;

    const muscleMeat = Math.round(totalGrams * muscleMeatPercent);
    const bone = Math.round(totalGrams * bonePercent);
    const organ = Math.round(totalGrams * organPercent);
    const vegetables = Math.round(totalGrams * vegetablePercent);

    // Convert to ounces (1 oz = 28.35 grams)
    const totalOunces = Math.round((totalGrams / 28.35) * 10) / 10;
    const muscleMeatOz = Math.round((muscleMeat / 28.35) * 10) / 10;
    const boneOz = Math.round((bone / 28.35) * 10) / 10;
    const organOz = Math.round((organ / 28.35) * 10) / 10;
    const vegetablesOz = Math.round((vegetables / 28.35) * 10) / 10;

    setResults({
      dailyCalories: Math.round(der),
      totalGrams,
      muscleMeat,
      bone,
      organ,
      vegetables,
      totalOunces,
      muscleMeatOz,
      boneOz,
      organOz,
      vegetablesOz,
    });
  };

  const selectedPet = pets.find((p) => p.id === selectedPetId);

  if (loading) {
    return (
      <Card className="card-feature-secondary">
        <CardContent className="py-8 text-center">
          <p className="text-muted">Loading pets...</p>
        </CardContent>
      </Card>
    );
  }

  if (pets.length === 0) {
    return (
      <Card className="card-feature-secondary">
        <CardContent className="py-8 text-center">
          <Calculator className="h-12 w-12 mx-auto mb-3 icon-muted" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pets Found</h3>
          <p className="text-sm text-muted">Add a pet to use the nutrition calculator</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-feature-secondary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 icon-secondary" />
          BARF Nutrition Calculator
        </CardTitle>
        <p className="text-sm text-muted mt-1">
          Calculate ideal raw food portions based on weight, activity, and life stage
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Unit Switcher */}
        <div className="flex items-center justify-between p-3 bg-seasalt rounded-lg border-2 border-gray-900/10">
          <Label className="text-gray-900 font-semibold text-sm">Measurement Units</Label>
          <div className="flex gap-2">
            <Button
              onClick={() => setUnit('ounces')}
              variant={unit === 'ounces' ? 'default' : 'outline'}
              size="sm"
              className={unit === 'ounces' ? 'btn-secondary' : 'btn-outline'}
            >
              oz (Imperial)
            </Button>
            <Button
              onClick={() => setUnit('grams')}
              variant={unit === 'grams' ? 'default' : 'outline'}
              size="sm"
              className={unit === 'grams' ? 'btn-secondary' : 'btn-outline'}
            >
              g (Metric)
            </Button>
          </div>
        </div>

        {/* Pet Selection */}
        <div>
          <Label className="text-gray-900 font-semibold mb-2">Select Pet</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {pets.map((pet) => (
              <Button
                key={pet.id}
                onClick={() => setSelectedPetId(pet.id)}
                variant={selectedPetId === pet.id ? 'default' : 'outline'}
                className={selectedPetId === pet.id ? 'btn-secondary' : 'btn-outline'}
              >
                {pet.name} ({pet.weight}lbs)
              </Button>
            ))}
          </div>
        </div>

        {/* Activity Level */}
        <div>
          <Label className="text-gray-900 font-semibold mb-2">Activity Level</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
            {(['sedentary', 'moderate', 'active', 'very_active'] as const).map((level) => (
              <Button
                key={level}
                onClick={() => setActivityLevel(level)}
                variant={activityLevel === level ? 'default' : 'outline'}
                size="sm"
                className={activityLevel === level ? 'btn-primary' : 'btn-outline'}
              >
                {level.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </Button>
            ))}
          </div>
        </div>

        {/* Life Stage */}
        <div>
          <Label className="text-gray-900 font-semibold mb-2">Life Stage</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
            {selectedPet?.species === 'dog' && (
              <>
                <Button
                  onClick={() => setLifeStage('puppy')}
                  variant={lifeStage === 'puppy' ? 'default' : 'outline'}
                  size="sm"
                  className={lifeStage === 'puppy' ? 'btn-accent' : 'btn-outline'}
                >
                  Puppy
                </Button>
                <Button
                  onClick={() => setLifeStage('adult')}
                  variant={lifeStage === 'adult' ? 'default' : 'outline'}
                  size="sm"
                  className={lifeStage === 'adult' ? 'btn-accent' : 'btn-outline'}
                >
                  Adult
                </Button>
                <Button
                  onClick={() => setLifeStage('senior')}
                  variant={lifeStage === 'senior' ? 'default' : 'outline'}
                  size="sm"
                  className={lifeStage === 'senior' ? 'btn-accent' : 'btn-outline'}
                >
                  Senior
                </Button>
              </>
            )}
            {selectedPet?.species === 'cat' && (
              <>
                <Button
                  onClick={() => setLifeStage('kitten')}
                  variant={lifeStage === 'kitten' ? 'default' : 'outline'}
                  size="sm"
                  className={lifeStage === 'kitten' ? 'btn-accent' : 'btn-outline'}
                >
                  Kitten
                </Button>
                <Button
                  onClick={() => setLifeStage('adult')}
                  variant={lifeStage === 'adult' ? 'default' : 'outline'}
                  size="sm"
                  className={lifeStage === 'adult' ? 'btn-accent' : 'btn-outline'}
                >
                  Adult
                </Button>
                <Button
                  onClick={() => setLifeStage('senior')}
                  variant={lifeStage === 'senior' ? 'default' : 'outline'}
                  size="sm"
                  className={lifeStage === 'senior' ? 'btn-accent' : 'btn-outline'}
                >
                  Senior
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Calculate Button */}
        <Button onClick={calculateNutrition} className="btn-secondary w-full">
          <Calculator className="h-4 w-4 mr-2" />
          Calculate Daily Portions
        </Button>

        {/* Results */}
        {results && selectedPet && (
          <div className="space-y-4 pt-4 border-t-2 border-gray-900/10">
            <div className="flex items-start gap-2 bg-teal-600/10 p-3 rounded-lg border-2 border-teal-600/30">
              <Info className="h-5 w-5 icon-secondary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Daily food for {selectedPet.name}
                </p>
                <p className="text-xs text-muted">
                  {selectedPet.species === 'dog' ? 'Dog' : 'Cat'} • {selectedPet.weight}lbs • {activityLevel.replace('_', ' ')} • {lifeStage}
                </p>
              </div>
            </div>

            {/* Total Daily Amount */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-maize/20 border-2 border-maize/30 rounded-lg">
                <p className="text-xs text-gray-900 font-medium mb-1">Total Daily</p>
                {unit === 'grams' ? (
                  <>
                    <p className="text-2xl font-bold text-gray-900">{results.totalGrams}g</p>
                    <p className="text-sm text-gray-900 font-medium">({results.totalOunces}oz)</p>
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-gray-900">{results.totalOunces}oz</p>
                    <p className="text-sm text-gray-900 font-medium">({results.totalGrams}g)</p>
                  </>
                )}
              </div>
              <div className="p-4 bg-orange-500/20 border-2 border-orange-500/30 rounded-lg">
                <p className="text-xs text-gray-900 font-medium mb-1">Daily Calories</p>
                <p className="text-2xl font-bold text-gray-900">{results.dailyCalories}</p>
                <p className="text-sm text-gray-900 font-medium">kcal</p>
              </div>
            </div>

            {/* BARF Breakdown */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                BARF Daily Breakdown
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-900/10">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-burnt-sienna/20 border-burnt-sienna/30">
                      {selectedPet.species === 'dog' ? '70%' : '80%'}
                    </Badge>
                    <span className="text-sm font-medium text-gray-900">Muscle Meat</span>
                  </div>
                  <div className="text-right">
                    {unit === 'grams' ? (
                      <>
                        <p className="text-sm font-bold text-gray-900">{results.muscleMeat}g</p>
                        <p className="text-xs text-gray-700">({results.muscleMeatOz}oz)</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-bold text-gray-900">{results.muscleMeatOz}oz</p>
                        <p className="text-xs text-gray-700">({results.muscleMeat}g)</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-900/10">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-gray-900/20 border-gray-900/30">
                      10%
                    </Badge>
                    <span className="text-sm font-medium text-gray-900">Raw Meaty Bones</span>
                  </div>
                  <div className="text-right">
                    {unit === 'grams' ? (
                      <>
                        <p className="text-sm font-bold text-gray-900">{results.bone}g</p>
                        <p className="text-xs text-gray-700">({results.boneOz}oz)</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-bold text-gray-900">{results.boneOz}oz</p>
                        <p className="text-xs text-gray-700">({results.bone}g)</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-900/10">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-orange-500/20 border-orange-500/30">
                      10%
                    </Badge>
                    <span className="text-sm font-medium text-gray-900">Organ Meat</span>
                  </div>
                  <div className="text-right">
                    {unit === 'grams' ? (
                      <>
                        <p className="text-sm font-bold text-gray-900">{results.organ}g</p>
                        <p className="text-xs text-gray-700">({results.organOz}oz)</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-bold text-gray-900">{results.organOz}oz</p>
                        <p className="text-xs text-gray-700">({results.organ}g)</p>
                      </>
                    )}
                  </div>
                </div>

                {selectedPet.species === 'dog' && (
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-900/10">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-teal-600/20 border-teal-600/30">
                        10%
                      </Badge>
                      <span className="text-sm font-medium text-gray-900">Vegetables</span>
                    </div>
                    <div className="text-right">
                      {unit === 'grams' ? (
                        <>
                          <p className="text-sm font-bold text-gray-900">{results.vegetables}g</p>
                          <p className="text-xs text-gray-700">({results.vegetablesOz}oz)</p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-bold text-gray-900">{results.vegetablesOz}oz</p>
                          <p className="text-xs text-gray-700">({results.vegetables}g)</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Shopping Tips */}
            <div className="bg-seasalt p-4 rounded-lg border-2 border-gray-900/10">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">Shopping List Tips</h4>
              <ul className="space-y-1 text-xs text-gray-900">
                <li>• Muscle Meat: Chicken, beef, turkey, lamb, or fish</li>
                <li>• Bones: Chicken necks, wings, or beef ribs</li>
                <li>• Organs: Liver (5%), kidney/spleen (5%)</li>
                {selectedPet.species === 'dog' && (
                  <li>• Veggies: Blended leafy greens, carrots, broccoli</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
