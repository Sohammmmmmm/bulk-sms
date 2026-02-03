import { FileText, Users, MessageSquare, Download, ArrowLeft } from 'lucide-react';

export default function FileReview({ request, onBack }) {
  if (!request) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900">
            Review Request
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Submitted by {request.submittedBy} • {request.submittedAt}
          </p>
        </div>
      </div>

      {/* File Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {request.fileName}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                CSV File • {request.fileSize}
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700">
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-indigo-50 rounded-lg">
            <p className="text-sm text-indigo-700 mb-1">Total Contacts</p>
            <p className="text-2xl font-bold text-indigo-900">{request.contactCount}</p>
          </div>
          <div className="p-4 bg-cyan-50 rounded-lg">
            <p className="text-sm text-cyan-700 mb-1">Selected for SMS</p>
            <p className="text-2xl font-bold text-cyan-900">{request.selectedCount}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-700 mb-1">Total SMS</p>
            <p className="text-2xl font-bold text-purple-900">{request.smsCount}</p>
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-gray-900 text-lg">
            Message Content
          </h3>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-800 whitespace-pre-wrap">
            {request.message}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Character count: <span className="font-medium text-gray-900">{request.message.length}</span>
          </span>
          <span className="text-gray-600">
            SMS count: <span className="font-medium text-gray-900">{request.smsCount}</span>
          </span>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">
              Selected Contacts ({request.selectedCount})
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Phone Number
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {request.contacts?.map((contact, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    #{contact.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {contact.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {contact.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-mono">
                    {contact.phone}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {request.contacts && request.contacts.length > 10 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600 text-center">
            Showing first 10 contacts • {request.selectedCount - 10} more in file
          </div>
        )}
      </div>
    </div>
  );
}