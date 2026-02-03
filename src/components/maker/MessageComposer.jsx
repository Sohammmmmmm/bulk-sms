import { useState } from 'react';
import { MessageSquare, Send, AlertCircle, Sparkles } from 'lucide-react';

export default function MessageComposer({ selectedContacts, onSubmit }) {
  const [message, setMessage] = useState('');
  const maxLength = 160;
  const charCount = message.length;
  const smsCount = Math.ceil(charCount / 160) || 1;

  const templates = [
    "Hi {name}, this is a friendly reminder about your upcoming appointment.",
    "Hello {name}, we have an exciting offer just for you!",
    "Dear {name}, thank you for being a valued customer.",
  ];

  const handleTemplateSelect = (template) => {
    setMessage(template);
  };

  const handleSubmit = () => {
    if (message.trim() && selectedContacts.length > 0) {
      onSubmit(message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-display font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-indigo-600" />
            Compose Message
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            This message will be sent to {selectedContacts.length} selected contact{selectedContacts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Templates */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h4 className="font-semibold text-gray-900">Quick Templates</h4>
        </div>
        <div className="space-y-2">
          {templates.map((template, index) => (
            <button
              key={index}
              onClick={() => handleTemplateSelect(template)}
              className="w-full text-left p-3 bg-white rounded-lg border border-purple-200 hover:border-purple-300 hover:shadow-sm transition-all text-sm text-gray-700"
            >
              {template}
            </button>
          ))}
        </div>
        <p className="text-xs text-purple-600 mt-3">
          💡 Use {'{name}'} to personalize messages with contact names
        </p>
      </div>

      {/* Message Input */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here... Use {name} for personalization"
          className="w-full p-6 text-gray-900 outline-none resize-none min-h-[200px]"
          maxLength={maxLength * 10} // Allow multiple SMS
        />
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="flex items-center gap-6">
            <div className="text-sm">
              <span className={`font-semibold ${charCount > maxLength ? 'text-orange-600' : 'text-gray-900'}`}>
                {charCount}
              </span>
              <span className="text-gray-500"> / {maxLength * smsCount} characters</span>
            </div>
            <div className="text-sm">
              <span className="font-semibold text-gray-900">{smsCount}</span>
              <span className="text-gray-500"> SMS</span>
            </div>
          </div>

          {charCount > maxLength && (
            <div className="flex items-center gap-2 text-orange-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              Message will be sent as {smsCount} SMS
            </div>
          )}
        </div>
      </div>

      {/* Preview */}
      {message && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-3">Preview</h4>
          <div className="bg-white rounded-lg p-4 border border-indigo-200">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {message.replace('{name}', 'John Doe')}
            </p>
          </div>
          <p className="text-xs text-indigo-600 mt-2">
            Preview shown with sample name "John Doe"
          </p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          onClick={handleSubmit}
          disabled={!message.trim() || selectedContacts.length === 0}
          className="flex-1 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" />
          Submit for Approval ({selectedContacts.length} contacts)
        </button>
      </div>

      {/* Warning */}
      {selectedContacts.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-900">No contacts selected</p>
            <p className="text-sm text-yellow-700 mt-1">
              Please select at least one contact from the dashboard above to send messages
            </p>
          </div>
        </div>
      )}
    </div>
  );
}