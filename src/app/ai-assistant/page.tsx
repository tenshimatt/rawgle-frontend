'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Bot, User, Loader2, Trash2, Copy, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

interface Pet {
  id: string;
  name: string;
  species: 'dog' | 'cat';
  breed: string;
  weight: number;
  birthdate: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

// Suggested starter questions
const STARTER_QUESTIONS = [
  "How much raw food should I feed my 50lb dog?",
  "What are the benefits of raw feeding?",
  "How do I transition my cat to raw food?",
  "What supplements do raw-fed pets need?"
];

export default function AIAssistantPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [ratedMessages, setRatedMessages] = useState<Record<string, 'up' | 'down'>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  // Fetch user's pets
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

  // Load chat history from localStorage
  const loadChatHistory = (): Message[] => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('rawgle-chat-history');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
    return [];
  };

  // Save chat history to localStorage
  const saveChatHistory = (messages: Message[]) => {
    if (typeof window === 'undefined') return;
    try {
      // Keep only last 10 messages for context
      const recentMessages = messages.slice(-10);
      localStorage.setItem('rawgle-chat-history', JSON.stringify(recentMessages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, setMessages } = useChat({
    api: '/api/chat',
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
    onFinish: () => {
      scrollToBottom();
    },
  });

  // Save messages whenever they change
  useEffect(() => {
    if (messages.length > 1) {
      saveChatHistory(messages);
    }
  }, [messages]);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Clear chat history
  const handleClearChat = () => {
    if (confirm('Are you sure you want to clear the chat history?')) {
      localStorage.removeItem('rawgle-chat-history');
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: getGreetingMessage()
        }
      ]);
    }
  };

  // Copy message to clipboard
  const handleCopyMessage = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  // Rate message (thumbs up/down)
  const handleRateMessage = (messageId: string, rating: 'up' | 'down') => {
    setRatedMessages(prev => ({
      ...prev,
      [messageId]: rating
    }));

    // Here you could send feedback to analytics/backend
    console.log(`Message ${messageId} rated: ${rating}`);
  };

  // Handle suggested question click
  const handleSuggestedQuestion = (question: string) => {
    handleInputChange({ target: { value: question } } as any);
  };

  return (
    <div className="min-h-screen page-gradient">
      <div className="container-page py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Bot className="h-12 w-12 text-persian-green-500" />
              <h1 className="text-4xl font-bold text-charcoal-500">Dr. Raw</h1>
            </div>
            <p className="text-lg text-charcoal-400">
              Your 24/7 Veterinary Nutritionist - Expert raw feeding advice for dogs and cats
            </p>
          </div>

          {/* Pet Context Display */}
          {pets.length > 0 && (
            <div className="mb-4 p-4 bg-persian-green-50 border-2 border-persian-green-200 rounded-lg">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Bot className="h-5 w-5 text-persian-green-600" />
                <span className="font-semibold text-charcoal-600">Dr. Raw knows about:</span>
                {pets.map((pet) => (
                  <span
                    key={pet.id}
                    className="px-3 py-1 bg-white rounded-full border border-persian-green-300 text-charcoal-600 font-medium"
                  >
                    {pet.name} ({pet.species}, {pet.weight}lbs)
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Main Chat Card */}
          <Card className="shadow-lg border-2 border-charcoal-200 mb-6">
            <CardContent className="p-6">
              {/* Messages Container */}
              <div
                ref={chatContainerRef}
                className="space-y-4 mb-4 h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-persian-green-300 scrollbar-track-gray-100 pr-2"
              >
                {messages.length === 1 && messages[0].role === 'assistant' && (
                  <div className="text-center py-8">
                    <MessageSquare className="h-16 w-16 text-persian-green-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-charcoal-600 mb-2">
                      Welcome to Dr. Raw's Office
                    </h3>
                    <p className="text-charcoal-400 mb-6">
                      Ask me anything about raw feeding, nutrition, and pet health
                    </p>
                  </div>
                )}

                {messages.map((msg, idx) => (
                  <div
                    key={msg.id || idx}
                    className={`flex gap-3 animate-fade-in ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-persian-green-100 flex items-center justify-center">
                          <Bot className="h-6 w-6 text-persian-green-600" />
                        </div>
                      </div>
                    )}

                    <div className={`max-w-[75%] ${msg.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                      <div
                        className={`p-4 rounded-2xl shadow-md ${
                          msg.role === 'user'
                            ? 'bg-persian-green-500 text-white rounded-tr-none'
                            : 'bg-white border-2 border-gray-100 rounded-tl-none'
                        }`}
                      >
                        <div
                          className="whitespace-pre-wrap break-words"
                          style={{ color: msg.role === 'user' ? '#ffffff' : '#182a32' }}
                        >
                          {msg.content}
                        </div>
                      </div>

                      {/* Message Actions (only for assistant messages) */}
                      {msg.role === 'assistant' && idx > 0 && (
                        <div className="flex gap-2 mt-2 ml-2">
                          <button
                            onClick={() => handleCopyMessage(msg.id, msg.content)}
                            className="p-1 rounded hover:bg-gray-100 transition-colors"
                            title="Copy message"
                          >
                            <Copy className={`h-4 w-4 ${
                              copiedMessageId === msg.id ? 'text-green-600' : 'text-gray-400'
                            }`} />
                          </button>
                          <button
                            onClick={() => handleRateMessage(msg.id, 'up')}
                            className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                              ratedMessages[msg.id] === 'up' ? 'bg-green-50' : ''
                            }`}
                            title="Helpful"
                          >
                            <ThumbsUp className={`h-4 w-4 ${
                              ratedMessages[msg.id] === 'up' ? 'text-green-600' : 'text-gray-400'
                            }`} />
                          </button>
                          <button
                            onClick={() => handleRateMessage(msg.id, 'down')}
                            className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                              ratedMessages[msg.id] === 'down' ? 'bg-red-50' : ''
                            }`}
                            title="Not helpful"
                          >
                            <ThumbsDown className={`h-4 w-4 ${
                              ratedMessages[msg.id] === 'down' ? 'text-red-600' : 'text-gray-400'
                            }`} />
                          </button>
                        </div>
                      )}
                    </div>

                    {msg.role === 'user' && (
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-charcoal-500 flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isLoading && (
                  <div className="flex gap-3 animate-fade-in">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-persian-green-100 flex items-center justify-center">
                        <Bot className="h-6 w-6 text-persian-green-600" />
                      </div>
                    </div>
                    <div className="bg-white border-2 border-gray-100 rounded-2xl rounded-tl-none p-4 shadow-md">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-persian-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-persian-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-persian-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Display */}
                {error && (
                  <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-900 animate-fade-in">
                    <strong>Error:</strong> {error.message}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Questions (show only when chat is empty or just has greeting) */}
              {messages.length <= 1 && !isLoading && (
                <div className="mb-4 space-y-2">
                  <p className="text-sm font-medium text-charcoal-500 mb-2">Try asking:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {STARTER_QUESTIONS.map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestedQuestion(question)}
                        className="text-left p-3 text-sm bg-persian-green-50 hover:bg-persian-green-100 border border-persian-green-200 rounded-lg transition-colors text-charcoal-600"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask Dr. Raw about BARF diets, portions, transitioning, safety..."
                  className="flex-1 border-2 border-charcoal-200 focus:border-persian-green-500 rounded-lg px-4 py-3"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-persian-green-500 hover:bg-persian-green-600 text-white px-6 rounded-lg"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
                {messages.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClearChat}
                    className="border-2 border-charcoal-200 text-charcoal-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600 px-4 rounded-lg"
                    title="Clear chat"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-2 border-persian-green-200 hover:border-persian-green-400 transition-colors shadow-md">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 bg-persian-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="font-semibold mb-2 text-charcoal-700">Portion Calculator</h3>
                <p className="text-sm text-charcoal-500">Calculate ideal portions for your pet's weight and activity level</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-myrtle-green-200 hover:border-myrtle-green-400 transition-colors shadow-md">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 bg-myrtle-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="font-semibold mb-2 text-charcoal-700">Food Safety</h3>
                <p className="text-sm text-charcoal-500">Learn safe handling and storage practices for raw food</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-sandy-brown-200 hover:border-sandy-brown-400 transition-colors shadow-md">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 bg-sandy-brown-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="font-semibold mb-2 text-charcoal-700">Meal Planning</h3>
                <p className="text-sm text-charcoal-500">Get personalized meal plans and feeding schedules</p>
              </CardContent>
            </Card>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
            <p className="text-sm text-charcoal-600 text-center">
              <strong>Important:</strong> Dr. Raw provides educational information only.
              Always consult your veterinarian for serious health concerns or before making major dietary changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
