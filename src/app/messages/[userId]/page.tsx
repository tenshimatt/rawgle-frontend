'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Send, Loader2, MoreVertical } from 'lucide-react';

// Message interface
interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

// Conversation interface
interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  const currentUserId = 'demo-user';

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Find conversation by userId
  const fetchConversation = async () => {
    try {
      // First get all conversations to find the one matching this userId
      const response = await fetch('/api/messages', {
        headers: { 'x-user-id': currentUserId },
      });
      const data = await response.json();
      const conversations: Conversation[] = data.data || [];

      const foundConversation = conversations.find(c => c.userId === userId);

      if (foundConversation) {
        // Fetch full conversation with messages
        const convResponse = await fetch(`/api/messages?conversationId=${foundConversation.id}`, {
          headers: { 'x-user-id': currentUserId },
        });
        const convData = await convResponse.json();
        setConversation(convData.data);
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversation();
  }, [userId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  // Send message
  const sendMessage = async () => {
    if (!messageInput.trim() || !conversation || sending) return;

    setSending(true);

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUserId,
        },
        body: JSON.stringify({
          conversationId: conversation.id,
          receiverId: conversation.userId,
          content: messageInput.trim(),
        }),
      });

      if (response.ok) {
        setMessageInput('');
        // Refresh conversation
        await fetchConversation();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  // Handle Enter key to send message
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Format timestamp
  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // For today, show time
    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }

    // For yesterday
    if (diffDays === 1) {
      return `Yesterday ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }

    // For this week, show day name
    if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' });
    }

    // Older messages show date
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="min-h-screen page-gradient flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin icon-primary" />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="min-h-screen page-gradient">
        <div className="container-page">
          <div className="max-w-4xl mx-auto text-center py-20">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Conversation not found</h2>
            <Button onClick={() => router.push('/messages')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Messages
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-gradient">
      <div className="container-page">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <Card className="card-feature-primary mb-4">
            <CardHeader className="p-4 border-b border-gray-900/10">
              <div className="flex items-center gap-4">
                {/* Back Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push('/messages')}
                  className="flex-shrink-0"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>

                {/* User Info */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-12 w-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                    {conversation.userAvatar || conversation.userName[0]}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg text-gray-900">
                      {conversation.userName}
                    </h2>
                    {/* Typing indicator placeholder */}
                    <p className="text-sm text-muted">Active on RAWGLE</p>
                  </div>
                </div>

                {/* More Options */}
                <Button variant="ghost" size="icon" className="flex-shrink-0">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Messages Container */}
          <Card className="card-feature-primary mb-4">
            <CardContent className="p-0">
              {/* Messages Area */}
              <div className="h-[500px] overflow-y-auto p-4 space-y-4">
                {conversation.messages.map((message, index) => {
                  const isSent = message.senderId === currentUserId;
                  const showTimestamp =
                    index === 0 ||
                    new Date(message.timestamp).getTime() -
                      new Date(conversation.messages[index - 1].timestamp).getTime() >
                      5 * 60 * 1000; // 5 minutes

                  return (
                    <div key={message.id}>
                      {/* Timestamp separator */}
                      {showTimestamp && (
                        <div className="flex justify-center my-4">
                          <span className="text-xs text-muted bg-sea-salt px-3 py-1 rounded-full">
                            {formatTimestamp(message.timestamp)}
                          </span>
                        </div>
                      )}

                      {/* Message bubble */}
                      <div className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                            isSent
                              ? 'bg-teal-600 text-white rounded-br-sm'
                              : 'bg-sea-salt text-gray-900 rounded-bl-sm'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Typing indicator placeholder */}
              <div className="px-4 pb-2 hidden">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span>{conversation.userName} is typing...</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Message Input */}
          <Card className="card-feature-primary">
            <CardContent className="p-4">
              <div className="flex items-end gap-3">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={sending}
                  className="flex-1 h-12 bg-white border-gray-900/10"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!messageInput.trim() || sending}
                  className="h-12 px-6 gap-2"
                >
                  {sending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted mt-2">Press Enter to send, Shift+Enter for new line</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
