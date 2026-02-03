import { useState } from 'react';
import { FileText, Send, Clock, CheckCircle } from 'lucide-react';
import FileUpload from '../components/maker/FileUpload';
import ActivityLog from '../components/maker/ActivityLog';
import StatsCard from '../components/shared/StatsCard';

export default function MakerDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [activities, setActivities] = useState([
    {
      id: 1,
      title: 'SMS Campaign Approved',
      description: 'Your bulk SMS request for promotional campaign has been approved',
      status: 'approved',
      fileName: 'customers_list.csv',
      contactCount: 150,
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      title: 'SMS Campaign Pending',
      description: 'Waiting for checker approval',
      status: 'pending',
      fileName: 'new_leads.csv',
      contactCount: 87,
      timestamp: '5 hours ago',
    },
  ]);

  const handleWorkflowComplete = (submission) => {
    setSubmissions([...submissions, submission]);
    const newActivity = {
      id: activities.length + 1,
      title: 'SMS Campaign Submitted for Approval',
      description: `${submission.contacts.length} contacts submitted for review`,
      status: 'pending',
      fileName: submission.file.name,
      contactCount: submission.contacts.length,
      timestamp: 'just now',
    };
    setActivities([newActivity, ...activities]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Maker Dashboard
        </h1>
        <p className="text-gray-600">
          Upload contacts, send test messages, and submit for approval
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Submissions"
          value={submissions.length}
          icon={Send}
          trend="up"
          trendValue="+5"
          color="indigo"
        />
        <StatsCard
          title="Pending Approval"
          value={submissions.filter(s => s.status === 'pending_approval').length}
          icon={Clock}
          color="orange"
        />
        <StatsCard
          title="Approved"
          value={submissions.filter(s => s.status === 'approved').length}
          icon={CheckCircle}
          trend="up"
          trendValue="+2"
          color="green"
        />
        <StatsCard
          title="Sent Today"
          value="4.2K"
          icon={FileText}
          trend="up"
          trendValue="+18%"
          color="cyan"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Upload */}
        <div className="lg:col-span-2">
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-display font-bold text-gray-900 mb-6">
              Upload & Submit Campaign
            </h2>
            <FileUpload 
              onFileProcessed={() => {}}
              onWorkflowComplete={handleWorkflowComplete}
            />
          </section>
        </div>

        {/* Right Column - Activity Log */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-display font-bold text-gray-900 mb-4">
              Recent Activity
            </h2>
            <ActivityLog activities={activities} />
          </div>
        </div>
      </div>
    </div>
  );
}