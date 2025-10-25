import { NextRequest, NextResponse } from 'next/server';

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

// Conversation interface with computed fields
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

// Use global store pattern to maintain state across requests
const getMessageStore = () => {
  const messageStore = (global as any).__messageStore || new Map<string, Conversation>();

  if (!(global as any).__messageStore) {
    (global as any).__messageStore = messageStore;

    // Initialize with 10+ mock conversations about raw feeding topics
    if (messageStore.size === 0) {
      const currentUserId = 'demo-user';

      const conversations: Conversation[] = [
        {
          id: 'conv-1',
          userId: 'user-sarah',
          userName: 'Sarah Miller',
          userAvatar: 'SM',
          lastMessage: 'Thanks! My pup is doing great on the new raw diet plan!',
          lastMessageTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 min ago
          unreadCount: 2,
          messages: [
            {
              id: 'msg-1-1',
              conversationId: 'conv-1',
              senderId: currentUserId,
              receiverId: 'user-sarah',
              content: 'Hey Sarah! How did the transition to raw feeding go?',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              read: true,
            },
            {
              id: 'msg-1-2',
              conversationId: 'conv-1',
              senderId: 'user-sarah',
              receiverId: currentUserId,
              content: 'It went really well! Started with 80/10/10 ratio like you suggested.',
              timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
              read: true,
            },
            {
              id: 'msg-1-3',
              conversationId: 'conv-1',
              senderId: currentUserId,
              receiverId: 'user-sarah',
              content: 'That\'s great to hear! Are you seeing any improvements in coat quality?',
              timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
              read: true,
            },
            {
              id: 'msg-1-4',
              conversationId: 'conv-1',
              senderId: 'user-sarah',
              receiverId: currentUserId,
              content: 'Yes! His coat is shinier and he has more energy.',
              timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
              read: false,
            },
            {
              id: 'msg-1-5',
              conversationId: 'conv-1',
              senderId: 'user-sarah',
              receiverId: currentUserId,
              content: 'Thanks! My pup is doing great on the new raw diet plan!',
              timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
              read: false,
            },
          ],
        },
        {
          id: 'conv-2',
          userId: 'user-mike',
          userName: 'Mike Peterson',
          userAvatar: 'MP',
          lastMessage: 'Check out my supplier list, they have great organ meat prices!',
          lastMessageTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 min ago
          unreadCount: 1,
          messages: [
            {
              id: 'msg-2-1',
              conversationId: 'conv-2',
              senderId: 'user-mike',
              receiverId: currentUserId,
              content: 'Hey! Saw your post about finding local suppliers. I can help!',
              timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
              read: true,
            },
            {
              id: 'msg-2-2',
              conversationId: 'conv-2',
              senderId: currentUserId,
              receiverId: 'user-mike',
              content: 'That would be awesome! I\'m looking for grass-fed beef suppliers.',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              read: true,
            },
            {
              id: 'msg-2-3',
              conversationId: 'conv-2',
              senderId: 'user-mike',
              receiverId: currentUserId,
              content: 'Check out my supplier list, they have great organ meat prices!',
              timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
              read: false,
            },
          ],
        },
        {
          id: 'conv-3',
          userId: 'user-emma',
          userName: 'Emma Rodriguez',
          userAvatar: 'ER',
          lastMessage: 'Perfect! I\'ll try the chicken recipe you shared.',
          lastMessageTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
          unreadCount: 0,
          messages: [
            {
              id: 'msg-3-1',
              conversationId: 'conv-3',
              senderId: currentUserId,
              receiverId: 'user-emma',
              content: 'Your recipe for chicken and veggie mix looks amazing!',
              timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
              read: true,
            },
            {
              id: 'msg-3-2',
              conversationId: 'conv-3',
              senderId: 'user-emma',
              receiverId: currentUserId,
              content: 'Thank you! It\'s my dog\'s favorite. The key is using organic veggies.',
              timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
              read: true,
            },
            {
              id: 'msg-3-3',
              conversationId: 'conv-3',
              senderId: 'user-emma',
              receiverId: currentUserId,
              content: 'Perfect! I\'ll try the chicken recipe you shared.',
              timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
              read: true,
            },
          ],
        },
        {
          id: 'conv-4',
          userId: 'user-james',
          userName: 'James Wilson',
          userAvatar: 'JW',
          lastMessage: 'The supplement guide was super helpful, thank you!',
          lastMessageTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
          unreadCount: 0,
          messages: [
            {
              id: 'msg-4-1',
              conversationId: 'conv-4',
              senderId: 'user-james',
              receiverId: currentUserId,
              content: 'Question about supplements - do you add fish oil to every meal?',
              timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
              read: true,
            },
            {
              id: 'msg-4-2',
              conversationId: 'conv-4',
              senderId: currentUserId,
              receiverId: 'user-james',
              content: 'I alternate between fish oil and krill oil, usually once a day.',
              timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
              read: true,
            },
            {
              id: 'msg-4-3',
              conversationId: 'conv-4',
              senderId: 'user-james',
              receiverId: currentUserId,
              content: 'The supplement guide was super helpful, thank you!',
              timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
              read: true,
            },
          ],
        },
        {
          id: 'conv-5',
          userId: 'user-lisa',
          userName: 'Lisa Chen',
          userAvatar: 'LC',
          lastMessage: 'Yes! Freeze-dried liver treats work great for training.',
          lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          unreadCount: 0,
          messages: [
            {
              id: 'msg-5-1',
              conversationId: 'conv-5',
              senderId: currentUserId,
              receiverId: 'user-lisa',
              content: 'Do you make your own training treats from raw meat?',
              timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
              read: true,
            },
            {
              id: 'msg-5-2',
              conversationId: 'conv-5',
              senderId: 'user-lisa',
              receiverId: currentUserId,
              content: 'Yes! Freeze-dried liver treats work great for training.',
              timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
              read: true,
            },
          ],
        },
        {
          id: 'conv-6',
          userId: 'user-david',
          userName: 'David Thompson',
          userAvatar: 'DT',
          lastMessage: 'The grinder I use is the STX Turboforce - highly recommend it!',
          lastMessageTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          unreadCount: 0,
          messages: [
            {
              id: 'msg-6-1',
              conversationId: 'conv-6',
              senderId: currentUserId,
              receiverId: 'user-david',
              content: 'What meat grinder do you recommend for home use?',
              timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              read: true,
            },
            {
              id: 'msg-6-2',
              conversationId: 'conv-6',
              senderId: 'user-david',
              receiverId: currentUserId,
              content: 'The grinder I use is the STX Turboforce - highly recommend it!',
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              read: true,
            },
          ],
        },
        {
          id: 'conv-7',
          userId: 'user-rachel',
          userName: 'Rachel Kim',
          userAvatar: 'RK',
          lastMessage: 'My cat transitioned smoothly over 2 weeks. Start slow!',
          lastMessageTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          unreadCount: 0,
          messages: [
            {
              id: 'msg-7-1',
              conversationId: 'conv-7',
              senderId: currentUserId,
              receiverId: 'user-rachel',
              content: 'How long did it take to transition your cat to raw?',
              timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
              read: true,
            },
            {
              id: 'msg-7-2',
              conversationId: 'conv-7',
              senderId: 'user-rachel',
              receiverId: currentUserId,
              content: 'My cat transitioned smoothly over 2 weeks. Start slow!',
              timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              read: true,
            },
          ],
        },
        {
          id: 'conv-8',
          userId: 'user-tom',
          userName: 'Tom Anderson',
          userAvatar: 'TA',
          lastMessage: 'Chicken frames are great for recreational bones!',
          lastMessageTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
          unreadCount: 0,
          messages: [
            {
              id: 'msg-8-1',
              conversationId: 'conv-8',
              senderId: currentUserId,
              receiverId: 'user-tom',
              content: 'What bones do you feed for dental health?',
              timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              read: true,
            },
            {
              id: 'msg-8-2',
              conversationId: 'conv-8',
              senderId: 'user-tom',
              receiverId: currentUserId,
              content: 'Chicken frames are great for recreational bones!',
              timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
              read: true,
            },
          ],
        },
        {
          id: 'conv-9',
          userId: 'user-kelly',
          userName: 'Kelly Martinez',
          userAvatar: 'KM',
          lastMessage: 'I rotate between beef, chicken, turkey, and lamb weekly.',
          lastMessageTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          unreadCount: 0,
          messages: [
            {
              id: 'msg-9-1',
              conversationId: 'conv-9',
              senderId: currentUserId,
              receiverId: 'user-kelly',
              content: 'How do you handle protein rotation in your feeding plan?',
              timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
              read: true,
            },
            {
              id: 'msg-9-2',
              conversationId: 'conv-9',
              senderId: 'user-kelly',
              receiverId: currentUserId,
              content: 'I rotate between beef, chicken, turkey, and lamb weekly.',
              timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              read: true,
            },
          ],
        },
        {
          id: 'conv-10',
          userId: 'user-steve',
          userName: 'Steve Jackson',
          userAvatar: 'SJ',
          lastMessage: 'Check out the RAWGLE freezer storage guide - super helpful!',
          lastMessageTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          unreadCount: 0,
          messages: [
            {
              id: 'msg-10-1',
              conversationId: 'conv-10',
              senderId: currentUserId,
              receiverId: 'user-steve',
              content: 'Any tips for organizing a chest freezer for raw feeding?',
              timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
              read: true,
            },
            {
              id: 'msg-10-2',
              conversationId: 'conv-10',
              senderId: 'user-steve',
              receiverId: currentUserId,
              content: 'Check out the RAWGLE freezer storage guide - super helpful!',
              timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              read: true,
            },
          ],
        },
        {
          id: 'conv-11',
          userId: 'user-nina',
          userName: 'Nina Patel',
          userAvatar: 'NP',
          lastMessage: 'Green tripe is amazing for digestion - my dogs love it!',
          lastMessageTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
          unreadCount: 0,
          messages: [
            {
              id: 'msg-11-1',
              conversationId: 'conv-11',
              senderId: currentUserId,
              receiverId: 'user-nina',
              content: 'Have you tried feeding green tripe? Thoughts?',
              timestamp: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
              read: true,
            },
            {
              id: 'msg-11-2',
              conversationId: 'conv-11',
              senderId: 'user-nina',
              receiverId: currentUserId,
              content: 'Green tripe is amazing for digestion - my dogs love it!',
              timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
              read: true,
            },
          ],
        },
        {
          id: 'conv-12',
          userId: 'user-alex',
          userName: 'Alex Brown',
          userAvatar: 'AB',
          lastMessage: 'I batch prep on Sundays - saves so much time during the week!',
          lastMessageTime: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
          unreadCount: 0,
          messages: [
            {
              id: 'msg-12-1',
              conversationId: 'conv-12',
              senderId: currentUserId,
              receiverId: 'user-alex',
              content: 'Do you meal prep in batches or prepare fresh daily?',
              timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
              read: true,
            },
            {
              id: 'msg-12-2',
              conversationId: 'conv-12',
              senderId: 'user-alex',
              receiverId: currentUserId,
              content: 'I batch prep on Sundays - saves so much time during the week!',
              timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
              read: true,
            },
          ],
        },
      ];

      conversations.forEach(conv => messageStore.set(conv.id, conv));
    }
  }

  return messageStore;
};

// GET: Fetch all conversations for current user, or specific conversation with messages
export async function GET(request: NextRequest) {
  const messageStore = getMessageStore();
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get('conversationId');
  const search = searchParams.get('search');

  // Get specific conversation with messages
  if (conversationId) {
    const conversation = messageStore.get(conversationId);
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }
    return NextResponse.json({ data: conversation });
  }

  // Get all conversations
  let conversations = Array.from(messageStore.values());

  // Search conversations by user name or last message
  if (search && search.trim()) {
    const searchLower = search.toLowerCase();
    conversations = conversations.filter(conv =>
      conv.userName.toLowerCase().includes(searchLower) ||
      conv.lastMessage.toLowerCase().includes(searchLower)
    );
  }

  // Sort by last message time (most recent first)
  conversations.sort((a: Conversation, b: Conversation) =>
    new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
  );

  return NextResponse.json({ data: conversations });
}

// POST: Send a new message
export async function POST(request: NextRequest) {
  const messageStore = getMessageStore();
  const body = await request.json();
  const { conversationId, receiverId, content } = body;
  const senderId = request.headers.get('x-user-id') || 'demo-user';

  if (!conversationId || !receiverId || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const conversation = messageStore.get(conversationId);
  if (!conversation) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
  }

  // Create new message
  const newMessage: Message = {
    id: `msg-${Date.now()}`,
    conversationId,
    senderId,
    receiverId,
    content,
    timestamp: new Date().toISOString(),
    read: false,
  };

  // Add message to conversation
  conversation.messages.push(newMessage);
  conversation.lastMessage = content;
  conversation.lastMessageTime = newMessage.timestamp;

  // Mark all previous messages as read
  conversation.messages.forEach(msg => {
    if (msg.receiverId === senderId) {
      msg.read = true;
    }
  });
  conversation.unreadCount = 0;

  // Update store
  messageStore.set(conversationId, conversation);

  return NextResponse.json({ data: newMessage }, { status: 201 });
}
