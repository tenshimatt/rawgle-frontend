'use client';

import { useState } from 'react';
import { useChat } from 'ai/react';
import { MainNav } from '@/components/navigation/main-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Bot, User, Loader2 } from 'lucide-react';

export default function AIAssistantPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    initialMessages: [
      {
        id: '1',
        role: 'assistant',
        content: 'Hello! I\'m your AI pet nutrition assistant. Ask me anything about raw feeding, portion sizes, food safety, or meal planning!'
      }
    ]
  });

  return (
    <div className="min-h-screen bg-gradient-to-b gradient-hero">
      <MainNav />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">AI Pet Nutritionist</h1>
            <p className="text-gray-600">Get expert answers on raw pet nutrition 24/7</p>
          </div>

          <Card className="mb-4">
            <CardContent className="p-6">
              <div className="space-y-4 mb-4 h-96 overflow-y-auto">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && <Bot className="h-8 w-8 text-persian-green flex-shrink-0" />}
                    <div className={`max-w-[80%] p-4 rounded-lg ${
                      msg.role === 'user' ? 'bg-orange-500 text-white' : 'bg-gray-100'
                    }`}>
                      {msg.content}
                    </div>
                    {msg.role === 'user' && <User className="h-8 w-8 text-orange-500 flex-shrink-0" />}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask about raw feeding, portions, safety..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  className="bg-persian-green hover:bg-persian-green-600"
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
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold mb-2">Portion Calculator</h3>
                <p className="text-sm text-gray-600">Calculate ideal portions for your pet</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold mb-2">Food Safety</h3>
                <p className="text-sm text-gray-600">Learn safe handling practices</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold mb-2">Meal Planning</h3>
                <p className="text-sm text-gray-600">Get personalized meal plans</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
