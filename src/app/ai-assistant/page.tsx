'use client';

import { useState } from 'react';
import { MainNav } from '@/components/navigation/main-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Bot, User } from 'lucide-react';

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AI pet nutrition assistant. Ask me anything about raw feeding, portion sizes, food safety, or meal planning!' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([...messages,
      { role: 'user', content: input },
      { role: 'assistant', content: 'This is a demo response. The AI will be connected soon! Your question was: ' + input }
    ]);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
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
                    {msg.role === 'assistant' && <Bot className="h-8 w-8 text-blue-500 flex-shrink-0" />}
                    <div className={`max-w-[80%] p-4 rounded-lg ${
                      msg.role === 'user' ? 'bg-orange-500 text-white' : 'bg-gray-100'
                    }`}>
                      {msg.content}
                    </div>
                    {msg.role === 'user' && <User className="h-8 w-8 text-orange-500 flex-shrink-0" />}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about raw feeding, portions, safety..."
                  className="flex-1"
                />
                <Button onClick={handleSend} className="bg-blue-500 hover:bg-blue-600">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
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
