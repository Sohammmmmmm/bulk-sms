import { Loader, Send, CheckCircle } from 'lucide-react';

export default function TestMessageSection({
  selectedContact,
  testMessage,
  onTestMessageChange,
  bulkMessage,
  onBulkMessageChange,
  isSendingTest,
  testSent,
  onSendTest
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Send className="w-5 h-5 text-indigo-600" />
        Step 2: Send Test Message
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        {selectedContact ? `Selected: ${selectedContact.name} (${selectedContact.phone})` : 'Select a contact from the table above'}
      </p>

      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 block">Test Message</label>
        <textarea
          value={testMessage}
          onChange={(e) => onTestMessageChange(e.target.value)}
          rows="3"
          className="input-field resize-none"
          placeholder="Enter your test message..."
        />

        <button
          onClick={onSendTest}
          disabled={!selectedContact || isSendingTest || testSent}
          className="w-full btn-primary py-3 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSendingTest ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Sending test message...
            </>
          ) : testSent ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Test message sent
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Send Test Message
            </>
          )}
        </button>

        {/* Bulk message composer (shown after successful test) */}
        {testSent && bulkMessage !== undefined && (
          <div className="mt-4 border-t pt-4">
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Compose Bulk SMS (will be sent to all valid contacts)
            </label>
            <textarea
              value={bulkMessage}
              onChange={(e) => onBulkMessageChange(e.target.value)}
              rows="4"
              className="input-field resize-none"
              placeholder="Enter the bulk SMS to send to all valid contacts..."
            />
          </div>
        )}
      </div>
    </div>
  );
}
