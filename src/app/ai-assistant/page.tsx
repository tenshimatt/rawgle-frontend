'use client';

import { useState, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Bot, User, Loader2 } from 'lucide-react';

interface Pet {
  id: string;
  name: string;
  species: 'dog' | 'cat';
  breed: string;
  weight: number;
  birthdate: string;
}

export default function AIAssistantPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loadingPets, setLoadingPets] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch('/api/pets?active=true', {
          headers: { 'x-user-id': 'demo-user' },
        });
        const data = await response.json();
        if (data.success) {
          setPets(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching pets:', error);
      } finally {
        setLoadingPets(false);
      }
    };

    fetchPets();
  }, []);

  // Calculate age from birthdate
  const calculateAge = (birthdate: string) => {
    const birth = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Prepare pet context for AI
  const petContext = pets.map(pet => ({
    name: pet.name,
    species: pet.species,
    breed: pet.breed,
    weight: pet.weight,
    age: calculateAge(pet.birthdate),
  }));

  // Build greeting message based on pets
  const getGreetingMessage = () => {
    if (loadingPets) {
      return 'Hello! I\'m Dr. Raw, your veterinary nutritionist specializing in raw feeding for dogs and cats. Loading your pet information...';
    }

    if (pets.length === 0) {
      return 'Hello! I\'m Dr. Raw, your veterinary nutritionist specializing in raw feeding for dogs and cats. Whether you have questions about BARF diets, portion sizes, transitioning from kibble, or food safety, I\'m here to help. Do you have a dog or a cat?';
    }

    if (pets.length === 1) {
      const pet = pets[0];
      return `Hello! I\'m Dr. Raw, your veterinary nutritionist. I see you have ${pet.name}, your ${pet.breed} ${pet.species}. I\'m here to help with any questions about raw feeding, portion sizes, or nutrition for ${pet.name}. What would you like to know?`;
    }

    const petNames = pets.map(p => p.name).join(' and ');
    return `Hello! I\'m Dr. Raw, your veterinary nutritionist. I see you have ${petNames}! I\'m here to help with raw feeding questions for any of your pets. Which one would you like to discuss, or do you have a general question?`;
  };

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    body: {
      pets: petContext, // Send pet context with each message
    },
    initialMessages: [
      {
        id: '1',
        role: 'assistant',
        content: getGreetingMessage()
      }
    ],
  });

  return (
    <div className="min-h-screen page-gradient">
      

      <div className="container-page">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="hero-title">Dr. Raw - Veterinary Nutritionist</h1>
            <p className="hero-description">Expert raw feeding advice for dogs and cats, available 24/7</p>
          </div>

          {/* Pet Context Display */}
          {pets.length > 0 && (
            <div className="mb-4 p-4 bg-teal-600/10 border-2 border-teal-600/30 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-900">
                <Bot className="h-5 w-5 text-teal-600" />
                <span className="font-semibold">Dr. Raw knows about:</span>
                {pets.map((pet, index) => (
                  <span key={pet.id} className="px-2 py-1 bg-white rounded-md border border-teal-600/20">
                    {pet.name} ({pet.species}, {pet.weight}lbs)
                  </span>
                ))}
              </div>
            </div>
          )}

          <Card className="card-glass mb-4">
            <CardContent className="p-6">
              <div className="space-y-4 mb-4 h-96 overflow-y-auto scrollbar-thin">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && <Bot className="h-8 w-8 icon-primary flex-shrink-0" />}
                    <div className={`max-w-[80%] p-4 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-teal-600 text-white'
                        : 'bg-white border-2 border-gray-900/10 text-gray-900'
                    }`}>
                      {msg.content}
                    </div>
                    {msg.role === 'user' && <User className="h-8 w-8 icon-primary flex-shrink-0" />}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask Dr. Raw about BARF diets, portions, transitioning, safety..."
                  className="input-base flex-1"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  variant="default"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="card-feature-primary">
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold mb-2 text-gray-900">Portion Calculator</h3>
                <p className="text-sm text-muted">Calculate ideal portions for your pet</p>
              </CardContent>
            </Card>
            <Card className="card-feature-secondary">
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold mb-2 text-gray-900">Food Safety</h3>
                <p className="text-sm text-muted">Learn safe handling practices</p>
              </CardContent>
            </Card>
            <Card className="card-feature-accent">
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold mb-2 text-gray-900">Meal Planning</h3>
                <p className="text-sm text-muted">Get personalized meal plans</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
