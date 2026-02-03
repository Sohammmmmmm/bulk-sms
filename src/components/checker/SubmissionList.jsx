import { FileText } from 'lucide-react';
import { getPaginatedItems, getTotalPages } from './submissionUtils';

export default function SubmissionList({
  submissions,
  selectedSubmission,
  searchTerm,
  onSearchChange,
  onSelectSubmission,
  itemsPerPage,
}) {
  const filteredSubmissions = submissions.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      s.file.name.toLowerCase().includes(term) ||
      s.verifiedContact?.name.toLowerCase().includes(term) ||
      s.verifiedContact?.phone.includes(searchTerm)
    );
  });

  const totalPages = getTotalPages(filteredSubmissions.length, itemsPerPage);
  const currentPage = 1;
  const paginatedSubmissions = getPaginatedItems(filteredSubmissions, currentPage, itemsPerPage);

  return (
    <div className="lg:col-span-1 space-y-4">
      <div>
        <input
          type="text"
          placeholder="Search submissions..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="input-field w-full"
        />
      </div>

      <div className="space-y-3 bg-white rounded-xl border border-gray-200 p-4">
        {paginatedSubmissions.length > 0 ? (
          paginatedSubmissions.map((submission, idx) => (
            <button
              key={idx}
              onClick={() => onSelectSubmission(submission)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                selectedSubmission === submission
                  ? 'border-indigo-400 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate text-sm">
                    {submission.file.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {submission.contacts.length} contacts
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(submission.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </button>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            No submissions found
          </p>
        )}

        {totalPages > 1 && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
            <p className="text-xs text-gray-600">
              Showing {Math.min(1, filteredSubmissions.length)} to{' '}
              {Math.min(itemsPerPage, filteredSubmissions.length)} of{' '}
              {filteredSubmissions.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
