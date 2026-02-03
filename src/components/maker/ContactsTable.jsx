export default function ContactsTable({ 
  contacts, 
  selectedContact, 
  currentPage, 
  onPageChange, 
  onSelectContact,
  contactsPerPage = 10 
}) {
  const startIdx = (currentPage - 1) * contactsPerPage;
  const endIdx = startIdx + contactsPerPage;
  const paginatedContacts = contacts.slice(startIdx, endIdx);
  const totalPages = Math.max(1, Math.ceil(contacts.length / contactsPerPage));

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-gray-900">All Contacts ({contacts.length})</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left font-semibold text-gray-700">#</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Phone</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedContacts.map((contact, idx) => (
              <tr key={idx} className={selectedContact?.id === contact.id ? 'bg-indigo-50' : 'hover:bg-gray-50'}>
                <td className={`px-6 py-3 ${selectedContact?.id === contact.id ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>{startIdx + idx + 1}</td>
                <td className={`px-6 py-3 font-medium ${contact.reasons && (contact.reasons.includes('missing_name') || contact.reasons.includes('name_is_numbers')) ? 'bg-red-50 text-red-700 font-semibold' : 'text-gray-900'}`}>{contact.name || <span className="text-gray-400">—</span>}</td>
                <td className={`px-6 py-3 font-mono ${contact.reasons && (contact.reasons.includes('missing_phone') || contact.reasons.includes('no_digits_in_phone')) ? 'bg-red-50 text-red-700 font-semibold' : 'text-gray-600'}`}>{contact.phone || <span className="text-gray-400">—</span>}</td>
                <td className="px-6 py-3">
                  {contact.valid ? (
                    <span className="badge badge-success">✓ Valid</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="badge badge-error">✗ Invalid</span>
                      {contact.reasons?.length > 0 && (
                        <span title={contact.reasons.join('; ')} className="text-xs text-gray-500 cursor-help">(why)</span>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-6 py-3">
                  <button
                    onClick={() => onSelectContact(contact)}
                    className={selectedContact?.id === contact.id ? 'btn btn-primary text-xs' : 'btn btn-secondary text-xs'}
                  >
                    {selectedContact?.id === contact.id ? 'Selected' : 'Select'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <span className="text-sm text-gray-600">
          Showing {startIdx + 1} to {Math.min(endIdx, contacts.length)} of {contacts.length}
        </span>
        {totalPages > 1 && (
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-200 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
            >
              ← Prev
            </button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => onPageChange(i + 1)}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    currentPage === i + 1
                      ? 'bg-indigo-600 text-white'
                      : 'border border-gray-200 hover:bg-white'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-200 rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
