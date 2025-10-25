# Mentorship System - Quick Start Guide

## Access the Pages

### Browse Mentors
- **URL**: `http://localhost:3000/mentorship`
- **Purpose**: View all available mentors, search, and filter

### Mentor Profile & Booking
- **URL**: `http://localhost:3000/mentorship/[id]`
- **Examples**:
  - `http://localhost:3000/mentorship/1` - Dr. Sarah Mitchell
  - `http://localhost:3000/mentorship/4` - Maria Garcia (Budget Expert)
  - `http://localhost:3000/mentorship/8` - Dr. Rachel Foster (Holistic)

### My Sessions
- **URL**: `http://localhost:3000/mentorship/my-sessions`
- **Purpose**: Manage upcoming and past sessions

## Quick Feature Test Checklist

### ✓ Browse Page Features
- [ ] Search for "nutrition" - should filter mentors
- [ ] Filter by "health" specialty - should show health specialists
- [ ] Click on a mentor card - should navigate to profile

### ✓ Profile Page Features
- [ ] View mentor credentials and bio
- [ ] Select a date from calendar (try Monday for Dr. Mitchell)
- [ ] Choose available time slot
- [ ] Add session notes
- [ ] Click "Book Session"
- [ ] Confirm in dialog

### ✓ My Sessions Features
- [ ] View upcoming sessions tab
- [ ] Click "Join Meeting" link (opens in new tab)
- [ ] Cancel a session (with confirmation)
- [ ] View past sessions tab
- [ ] Click "Book Again" button

## Mentor Quick Reference

### Top Rated (4.9 stars)
1. Dr. Sarah Mitchell (#1) - $95/hr - Nutrition & Health
2. Dr. Michael Chen (#3) - $85/hr - Puppy & Health
3. Robert Martinez (#5) - $90/hr - Performance Nutrition
4. Dr. Rachel Foster (#8) - $100/hr - Holistic Health
5. Dr. Angela Moore (#13) - $90/hr - Allergy Specialist

### Budget Friendly (Under $60)
1. Maria Garcia (#4) - $45/hr - Budget Raw Feeding
2. Marcus Johnson (#16) - $45/hr - Meal Prep
3. Thomas Wright (#10) - $50/hr - Multi-Dog Households
4. David Kim (#7) - $55/hr - Supplier Connections
5. Carlos Rodriguez (#12) - $55/hr - Farm-to-Bowl

### Specialists
- **Nutrition**: #1, #2, #4, #11, #14, #15
- **Training**: #2, #5, #10, #16
- **Health**: #1, #3, #6, #8, #9, #13, #14
- **Suppliers**: #4, #7, #12

## Color Palette

### Primary Colors
- **Teal-600** (#0d9488) - Primary CTAs, links, highlights
- **Teal-700** (#0f766e) - Hover states
- **Teal-100** (#ccfbf1) - Light backgrounds for badges

### Status Colors
- **Blue** - Upcoming sessions (bg-blue-100, text-blue-700)
- **Green** - Completed sessions (bg-green-100, text-green-700)
- **Red** - Cancelled sessions (bg-red-100, text-red-700)
- **Yellow-400** - Star ratings (fill-yellow-400)

### Neutral Colors
- **Gray-50** - Page background
- **Gray-900** - Primary text
- **Gray-600** - Secondary text
- **Gray-300** - Borders, disabled states

## Component Library

### From shadcn/ui
- Card, CardHeader, CardContent, CardFooter
- Button (primary, outline, variants)
- Badge (solid, outline)
- Input (search, text)
- Textarea (notes)
- Dialog (confirmation modals)
- Label

### Custom
- Calendar (date picker with disabled dates)

### Icons (Lucide React)
- Search, Filter, Star, Users, Clock, Globe
- Calendar, Video, CheckCircle2, XCircle, AlertCircle
- Award, DollarSign, Edit, X

## API Endpoints Summary

```
GET  /api/mentorship                    # All mentors
GET  /api/mentorship?specialty=nutrition  # Filtered
GET  /api/mentorship?search=budget      # Search
GET  /api/mentorship?mentorId=1         # Single mentor
POST /api/mentorship                    # Book session
PUT  /api/mentorship                    # Update session
```

## Common Tasks

### Add a New Mentor
Edit `/src/app/api/mentorship/route.ts` and add to `mockMentors` array:
```typescript
{
  id: '17',
  name: 'New Mentor Name',
  title: 'Professional Title',
  specialty: ['nutrition', 'health'],
  // ... rest of fields
}
```

### Change Theme Color
Replace `teal-600` with your color throughout:
- Browse page: Search, mentor cards
- Profile page: Booking button, badges
- Sessions page: Status badges, actions

### Modify Availability
Edit mentor's `availability` array:
```typescript
availability: [
  { day: 'monday', times: ['09:00', '10:00', '14:00'] },
  { day: 'wednesday', times: ['13:00', '14:00', '15:00'] }
]
```

### Update Session Duration
In booking handler, change default:
```typescript
duration: duration || 60  // Change 60 to your preferred minutes
```

## Deployment Checklist

### Before Production
- [ ] Replace mock user ID with real auth
- [ ] Integrate payment processing (Stripe)
- [ ] Add video call platform (Zoom SDK)
- [ ] Set up email notifications
- [ ] Configure database (replace Map storage)
- [ ] Add environment variables for API keys
- [ ] Set up calendar sync (Google Calendar)
- [ ] Implement review submission
- [ ] Add mentor onboarding flow

### Environment Variables Needed
```env
NEXTAUTH_URL=https://your-domain.com
STRIPE_SECRET_KEY=sk_live_...
ZOOM_API_KEY=...
SENDGRID_API_KEY=...
DATABASE_URL=postgresql://...
```

## File Structure
```
rawgle-frontend/
├── src/
│   ├── app/
│   │   ├── mentorship/
│   │   │   ├── page.tsx              # Browse mentors
│   │   │   ├── [mentorId]/
│   │   │   │   └── page.tsx          # Mentor profile
│   │   │   └── my-sessions/
│   │   │       └── page.tsx          # Session management
│   │   └── api/
│   │       └── mentorship/
│   │           └── route.ts          # API handlers
│   └── components/
│       └── ui/
│           └── calendar.tsx          # Calendar component
└── Documentation/
    ├── MENTORSHIP_SYSTEM_COMPLETE.md
    ├── MENTORSHIP_USAGE_EXAMPLES.md
    └── MENTORSHIP_QUICK_START.md     # This file
```

## Next Steps
1. Start dev server: `npm run dev`
2. Navigate to `http://localhost:3000/mentorship`
3. Test all features with checklist above
4. Customize mentors, colors, and availability
5. Integrate with your auth system
6. Add payment processing
7. Deploy to production

Ready to connect dog owners with expert raw feeding mentors!
