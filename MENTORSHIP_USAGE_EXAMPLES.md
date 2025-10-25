# Mentorship System - Usage Examples

## Example API Calls

### Fetch All Mentors
```typescript
const response = await fetch('/api/mentorship');
const data = await response.json();
// Returns: { success: true, mentors: [...] }
```

### Filter Mentors by Specialty
```typescript
const response = await fetch('/api/mentorship?specialty=nutrition');
const data = await response.json();
// Returns: { success: true, mentors: [all nutrition specialists] }
```

### Search Mentors
```typescript
const response = await fetch('/api/mentorship?search=budget');
const data = await response.json();
// Returns: { success: true, mentors: [Maria Garcia, etc.] }
```

### Get Single Mentor
```typescript
const response = await fetch('/api/mentorship?mentorId=1');
const data = await response.json();
// Returns: { success: true, mentor: {...} }
```

### Book a Session
```typescript
const response = await fetch('/api/mentorship', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    mentorId: '1',
    userId: 'user-123',
    date: '2025-10-28',
    time: '14:00',
    duration: 60,
    notes: 'Need help with transitioning to raw diet'
  })
});

const data = await response.json();
// Returns: {
//   success: true,
//   session: {
//     id: 'session-...',
//     meetingLink: 'https://meet.rawgle.com/session-...',
//     ...
//   }
// }
```

### Cancel a Session
```typescript
const response = await fetch('/api/mentorship', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: 'session-123',
    status: 'cancelled'
  })
});

const data = await response.json();
// Returns: { success: true, session: {...} }
```

### Reschedule a Session
```typescript
const response = await fetch('/api/mentorship', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: 'session-123',
    date: '2025-11-05',
    time: '15:00'
  })
});

const data = await response.json();
// Returns: { success: true, session: {...} }
```

## Component Usage Examples

### Using the Calendar Component
```typescript
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';

function BookingCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>();

  const isDateDisabled = (date: Date) => {
    // Disable weekends
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={setSelectedDate}
      disabled={isDateDisabled}
      className="rounded-md border"
    />
  );
}
```

### Multiple Date Selection
```typescript
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';

function MultipleDates() {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  return (
    <Calendar
      mode="multiple"
      selected={selectedDates}
      onSelect={setSelectedDates}
      className="rounded-md border"
    />
  );
}
```

## Navigation Examples

### Link to Browse Mentors
```typescript
import Link from 'next/link';

<Link href="/mentorship">
  <Button>Find a Mentor</Button>
</Link>
```

### Link to Specific Mentor
```typescript
import Link from 'next/link';

<Link href={`/mentorship/${mentor.id}`}>
  <Button>View Profile</Button>
</Link>
```

### Link to My Sessions
```typescript
import Link from 'next/link';

<Link href="/mentorship/my-sessions">
  <Button>My Sessions</Button>
</Link>
```

## Mentor Data Structure Example

```typescript
const exampleMentor = {
  id: '1',
  name: 'Dr. Sarah Mitchell',
  title: 'Veterinary Nutritionist, DVM, PhD',
  specialty: ['nutrition', 'health'],
  bio: 'Veterinarian with 15+ years of experience...',
  credentials: [
    'Doctor of Veterinary Medicine (DVM)',
    'PhD in Animal Nutrition',
    'Board Certified Veterinary Nutritionist',
    'Raw Feeding Veterinary Society Member'
  ],
  experience: '15+ years in veterinary medicine...',
  rating: 4.9,
  totalReviews: 127,
  hourlyRate: 95,
  image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
  availability: [
    {
      day: 'monday',
      times: ['09:00', '10:00', '14:00', '15:00']
    },
    {
      day: 'wednesday',
      times: ['09:00', '10:00', '11:00', '14:00']
    }
  ],
  reviews: [
    {
      id: 'r1',
      userId: 'u1',
      userName: 'Jennifer K.',
      rating: 5,
      comment: 'Dr. Mitchell helped me create a balanced raw diet...',
      date: '2025-10-15'
    }
  ],
  languages: ['English', 'Spanish'],
  responseTime: '< 2 hours',
  totalSessions: 450
};
```

## Session Data Structure Example

```typescript
const exampleSession = {
  id: 'session-1698765432',
  mentorId: '1',
  userId: 'user-123',
  date: '2025-10-28',
  time: '14:00',
  duration: 60,
  status: 'upcoming',
  notes: 'Help with transitioning my senior dog to raw diet',
  meetingLink: 'https://meet.rawgle.com/session-1698765432',
  createdAt: '2025-10-25T18:30:00.000Z'
};
```

## Filter Examples

### Filter by Multiple Criteria
```typescript
// Client-side filtering
const filteredMentors = mentors.filter(mentor => {
  // By specialty
  const matchesSpecialty = selectedSpecialty === 'all' ||
    mentor.specialty.includes(selectedSpecialty);

  // By search query
  const matchesSearch = !searchQuery ||
    mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.bio.toLowerCase().includes(searchQuery.toLowerCase());

  // By price range
  const matchesPrice = mentor.hourlyRate >= minPrice &&
    mentor.hourlyRate <= maxPrice;

  return matchesSpecialty && matchesSearch && matchesPrice;
});
```

### Sort Mentors
```typescript
// Sort by rating (highest first)
const sortedByRating = [...mentors].sort((a, b) => b.rating - a.rating);

// Sort by price (lowest first)
const sortedByPrice = [...mentors].sort((a, b) => a.hourlyRate - b.hourlyRate);

// Sort by experience (most sessions first)
const sortedByExperience = [...mentors].sort((a, b) =>
  b.totalSessions - a.totalSessions
);
```

## Calendar Availability Logic

### Check if Time Slot is Available
```typescript
function getAvailableTimesForDate(mentor: Mentor, date: Date): string[] {
  const dayName = date.toLocaleDateString('en-US', {
    weekday: 'long'
  }).toLowerCase();

  const daySlot = mentor.availability.find(
    slot => slot.day === dayName
  );

  return daySlot ? daySlot.times : [];
}
```

### Disable Past Dates and Unavailable Days
```typescript
function isDateDisabled(mentor: Mentor, date: Date): boolean {
  // Disable past dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) return true;

  // Disable dates beyond 3 months
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  if (date > maxDate) return true;

  // Disable dates with no availability
  const dayName = date.toLocaleDateString('en-US', {
    weekday: 'long'
  }).toLowerCase();

  const hasAvailability = mentor.availability.some(
    slot => slot.day === dayName
  );

  return !hasAvailability;
}
```

## Rating Display

### Star Rating Component
```typescript
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${
            i < Math.floor(rating)
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}
```

## Status Badge Helper

```typescript
function getStatusBadge(status: 'upcoming' | 'completed' | 'cancelled') {
  const variants = {
    upcoming: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  };

  return (
    <Badge className={variants[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
```

## Price Formatting

```typescript
function formatPrice(price: number): string {
  return `$${price}/hr`;
}

function calculateSessionCost(hourlyRate: number, duration: number): number {
  return (hourlyRate * duration) / 60;
}
```

## Date/Time Formatting

```typescript
function formatSessionDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatSessionTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;

  return `${displayHour}:${minutes} ${period}`;
}
```

## Integration with Authentication

```typescript
// Get current user from auth context
import { useSession } from 'next-auth/react';

function BookingButton() {
  const { data: session } = useSession();

  const handleBooking = async () => {
    if (!session?.user?.id) {
      // Redirect to login
      router.push('/auth/signin');
      return;
    }

    // Proceed with booking
    const response = await fetch('/api/mentorship', {
      method: 'POST',
      body: JSON.stringify({
        userId: session.user.id,
        // ... other booking data
      })
    });
  };
}
```

## Error Handling Examples

```typescript
async function bookSession(data: BookingData) {
  try {
    const response = await fetch('/api/mentorship', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to book session');
    }

    return result.session;
  } catch (error) {
    console.error('Booking error:', error);
    throw error;
  }
}
```

## Loading States

```typescript
function MentorList() {
  const [loading, setLoading] = useState(true);
  const [mentors, setMentors] = useState([]);

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg" />
            <CardContent className="p-6 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    // Actual mentor cards
  );
}
```

These examples show how to use all the mentorship system components and APIs effectively!
