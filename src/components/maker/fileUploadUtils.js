import Papa from 'papaparse';

const VALID_FILE_TYPES = ['.csv', '.xlsx', '.xls'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const TEST_MESSAGE_DEFAULT = 'This is a test message from Nishkaiv Bulk SMs. Please confirm receipt.';
const CONTACTS_PER_PAGE = 10;
const PHONE_REGEX = /^[0-9\s\-()+]+$/;
const MIN_PHONE_DIGITS = 10;

export const fileUtils = {
  validateFileCorruption: async (file) => {
    if (file.size === 0) throw new Error('File is empty or corrupted');
    if (file.size > MAX_FILE_SIZE) throw new Error('File size exceeds 5MB limit');

    if (file.name.endsWith('.csv')) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target.result;
            if (!content || content.trim().length === 0) {
              reject(new Error('CSV file is empty'));
            } else {
              resolve(true);
            }
          } catch {
            reject(new Error('File appears to be corrupted'));
          }
        };
        reader.onerror = () => reject(new Error('Unable to read file'));
        reader.readAsText(file.slice(0, 1024 * 10));
      });
    }
    return true;
  },

  isValidFileType: (fileName) => {
    const ext = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
    return VALID_FILE_TYPES.includes(ext);
  },

  getFileExtension: (fileName) => {
    return fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  },
};

// Validation rules for name/contact matching
// Returns an object { isValid: boolean, reasons: string[] }
const validateNameContactMatch = (name, phone) => {
  const reasons = [];

  const nameVal = String(name || '').trim();
  const phoneVal = String(phone || '').trim();

  // INVALID only if: 
  // 1. Name is missing/empty
  // 2. Phone is missing/empty
  // 3. Name is ONLY numbers (e.g., "123456")
  // 4. Phone has NO digits at all

  if (!nameVal) {
    reasons.push('missing_name');
  } else if (/^\d+$/.test(nameVal)) {
    // Name is only numbers
    reasons.push('name_is_numbers');
  }

  if (!phoneVal) {
    reasons.push('missing_phone');
  } else {
    const phoneDigits = phoneVal.replace(/\D/g, '');
    if (phoneDigits.length === 0) {
      // Phone has no digits at all
      reasons.push('no_digits_in_phone');
    }
    // Don't reject for: having less than 10 digits, or special characters (too strict)
  }

  return { isValid: reasons.length === 0, reasons };
};

export const csvUtils = {
  parseCSV: (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            if (!results.data?.length) {
              reject(new Error('CSV file contains no valid data'));
              return;
            }

            const fields = results.meta.fields || [];
            const hasName = fields.some(f => f?.toLowerCase().includes('name'));
            const hasPhone = fields.some(f => 
              f?.toLowerCase().includes('phone') ||
              f?.toLowerCase().includes('contact') ||
              f?.toLowerCase().includes('number')
            );

            if (!hasName || !hasPhone) {
              reject(new Error('CSV must contain "name" and "phone" columns'));
              return;
            }

            const contactsList = results.data.map((row, index) => {
              const nameKey = Object.keys(row).find(k => k?.toLowerCase().includes('name'));
              const phoneKey = Object.keys(row).find(k =>
                k?.toLowerCase().includes('phone') ||
                k?.toLowerCase().includes('contact') ||
                k?.toLowerCase().includes('number')
              );

              const phone = String(row[phoneKey] || '').trim();
              const name = String(row[nameKey] || '').trim();
              // Automatic validation: check name/contact match and collect reasons
              const validation = validateNameContactMatch(name, phone);

              return {
                id: index + 1,
                name: name || '',
                phone: phone || '',
                valid: validation.isValid,
                reasons: validation.reasons,
                validationStatus: validation.isValid ? 'valid' : 'invalid',
              };
            }).filter(c => c.name || c.phone); // keep rows that have at least one value

            if (!contactsList.length) {
              reject(new Error('No valid contacts found in CSV'));
              return;
            }

            resolve(contactsList);
          } catch (error) {
            reject(new Error(`Error parsing CSV: ${error.message}`));
          }
        },
        error: (error) => reject(new Error(`CSV parsing failed: ${error.message}`)),
      });
    });
  },
};

export const constants = {
  VALID_FILE_TYPES,
  MAX_FILE_SIZE,
  TEST_MESSAGE_DEFAULT,
  CONTACTS_PER_PAGE,
  PHONE_REGEX,
  MIN_PHONE_DIGITS,
};
