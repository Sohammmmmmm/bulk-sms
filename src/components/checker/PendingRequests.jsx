import { Clock, Eye, FileText, User } from 'lucide-react';

export default function PendingRequests({ requests, onViewRequest }) {
  if (!requests || requests.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending requests</h3>
        <p className="text-gray-500">All requests have been processed</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div
          key={request.id}
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  {request.fileName}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {request.submittedBy}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {request.submittedAt}
                  </span>
                </div>
              </div>
            </div>

            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
              Pending Review
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-xs text-gray-600 mb-1">Total Contacts</p>
              <p className="text-lg font-bold text-gray-900">{request.contactCount}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Selected</p>
              <p className="text-lg font-bold text-indigo-600">{request.selectedCount}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">SMS Count</p>
              <p className="text-lg font-bold text-cyan-600">{request.smsCount}</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Message Preview:</p>
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
              <p className="text-sm text-gray-800 line-clamp-2">
                {request.message}
              </p>
            </div>
          </div>

          <button
            onClick={() => onViewRequest(request)}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-5 h-5" />
            Review Request
          </button>
        </div>
      ))}
    </div>
  );
}