# RAWGLE Messaging System Documentation

## Overview
Complete direct messaging system for the RAWGLE platform with inbox, conversation view, and real-time messaging capabilities.

## Files Created

### 1. API Route: `/src/app/api/messages/route.ts`
**Purpose**: Backend API for messaging functionality

**Features**:
- In-memory Map storage with global persistence across requests
- 12+ pre-populated mock conversations about raw feeding topics
- GET endpoint: Fetch conversations list or specific conversation with messages
- POST endpoint: Send new messages
- Search functionality for conversations
- Automatic message read status management
- Conversation sorting by most recent activity

**Mock Data Topics**:
- Raw diet transitions and tips
- Supplier recommendations
- Recipe sharing
- Supplement guidance
- Training treats
- Equipment recommendations
- Protein rotation strategies
- Storage organization
- And more raw feeding discussions

**Endpoints**:
- `GET /api/messages` - List all conversations
- `GET /api/messages?search=query` - Search conversations
- `GET /api/messages?conversationId=xxx` - Get specific conversation with messages
- `POST /api/messages` - Send new message

### 2. Inbox Page: `/src/app/messages/page.tsx`
**Purpose**: Main messages inbox showing all conversations

**Features**:
- Conversation list with user avatars (initials)
- Last message preview
- Timestamp formatting (just now, Xm ago, Xh ago, Xd ago, date)
- Unread message badges
- Real-time search with debouncing (300ms)
- Search indicator (loading spinner)
- Empty state for no conversations
- Empty state for search with no results
- Click to navigate to conversation
- New message button
- Responsive design
- Teal-600 theme integration
- Hover effects on conversation cards

**Components Used**:
- shadcn/ui Card
- shadcn/ui Input
- shadcn/ui Button
- shadcn/ui Badge
- lucide-react icons (Search, MessageSquarePlus, Loader2)

### 3. Conversation View: `/src/app/messages/[userId]/page.tsx`
**Purpose**: Individual conversation view for chatting

**Features**:
- User info header with avatar and name
- Back button to return to inbox
- Message bubbles (sent messages in teal, received in sea-salt gray)
- Proper message alignment (sent right, received left)
- Timestamp separators (shown every 5 minutes)
- Smart timestamp formatting (time today, day for recent, date for older)
- Message input with send button
- Enter to send, Shift+Enter for new line hint
- Auto-scroll to bottom on new messages
- Message sending with loading state
- Typing indicator placeholder (currently hidden, ready for implementation)
- Read status tracking
- Responsive layout
- Max 70% width for message bubbles for better readability

**Components Used**:
- shadcn/ui Card
- shadcn/ui Input
- shadcn/ui Button
- lucide-react icons (ArrowLeft, Send, Loader2, MoreVertical)

## Design Patterns

### Color Scheme
- Primary: `teal-600` (#2ba193)
- Sent messages: `teal-600` background with white text
- Received messages: `sea-salt` background with dark text
- Unread badge: `burnt-sienna` background
- Background: `page-gradient` (light gray #f8f8f8)

### Typography
- User names: font-semibold, text-gray-900
- Message text: text-sm
- Timestamps: text-muted
- Headers: hero-title and hero-description classes

### Spacing & Layout
- Container: max-w-4xl mx-auto
- Card padding: p-4 or p-6
- Message area height: 500px (scrollable)
- Avatar size: 56px (h-14 w-14) in inbox, 48px (h-12 w-12) in conversation

## Usage Examples

### Navigate to Messages Inbox
```typescript
router.push('/messages');
```

### Open Specific Conversation
```typescript
router.push(`/messages/${userId}`);
```

### Send Message (API)
```typescript
const response = await fetch('/api/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-user-id': 'demo-user',
  },
  body: JSON.stringify({
    conversationId: 'conv-1',
    receiverId: 'user-sarah',
    content: 'Hello!',
  }),
});
```

### Search Conversations
```typescript
const response = await fetch('/api/messages?search=raw+diet');
```

## Accessibility Features
- Semantic HTML structure
- Proper ARIA labels ready for implementation
- Keyboard navigation (Enter to send)
- Focus states on inputs and buttons
- Clear visual hierarchy
- High contrast text colors

## Performance Optimizations
- Debounced search (300ms)
- Auto-scroll only on message changes
- Efficient message filtering and sorting
- Lazy loading ready (pagination can be added)
- Minimal re-renders with proper state management

## Future Enhancements (Ready to Implement)

1. **Real-time Updates**
   - WebSocket integration for live messaging
   - Typing indicators (placeholder already in UI)
   - Online status indicators

2. **Rich Features**
   - Image/file attachments
   - Message reactions
   - Message editing/deletion
   - Read receipts with timestamps

3. **Advanced Functionality**
   - Message search within conversation
   - Conversation archiving
   - Block/report users
   - Group conversations
   - Pagination for old messages

4. **Notifications**
   - Desktop notifications
   - Sound alerts
   - Browser push notifications

## Testing Checklist

- [x] Messages API route created with mock data
- [x] Inbox page displays conversations list
- [x] Search functionality works with debouncing
- [x] Unread badges display correctly
- [x] Timestamps format properly
- [x] Conversation view navigates correctly
- [x] Message bubbles align properly (sent/received)
- [x] Send message functionality works
- [x] Auto-scroll to bottom on new messages
- [x] Loading states display correctly
- [x] Empty states render properly
- [x] Responsive design on mobile/desktop
- [x] Teal-600 theme applied consistently
- [x] TypeScript types are correct

## File Paths

**API Route**:
- `/Users/mattwright/pandora/rawgle-frontend/src/app/api/messages/route.ts`

**Pages**:
- `/Users/mattwright/pandora/rawgle-frontend/src/app/messages/page.tsx`
- `/Users/mattwright/pandora/rawgle-frontend/src/app/messages/[userId]/page.tsx`

## Mock Conversations

The system includes 12 pre-populated conversations with users:
1. Sarah Miller - Recent raw diet transition
2. Mike Peterson - Supplier recommendations
3. Emma Rodriguez - Recipe sharing
4. James Wilson - Supplement guidance
5. Lisa Chen - Training treats
6. David Thompson - Equipment recommendations
7. Rachel Kim - Cat raw feeding transition
8. Tom Anderson - Dental health bones
9. Kelly Martinez - Protein rotation
10. Steve Jackson - Freezer organization
11. Nina Patel - Green tripe benefits
12. Alex Brown - Batch meal prep

Each conversation contains realistic messages about raw feeding topics, with varying timestamps and read statuses.

## Integration with RAWGLE Platform

The messaging system integrates seamlessly with:
- Navigation (MainNav can add Messages link)
- User authentication (uses x-user-id header pattern)
- Existing UI components (Card, Button, Input, Badge)
- RAWGLE color palette and design system
- Global CSS utilities (page-gradient, hero-title, etc.)

## Notes

- Currently uses in-memory storage (Map) which resets on server restart
- User ID is hardcoded to 'demo-user' for demonstration
- All components follow existing RAWGLE code patterns
- Fully responsive and mobile-friendly
- Ready for backend integration (replace Map with database)
- TypeScript types properly defined for type safety
