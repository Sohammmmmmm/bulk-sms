import { Clock, CheckCircle, XCircle, Send } from 'lucide-react';
import SubmissionReview from '../components/checker/SubmissionReview';
import StatsCard from '../components/shared/StatsCard';

export default function CheckerDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Checker Dashboard
        </h1>
        <p className="text-gray-600">
          Review test messages, validate contacts, and approve SMS campaigns
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Pending Review"
          value="3"
          icon={Clock}
          color="orange"
        />
        <StatsCard
          title="Approved Today"
          value="12"
          icon={CheckCircle}
          trend="up"
          trendValue="+8%"
          color="green"
        />
        <StatsCard
          title="Rejected"
          value="2"
          icon={XCircle}
          color="red"
        />
        <StatsCard
          title="SMS Sent"
          value="24.5K"
          icon={Send}
          trend="up"
          trendValue="+18%"
          color="cyan"
        />
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <SubmissionReview />
      </div>
    </div>
  );
}