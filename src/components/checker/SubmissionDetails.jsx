import { CheckCircle, AlertCircle, Users, Loader, X } from 'lucide-react';
import { filterContacts, getPaginatedItems, getTotalPages, getSubmissionStats } from './submissionUtils';

export default function SubmissionDetails({
  submission,
  approvalResult,
  isApproving,
  isRejecting,
  onApprove,
  onReject,
  contactsSearch,
  onContactsSearchChange,
  contactsPage,
  onContactsPageChange,
  contactsPerPage,
}) {
  const { totalContacts, validContacts, invalidContacts } = getSubmissionStats(submission);

  const filteredContacts = filterContacts(submission.contacts, contactsSearch);
  const totalPages = getTotalPages(filteredContacts.length, contactsPerPage);

  const paginatedContacts = getPaginatedItems(filteredContacts, contactsPage, contactsPerPage);

  const startIndex = (contactsPage - 1) * contactsPerPage;
  const endIndex = startIndex + paginatedContacts.length;

  return (
    <div className="lg:col-span-2 space-y-6 animate-slide-up">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {submission.file.name}
            </h3>
            <p className="text-sm text-gray-600">
              Submitted {new Date(submission.submittedAt).toLocaleString()}
            </p>
          </div>
          <span className="badge badge-info">Pending Review</span>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
            <p className="text-sm text-indigo-600 font-medium">Total Contacts</p>
            <p className="text-2xl font-bold text-indigo-900 mt-1">{totalContacts}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <p className="text-sm text-green-600 font-medium">Valid Contacts</p>
            <p className="text-2xl font-bold text-green-900 mt-1">{validContacts}</p>
          </div>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-600" />
            <h4 className="font-semibold text-gray-900">Contacts</h4>
            <span className="text-sm text-gray-600">({totalContacts})</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search contacts..."
              value={contactsSearch}
              onChange={(e) => {
                onContactsSearchChange(e.target.value);
                onContactsPageChange(1);
              }}
              className="input-field"
            />
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
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Valid
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedContacts.map((contact, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">#{contact.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {contact.name ? contact.name.charAt(0).toUpperCase() : '-'}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{contact.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-mono">{contact.phone}</td>
                  <td className="px-6 py-4 text-sm">
                    {contact.valid ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-red-600">No</span>
                    )}
                  </td>
                </tr>
              ))}

              {/* Pagination Footer */}
              {totalPages > 1 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div>
                        Showing {Math.min(startIndex + 1, filteredContacts.length)} to{' '}
                        {Math.min(endIndex, filteredContacts.length)} of {filteredContacts.length}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onContactsPageChange(Math.max(1, contactsPage - 1))}
                          disabled={contactsPage === 1}
                          className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
                        >
                          ← Prev
                        </button>
                        <div className="flex gap-1">
                          {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                            const pageNum = i + 1;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => onContactsPageChange(pageNum)}
                                className={`px-2 py-1 text-xs rounded font-medium ${
                                  contactsPage === pageNum
                                    ? 'bg-indigo-600 text-white'
                                    : 'border border-gray-200 hover:bg-gray-50'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>
                        <button
                          onClick={() =>
                            onContactsPageChange(Math.min(totalPages, contactsPage + 1))
                          }
                          disabled={contactsPage === totalPages}
                          className="px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-600 uppercase font-semibold">Total</p>
          <p className="text-lg font-bold text-gray-900">{totalContacts}</p>
        </div>
        <div>
          <p className="text-xs text-green-600 uppercase font-semibold">Valid</p>
          <p className="text-lg font-bold text-green-900">{validContacts}</p>
        </div>
        <div>
          <p className="text-xs text-red-600 uppercase font-semibold">Invalid</p>
          <p className="text-lg font-bold text-red-900">{invalidContacts}</p>
        </div>
      </div>

      {/* Approval Result */}
      {approvalResult && (
        <div
          className={
            'rounded-xl border p-6 animate-scale-in ' +
            (approvalResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200')
          }
        >
          <div className="flex gap-4">
            {approvalResult.success ? (
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            )}

            <div>
              <h4
                className={
                  approvalResult.success
                    ? 'font-semibold mb-2 text-green-900'
                    : 'font-semibold mb-2 text-red-900'
                }
              >
                {approvalResult.success
                  ? '✓ Approved & Sent Successfully!'
                  : '✗ Submission Rejected'}
              </h4>

              {approvalResult.success ? (
                <>
                  <p className="text-sm text-green-700 mb-2">
                    Messages sent to {approvalResult.messagesSent} contacts at{' '}
                    {approvalResult.timestamp}
                  </p>
                  <p className="text-xs text-green-600">
                    The SMS campaign has been successfully executed
                  </p>
                </>
              ) : (
                <p className="text-sm text-red-700">
                  {approvalResult.message || approvalResult.error}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {!approvalResult && (
        <div className="flex gap-3">
          <button
            onClick={() => onApprove(submission)}
            disabled={isApproving}
            className="flex-1 btn-primary py-3 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApproving ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Approve &amp; Send SMS
              </>
            )}
          </button>
          <button
            onClick={() => onReject?.(submission)}
            disabled={isApproving || isRejecting}
            className="btn-secondary py-3 font-semibold px-6 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" />
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
