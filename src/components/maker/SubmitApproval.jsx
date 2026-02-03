import { CheckCircle } from 'lucide-react';

export default function SubmitApproval({ validCount, onSubmit }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 animate-scale-in">
      <h3 className="font-semibold text-gray-900 mb-4">Step 3: Submit for Approval</h3>
      <p className="text-sm text-gray-600 mb-4">
        Your test message was successful! Submit this file for the checker to review.
      </p>

      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
        <div className="flex gap-3">
          <div className="text-indigo-600">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div className="text-sm text-indigo-700">
            <p className="font-medium">File validated</p>
            <p>{validCount} valid contacts ready</p>
          </div>
        </div>
      </div>

      <button onClick={onSubmit} className="w-full btn-primary py-3 font-semibold">
        Submit for Approval
      </button>
    </div>
  );
}
