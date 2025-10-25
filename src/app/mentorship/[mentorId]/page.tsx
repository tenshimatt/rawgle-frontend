'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, Clock, Globe, Award, DollarSign, Video, CheckCircle2, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TimeSlot {
  day: string;
  times: string[];
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface Mentor {
  id: string;
  name: string;
  title: string;
  specialty: string[];
  bio: string;
  credentials: string[];
  experience: string;
  rating: number;
  totalReviews: number;
  hourlyRate: number;
  image: string;
  availability: TimeSlot[];
  reviews: Review[];
  languages: string[];
  responseTime: string;
  totalSessions: number;
}

export default function MentorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const mentorId = params.mentorId as string;

  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (mentorId) {
      fetchMentor();
    }
  }, [mentorId]);

  const fetchMentor = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/mentorship?mentorId=${mentorId}`);
      const data = await response.json();

      if (data.success) {
        setMentor(data.mentor);
      }
    } catch (error) {
      console.error('Failed to fetch mentor:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAvailableTimesForDate = (date: Date | undefined): string[] => {
    if (!date || !mentor) return [];

    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const daySlot = mentor.availability.find(slot => slot.day === dayName);

    return daySlot ? daySlot.times : [];
  };

  const isDateDisabled = (date: Date): boolean => {
    if (!mentor) return true;

    // Disable past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    // Disable dates beyond 3 months
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    if (date > maxDate) return true;

    // Disable dates with no availability
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const hasAvailability = mentor.availability.some(slot => slot.day === dayName);

    return !hasAvailability;
  };

  const handleBookSession = async () => {
    if (!selectedDate || !selectedTime || !mentor) return;

    try {
      setBooking(true);

      const response = await fetch('/api/mentorship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentorId: mentor.id,
          userId: 'user-1', // In production, get from auth
          date: selectedDate.toISOString().split('T')[0],
          time: selectedTime,
          duration: 60,
          notes
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Session booked successfully!');
        router.push('/mentorship/my-sessions');
      } else {
        alert('Failed to book session');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to book session');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-40 bg-gray-200 rounded-lg" />
                <div className="h-40 bg-gray-200 rounded-lg" />
              </div>
              <div className="h-96 bg-gray-200 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900">Mentor not found</h1>
        </div>
      </div>
    );
  }

  const availableTimes = getAvailableTimesForDate(selectedDate);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <img
                src={mentor.image}
                alt={mentor.name}
                className="w-48 h-48 rounded-lg object-cover"
              />

              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {mentor.name}
                    </h1>
                    <p className="text-lg text-teal-600 font-medium">
                      {mentor.title}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-teal-600">
                      ${mentor.hourlyRate}
                    </div>
                    <div className="text-sm text-gray-500">per hour</div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(mentor.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-gray-900">
                      {mentor.rating.toFixed(1)}
                    </span>
                    <span className="text-gray-500">
                      ({mentor.totalReviews} reviews)
                    </span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4 text-teal-600" />
                    <span>{mentor.responseTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Video className="h-4 w-4 text-teal-600" />
                    <span>{mentor.totalSessions} sessions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Globe className="h-4 w-4 text-teal-600" />
                    <span>{mentor.languages.join(', ')}</span>
                  </div>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2">
                  {mentor.specialty.map((spec) => (
                    <Badge key={spec} className="bg-teal-100 text-teal-700 capitalize">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{mentor.bio}</p>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    <strong>Experience:</strong> {mentor.experience}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Credentials */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-teal-600" />
                  Credentials & Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {mentor.credentials.map((cred, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{cred}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews ({mentor.totalReviews})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mentor.reviews.map((review) => (
                    <div key={review.id} className="border-b last:border-b-0 pb-6 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-gray-900">
                          {review.userName}
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">{review.comment}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-teal-600" />
                  Book a Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Calendar */}
                <div className="mb-6">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={isDateDisabled}
                    className="rounded-md border"
                  />
                </div>

                {/* Available Times */}
                {selectedDate && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Available Times
                    </label>
                    {availableTimes.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {availableTimes.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              selectedTime === time
                                ? 'bg-teal-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No times available for this date
                      </p>
                    )}
                  </div>
                )}

                {/* Notes */}
                {selectedTime && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Notes (Optional)
                    </label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="What would you like to discuss?"
                      rows={3}
                    />
                  </div>
                )}

                {/* Book Button */}
                <Button
                  onClick={() => setBookingDialogOpen(true)}
                  disabled={!selectedDate || !selectedTime || booking}
                  className="w-full bg-teal-600 hover:bg-teal-700"
                >
                  {booking ? 'Booking...' : 'Book Session'}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Session duration: 60 minutes • Total: ${mentor.hourlyRate}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Mentor</p>
              <p className="font-semibold">{mentor.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date & Time</p>
              <p className="font-semibold">
                {selectedDate?.toLocaleDateString()} at {selectedTime}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="font-semibold">60 minutes</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Cost</p>
              <p className="font-semibold text-teal-600 text-xl">
                ${mentor.hourlyRate}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setBookingDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBookSession}
                disabled={booking}
                className="flex-1 bg-teal-600 hover:bg-teal-700"
              >
                {booking ? 'Confirming...' : 'Confirm Booking'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
