// Constants
export const ITEMS_PER_PAGE = 10;
export const CONTACTS_PER_PAGE = 10;

// Demo submission data
export const createDemoSubmission = () => ({
  id: 'demo-' + Date.now(),
  file: { name: 'demo_contacts.csv' },
  contacts: [
    { id: 1, name: 'Ahmed Hassan', phone: '+92300123456', valid: true },
    { id: 2, name: 'Fatima Khan', phone: '+92301234567', valid: true },
    { id: 3, name: 'Ali Raza', phone: '+92302345678', valid: true },
    { id: 4, name: 'Sara Ali', phone: '+92303456789', valid: true },
    { id: 5, name: 'Hassan Ahmed', phone: '+92304567890', valid: true },
    { id: 6, name: 'Zainab Malik', phone: '+92305678901', valid: true },
    { id: 7, name: 'Omar Khan', phone: '+92306789012', valid: true },
    { id: 8, name: 'Aisha Ibrahim', phone: '+92307890123', valid: true },
    { id: 9, name: 'Muhammad Ali', phone: '+92308901234', valid: true },
    { id: 10, name: 'Layla Ahmed', phone: '+92309012345', valid: true },
    { id: 11, name: 'Khalid Hassan', phone: '+92310123456', valid: true },
    { id: 12, name: 'Noor Hassan', phone: '+92311234567', valid: true },
  ],
  testMessage: 'This is a test message from Nishkaiv Bulk SMs. Please confirm receipt.',
  testedContact: { id: 1, name: 'Ahmed Hassan', phone: '+92300123456' },
  submittedAt: new Date().toISOString(),
  submittedBy: 'John Maker',
  status: 'pending_approval',
});

// Filter submissions by search term
export const filterSubmissions = (submissions, searchTerm) => {
  if (!searchTerm) return submissions;

  const term = searchTerm.toLowerCase();
  return submissions.filter(
    (s) =>
      s.file.name.toLowerCase().includes(term) ||
      s.verifiedContact?.name.toLowerCase().includes(term) ||
      s.verifiedContact?.phone.includes(searchTerm)
  );
};

// Filter contacts by search term
export const filterContacts = (contacts, searchTerm) => {
  if (!searchTerm) return contacts;

  const term = searchTerm.toLowerCase();
  return contacts.filter(
    (c) =>
      String(c.id).includes(term) ||
      (c.name || '').toLowerCase().includes(term) ||
      (c.phone || '').includes(term)
  );
};

// Get paginated items
export const getPaginatedItems = (items, page, perPage) => {
  const startIndex = (page - 1) * perPage;
  return items.slice(startIndex, startIndex + perPage);
};

// Calculate total pages
export const getTotalPages = (itemCount, perPage) => {
  return Math.ceil(itemCount / perPage);
};

// Format submission summary stats
export const getSubmissionStats = (submission) => {
  const totalContacts = submission.contacts.length;
  const validContacts = submission.contacts.filter((c) => c.valid).length;
  const invalidContacts = totalContacts - validContacts;

  return { totalContacts, validContacts, invalidContacts };
};
