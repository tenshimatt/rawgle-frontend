'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Video, X, Edit, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Session {
  id: string;
  mentorId: string;
  mentorName?: string;
  mentorImage?: string;
  mentorTitle?: string;
  date: string;
  time: string;
  duration: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
  meetingLink?: string;
  createdAt: string;
}

export default function MySessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);

      // In production, this would fetch real sessions from the API
      // For now, creating mock sessions
      const mockSessions: Session[] = [
        {
          id: 'session-1',
          mentorId: '1',
          mentorName: 'Dr. Sarah Mitchell',
          mentorImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
          mentorTitle: 'Veterinary Nutritionist, DVM, PhD',
          date: '2025-10-28',
          time: '14:00',
          duration: 60,
          status: 'upcoming',
          notes: 'Help with transitioning my senior dog to raw diet',
          meetingLink: 'https://meet.rawgle.com/session-1',
          createdAt: new Date().toISOString()
        },
        {
          id: 'session-2',
          mentorId: '4',
          mentorName: 'Maria Garcia',
          mentorImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
          mentorTitle: 'Budget Raw Feeding Expert',
          date: '2025-11-02',
          time: '10:00',
          duration: 60,
          status: 'upcoming',
          notes: 'Budget-friendly meal planning strategies',
          meetingLink: 'https://meet.rawgle.com/session-2',
          createdAt: new Date().toISOString()
        },
        {
          id: 'session-3',
          mentorId: '2',
          mentorName: 'Jennifer Adams',
          mentorImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
          mentorTitle: 'Certified Canine Nutritionist',
          date: '2025-10-15',
          time: '13:00',
          duration: 60,
          status: 'completed',
          notes: 'Performance nutrition consultation',
          meetingLink: 'https://meet.rawgle.com/session-3',
          createdAt: new Date().toISOString()
        },
        {
          id: 'session-4',
          mentorId: '5',
          mentorName: 'Robert Martinez',
          mentorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
          mentorTitle: 'Performance Dog Nutrition Specialist',
          date: '2025-10-10',
          time: '17:00',
          duration: 60,
          status: 'completed',
          notes: 'Working dog energy requirements',
          meetingLink: 'https://meet.rawgle.com/session-4',
          createdAt: new Date().toISOString()
        }
      ];

      setSessions(mockSessions);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSession = async () => {
    if (!selectedSession) return;

    try {
      const response = await fetch('/api/mentorship', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: selectedSession.id,
          status: 'cancelled'
        })
      });

      const data = await response.json();

      if (data.success) {
        setSessions(sessions.map(s =>
          s.id === selectedSession.id ? { ...s, status: 'cancelled' } : s
        ));
        setCancelDialogOpen(false);
        setSelectedSession(null);
      } else {
        alert('Failed to cancel session');
      }
    } catch (error) {
      console.error('Cancel error:', error);
      alert('Failed to cancel session');
    }
  };

  const upcomingSessions = sessions.filter(s => s.status === 'upcoming');
  const pastSessions = sessions.filter(s => s.status === 'completed' || s.status === 'cancelled');

  const getStatusIcon = (status: Session['status']) => {
    switch (status) {
      case 'upcoming':
        return <AlertCircle className="h-5 w-5 text-blue-600" />;
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusBadge = (status: Session['status']) => {
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
  };

  const SessionCard = ({ session }: { session: Session }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Mentor Image */}
          <img
            src={session.mentorImage}
            alt={session.mentorName}
            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
          />

          {/* Session Details */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {session.mentorName}
                </h3>
                <p className="text-sm text-gray-600">{session.mentorTitle}</p>
              </div>
              {getStatusBadge(session.status)}
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="h-4 w-4 text-teal-600" />
                <span className="text-sm">
                  {new Date(session.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="h-4 w-4 text-teal-600" />
                <span className="text-sm">
                  {session.time} ({session.duration} minutes)
                </span>
              </div>
            </div>

            {/* Notes */}
            {session.notes && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  <strong>Notes:</strong> {session.notes}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {session.status === 'upcoming' && (
                <>
                  {session.meetingLink && (
                    <Button
                      asChild
                      size="sm"
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      <a
                        href={session.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Join Meeting
                      </a>
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedSession(session);
                      setCancelDialogOpen(true);
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              )}

              {session.status === 'completed' && (
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                >
                  <Link href={`/mentorship/${session.mentorId}`}>
                    Book Again
                  </Link>
                </Button>
              )}

              {session.status === 'cancelled' && (
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                >
                  <Link href={`/mentorship/${session.mentorId}`}>
                    Rebook
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Mentorship Sessions
          </h1>
          <p className="text-gray-600">
            Manage your upcoming and past mentorship sessions
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'upcoming'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Upcoming ({upcomingSessions.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'past'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Past ({pastSessions.length})
            </button>
          </nav>
        </div>

        {/* Sessions List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-4 bg-gray-200 rounded w-1/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {activeTab === 'upcoming' && (
              <div className="space-y-4">
                {upcomingSessions.length > 0 ? (
                  upcomingSessions.map((session) => (
                    <SessionCard key={session.id} session={session} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No upcoming sessions
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Book a session with a mentor to get started
                      </p>
                      <Button asChild className="bg-teal-600 hover:bg-teal-700">
                        <Link href="/mentorship">Browse Mentors</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'past' && (
              <div className="space-y-4">
                {pastSessions.length > 0 ? (
                  pastSessions.map((session) => (
                    <SessionCard key={session.id} session={session} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <CheckCircle2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No past sessions
                      </h3>
                      <p className="text-gray-600">
                        Your completed and cancelled sessions will appear here
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to cancel your session with{' '}
              <strong>{selectedSession?.mentorName}</strong> on{' '}
              <strong>
                {selectedSession?.date
                  ? new Date(selectedSession.date).toLocaleDateString()
                  : ''}
              </strong>{' '}
              at <strong>{selectedSession?.time}</strong>?
            </p>
            <p className="text-sm text-gray-500">
              This action cannot be undone. You can rebook with this mentor at a later time.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setCancelDialogOpen(false)}
                className="flex-1"
              >
                Keep Session
              </Button>
              <Button
                onClick={handleCancelSession}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Cancel Session
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
