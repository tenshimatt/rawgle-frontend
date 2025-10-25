'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Flag,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  Image as ImageIcon,
  User,
  AlertTriangle
} from 'lucide-react';

interface Report {
  id: string;
  type: 'post' | 'comment' | 'user' | 'product';
  contentId: string;
  reportedBy: string;
  reason: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  content: {
    title?: string;
    text?: string;
    author: string;
    image?: string;
  };
}

export default function AdminModerationPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/admin/moderation');
      const data = await res.json();
      if (data.success) {
        setReports(data.reports);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (reportId: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch('/api/admin/moderation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, action }),
      });
      const data = await res.json();
      if (data.success) {
        fetchReports();
      }
    } catch (error) {
      console.error('Failed to update report:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'post': return <MessageSquare className="h-5 w-5" />;
      case 'comment': return <MessageSquare className="h-5 w-5" />;
      case 'user': return <User className="h-5 w-5" />;
      case 'product': return <ImageIcon className="h-5 w-5" />;
      default: return <Flag className="h-5 w-5" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'post': return 'bg-blue-100 text-blue-800';
      case 'comment': return 'bg-purple-100 text-purple-800';
      case 'user': return 'bg-yellow-100 text-yellow-800';
      case 'product': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReports = reports.filter(report => {
    if (activeTab === 'pending') return report.status === 'pending';
    if (activeTab === 'approved') return report.status === 'approved';
    if (activeTab === 'rejected') return report.status === 'rejected';
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Content Moderation</h1>
        <p className="text-gray-600 mt-2">Review and manage reported content</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Reports</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                {reports.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {reports.filter(r => r.status === 'approved').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {reports.filter(r => r.status === 'rejected').length}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {reports.length}
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <Flag className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Reports List */}
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b px-6 pt-6">
            <TabsList>
              <TabsTrigger value="pending">
                Pending ({reports.filter(r => r.status === 'pending').length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({reports.filter(r => r.status === 'approved').length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({reports.filter(r => r.status === 'rejected').length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="p-6">
            <div className="space-y-4">
              {filteredReports.length === 0 ? (
                <div className="text-center py-12">
                  <Flag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No reports in this category</p>
                </div>
              ) : (
                filteredReports.map((report) => (
                  <Card key={report.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Report Header */}
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {getTypeIcon(report.type)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeBadgeColor(report.type)}`}>
                                {report.type}
                              </span>
                              <span className="text-sm text-gray-600">
                                Reported by {report.reportedBy}
                              </span>
                              <span className="text-sm text-gray-400">
                                {new Date(report.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-gray-900 mt-1">
                              Reason: {report.reason}
                            </p>
                          </div>
                        </div>

                        {/* Report Description */}
                        {report.description && (
                          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">{report.description}</p>
                          </div>
                        )}

                        {/* Content Preview */}
                        <div className="border-l-4 border-teal-600 pl-4 py-2 bg-seasalt rounded-r-lg">
                          <div className="flex items-start space-x-3">
                            {report.content.image && (
                              <img
                                src={report.content.image}
                                alt="Content"
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                            )}
                            <div className="flex-1">
                              {report.content.title && (
                                <p className="font-medium text-gray-900 mb-1">
                                  {report.content.title}
                                </p>
                              )}
                              <p className="text-sm text-gray-700 line-clamp-2">
                                {report.content.text}
                              </p>
                              <p className="text-xs text-gray-600 mt-2">
                                By {report.content.author}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      {report.status === 'pending' && (
                        <div className="flex flex-col space-y-2 ml-4">
                          <Button
                            onClick={() => handleAction(report.id, 'approve')}
                            className="bg-green-600 hover:bg-green-700"
                            size="sm"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleAction(report.id, 'reject')}
                            variant="outline"
                            className="border-red-600 text-red-600 hover:bg-red-50"
                            size="sm"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                          <Button
                            onClick={() => window.open(`/posts/${report.contentId}`, '_blank')}
                            variant="ghost"
                            size="sm"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
