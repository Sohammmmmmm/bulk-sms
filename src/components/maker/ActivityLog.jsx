import { Clock, FileText, Send, CheckCircle, XCircle, AlertCircle, MessageSquare } from 'lucide-react';

export default function ActivityLog({ activities }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-orange-600" />;
      case 'sent':
        return <Send className="w-5 h-5 text-blue-600" />;
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'pending':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'sent':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'verified':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No activity yet</h3>
        <p className="text-gray-500">Your recent activities will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-display font-bold text-gray-900">
          Recent Activity
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="group p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                getStatusColor(activity.status).replace('text-', 'bg-').replace('-700', '-100')
              }`}>
                {getStatusIcon(activity.status)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  {/* MINIMAL: Only status + file name visible */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(activity.status)}`}>
                        {activity.status === 'approved' && '✓ Approved'}
                        {activity.status === 'rejected' && '✗ Rejected'}
                        {activity.status === 'pending' && '⏳ Pending'}
                        {activity.status === 'verified' && '✓ Verified'}
                        {activity.status === 'sent' && '📤 Sent'}
                        {!['approved', 'rejected', 'pending', 'verified', 'sent'].includes(activity.status) && activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                      </span>
                      {activity.fileName && <span className="text-sm font-medium text-gray-700">{activity.fileName}</span>}
                    </div>
                  </div>
                  {/* Icon button for hover tooltip */}
                  <button
                    title={(() => {
                      const parts = [];
                      if (activity.description) parts.push(activity.description);
                      if (activity.contactCount) parts.push(`${activity.contactCount} contacts`);
                      if (activity.verifiedCount) parts.push(`${activity.verifiedCount} verified`);
                      if (activity.contactName) parts.push(`${activity.contactName} (${activity.contactPhone})`);
                      if (activity.remark) parts.push(`Remark: ${activity.remark}`);
                      parts.push(`Time: ${activity.timestamp}`);
                      return parts.join(' • ');
                    })()}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 cursor-help"
                  >
                    <FileText className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                </div>

                {/* EXPANDED ON HOVER: Full details appear smoothly */}
                <div className="hidden group-hover:block mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm text-gray-600 animate-in fade-in duration-200">
                  {activity.description && (
                    <p><span className="font-medium text-gray-700">Message:</span> {activity.description}</p>
                  )}
                  {activity.type === 'submission' && (
                    <>
                      <p><span className="font-medium text-gray-700">Contacts:</span> {activity.contactCount}</p>
                      <p><span className="font-medium text-gray-700">Verified:</span> {activity.verifiedCount}</p>
                    </>
                  )}
                  {activity.type === 'verification' && activity.contactName && (
                    <p><span className="font-medium text-gray-700">Contact:</span> {activity.contactName} ({activity.contactPhone})</p>
                  )}
                  {activity.remark && (
                    <p><span className="font-medium text-gray-700">Remark:</span> {activity.remark}</p>
                  )}
                  <p className="text-xs text-gray-500"><span className="font-medium">Time:</span> {activity.timestamp}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}