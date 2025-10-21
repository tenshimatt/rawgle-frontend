'use client';

import { useState } from 'react';
import { useChat } from 'ai/react';
import { MainNav } from '@/components/navigation/main-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Bot, User, Loader2, AlertCircle } from 'lucide-react';

export default function AIAssistantPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    initialMessages: [
      {
        id: '1',
        role: 'assistant',
        content: 'Hello! I\'m your AI pet nutrition assistant. Ask me anything about raw feeding, portion sizes, food safety, or meal planning!'
      }
    ],
    onError: (error) => {
      console.error('Chat error:', error);
      // Try to extract error message from response
      try {
        const errorData = JSON.parse(error.message);
        setErrorMessage(errorData.error || 'Failed to get response from AI assistant');
      } catch {
        setErrorMessage(error.message || 'Failed to get response from AI assistant');
      }
    },
    onResponse: () => {
      // Clear error on successful response
      setErrorMessage(null);
    }
  });

  return (
    <div className="min-h-screen page-gradient">
      <MainNav />

      <div className="container-page">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="hero-title">AI Pet Nutritionist</h1>
            <p className="hero-description">Get expert answers on raw pet nutrition 24/7</p>
          </div>

          <Card className="card-glass mb-4">
            <CardContent className="p-6">
              <div className="space-y-4 mb-4 h-96 overflow-y-auto scrollbar-thin">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && <Bot className="h-8 w-8 icon-primary flex-shrink-0" />}
                    <div className={`max-w-[80%] p-4 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-persian-green text-white'
                        : 'bg-white border-2 border-charcoal/10 text-charcoal'
                    }`}>
                      {msg.content}
                    </div>
                    {msg.role === 'user' && <User className="h-8 w-8 icon-primary flex-shrink-0" />}
                  </div>
                ))}
              </div>

              {errorMessage && (
                <div className="mb-4 p-4 bg-burnt-sienna/10 border-2 border-burnt-sienna/30 rounded-lg flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-burnt-sienna flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-burnt-sienna mb-1">Error</p>
                    <p className="text-sm text-charcoal">{errorMessage}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask about raw feeding, portions, safety..."
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
                <h3 className="font-semibold mb-2 text-charcoal">Portion Calculator</h3>
                <p className="text-sm text-muted">Calculate ideal portions for your pet</p>
              </CardContent>
            </Card>
            <Card className="card-feature-secondary">
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold mb-2 text-charcoal">Food Safety</h3>
                <p className="text-sm text-muted">Learn safe handling practices</p>
              </CardContent>
            </Card>
            <Card className="card-feature-accent">
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold mb-2 text-charcoal">Meal Planning</h3>
                <p className="text-sm text-muted">Get personalized meal plans</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
