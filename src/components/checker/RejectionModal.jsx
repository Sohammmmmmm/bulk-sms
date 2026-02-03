import { X, Loader } from 'lucide-react';

export default function RejectionModal({
  isOpen,
  rejectionReason,
  isRejecting,
  onClose,
  onSubmit,
  onReasonChange,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full animate-scale-in">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Reject Submission</h3>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Rejection *
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => onReasonChange(e.target.value)}
              placeholder="Please provide a reason for rejecting this submission (e.g., Invalid phone numbers, Duplicate contacts, etc.)"
              className="input-field resize-none"
              rows="4"
            />
            <p className="text-xs text-gray-500 mt-2">
              {rejectionReason.length}/200 characters
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">
              ⚠️ The submitter will be notified with your reason and can resubmit corrected data.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            disabled={isRejecting}
            className="flex-1 btn-secondary py-2"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={!rejectionReason.trim() || isRejecting}
            className="flex-1 btn-primary py-2 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRejecting ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Rejecting...
              </>
            ) : (
              <>
                <X className="w-4 h-4" />
                Reject
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
