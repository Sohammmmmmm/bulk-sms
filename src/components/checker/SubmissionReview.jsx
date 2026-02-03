import { useState, useEffect } from 'react';
import { CheckCircle, RefreshCw } from 'lucide-react';
import { apiClient, API_ENDPOINTS } from '../../utils/apiConfig';
import {
  ITEMS_PER_PAGE,
  CONTACTS_PER_PAGE,
  createDemoSubmission,
} from './submissionUtils';
import SubmissionList from './SubmissionList';
import SubmissionDetails from './SubmissionDetails';
import RejectionModal from './RejectionModal';

export default function SubmissionReview() {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [approvalResult, setApprovalResult] = useState(null);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [contactsSearch, setContactsSearch] = useState('');
  const [contactsPage, setContactsPage] = useState(1);

  const loadSubmissions = async () => {
    setIsLoadingSubmissions(true);
    try {
      try {
        const response = await apiClient.get(API_ENDPOINTS.SUBMISSIONS.LIST);
        const pending = response.filter((s) => s.status === 'pending_approval');
        setSubmissions(pending);
        console.log('Loaded submissions from backend:', pending);
        return;
      } catch (apiError) {
        console.warn('Backend API not available, using localStorage:', apiError.message);
      }

      const saved = JSON.parse(localStorage.getItem('smsSubmissions') || '[]');
      const pending = saved.filter((s) => s.status === 'pending_approval');

      if (pending.length === 0) {
        pending.push(createDemoSubmission());
      }

      setSubmissions(pending);
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
    const interval = setInterval(() => {
      loadSubmissions();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const approveSubmission = async (submission) => {
    setIsApproving(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const messagesSent = submission.contacts.length;

    try {
      try {
        await apiClient.put(API_ENDPOINTS.SUBMISSIONS.UPDATE(submission.id), {
          status: 'approved',
        });
      } catch (apiError) {
        console.warn('Backend API not available:', apiError.message);
      }

      const saved = JSON.parse(localStorage.getItem('smsSubmissions') || '[]');
      const updated = saved.map((s) =>
        s === submission
          ? { ...s, status: 'approved', sentAt: new Date().toISOString() }
          : s
      );
      localStorage.setItem('smsSubmissions', JSON.stringify(updated));

      setApprovalResult({
        success: true,
        messagesSent,
        timestamp: new Date().toLocaleTimeString(),
      });

      setIsApproving(false);

      setTimeout(() => {
        setSubmissions(submissions.filter((s) => s !== submission));
        setSelectedSubmission(null);
        setApprovalResult(null);
      }, 2000);
    } catch (error) {
      console.error('Error approving submission:', error);
      setApprovalResult({
        success: false,
        error: 'Failed to approve submission',
      });
      setIsApproving(false);
    }
  };

  const rejectSubmission = async (submission) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setIsRejecting(true);

    try {
      try {
        await apiClient.put(API_ENDPOINTS.SUBMISSIONS.UPDATE(submission.id), {
          status: 'rejected',
          rejectionReason: rejectionReason,
        });
      } catch (apiError) {
        console.warn('Backend API not available:', apiError.message);
      }

      const saved = JSON.parse(localStorage.getItem('smsSubmissions') || '[]');
      const updated = saved.map((s) =>
        s === submission
          ? {
              ...s,
              status: 'rejected',
              rejectionReason: rejectionReason,
              rejectedAt: new Date().toISOString(),
            }
          : s
      );
      localStorage.setItem('smsSubmissions', JSON.stringify(updated));

      setApprovalResult({
        success: false,
        message: `Submission rejected. Reason: ${rejectionReason}`,
      });

      setShowRejectModal(false);
      setRejectionReason('');
      setIsRejecting(false);

      setTimeout(() => {
        setSubmissions(submissions.filter((s) => s !== submission));
        setSelectedSubmission(null);
        setApprovalResult(null);
      }, 2000);
    } catch (error) {
      console.error('Error rejecting submission:', error);
      setApprovalResult({
        success: false,
        error: 'Failed to reject submission',
      });
      setIsRejecting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Pending Approvals</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={loadSubmissions}
            disabled={isLoadingSubmissions}
            className="btn btn-secondary flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingSubmissions ? 'animate-spin' : ''}`} />
            {isLoadingSubmissions ? 'Refreshing...' : 'Refresh'}
          </button>
          <span className="badge badge-info">{submissions.length} pending</span>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
          <p className="text-gray-600">No pending submissions to review</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SubmissionList
            submissions={submissions}
            selectedSubmission={selectedSubmission}
            searchTerm={searchTerm}
            onSearchChange={(term) => {
              setSearchTerm(term);
              setSelectedSubmission(null);
            }}
            onSelectSubmission={(submission) => {
              setSelectedSubmission(submission);
              setApprovalResult(null);
            }}
            itemsPerPage={ITEMS_PER_PAGE}
          />

          {selectedSubmission && (
            <>
              <SubmissionDetails
                submission={selectedSubmission}
                approvalResult={approvalResult}
                isApproving={isApproving}
                isRejecting={isRejecting}
                onApprove={approveSubmission}
                onReject={() => setShowRejectModal(true)}
                contactsSearch={contactsSearch}
                onContactsSearchChange={setContactsSearch}
                contactsPage={contactsPage}
                onContactsPageChange={setContactsPage}
                contactsPerPage={CONTACTS_PER_PAGE}
              />

              <RejectionModal
                isOpen={showRejectModal}
                rejectionReason={rejectionReason}
                isRejecting={isRejecting}
                onClose={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                onSubmit={() => rejectSubmission(selectedSubmission)}
                onReasonChange={setRejectionReason}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
