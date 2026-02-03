import { useState, useCallback } from 'react';
import Papa from 'papaparse';

/**
 * Custom hook for handling file uploads with validation, virus scanning, and CSV parsing
 * @returns {Object} File upload state and methods
 */
export default function useFileUpload() {
  const [file, setFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [scanResult, setScanResult] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null);

  /**
   * Validate file type and size
   */
  const validateFile = useCallback((file) => {
    const validTypes = ['.csv', '.xlsx', '.xls'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validTypes.includes(fileExtension)) {
      return {
        valid: false,
        error: 'Invalid file type. Please upload CSV or Excel files only.'
      };
    }
    
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size exceeds 5MB limit.'
      };
    }
    
    return { valid: true };
  }, []);

  /**
   * Simulate virus scanning
   * In production, this should call an actual antivirus API
   */
  const simulateVirusScan = useCallback(async (file) => {
    setIsScanning(true);
    setScanResult(null);
    setError(null);

    try {
      // Simulate scanning delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate virus detection (90% clean rate for demo)
      const isClean = Math.random() > 0.1;
      
      const result = {
        isClean,
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(2) + ' KB',
        scanTime: new Date().toLocaleTimeString(),
        scanDate: new Date().toLocaleDateString(),
      };

      if (!isClean) {
        result.threat = 'Suspicious file detected';
        result.threatLevel = 'high';
      }

      setScanResult(result);
      return result;
    } catch (err) {
      const errorResult = {
        isClean: false,
        error: 'Scanning failed. Please try again.',
        fileName: file.name,
      };
      setScanResult(errorResult);
      setError(err.message);
      return errorResult;
    } finally {
      setIsScanning(false);
    }
  }, []);

  /**
   * Parse CSV file and extract contacts
   */
  const parseCSV = useCallback((file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        trimHeaders: true,
        complete: (results) => {
          try {
            // Validate required columns
            const fields = results.meta.fields || [];
            const hasName = fields.some(f => 
              f.toLowerCase().includes('name')
            );
            const hasPhone = fields.some(f => 
              f.toLowerCase().includes('phone') || 
              f.toLowerCase().includes('contact') || 
              f.toLowerCase().includes('number') ||
              f.toLowerCase().includes('mobile')
            );

            if (!hasName || !hasPhone) {
              reject(new Error('CSV must contain "name" and "phone/contact/number" columns'));
              return;
            }

            // Find the actual column names
            const nameKey = fields.find(k => k.toLowerCase().includes('name'));
            const phoneKey = fields.find(k => 
              k.toLowerCase().includes('phone') || 
              k.toLowerCase().includes('contact') || 
              k.toLowerCase().includes('number') ||
              k.toLowerCase().includes('mobile')
            );

            // Extract and validate contacts
            const contactsList = results.data
              .map((row, index) => {
                const name = row[nameKey]?.trim();
                const phone = row[phoneKey]?.trim();

                // Skip empty rows
                if (!name && !phone) return null;

                // Validate phone number format (basic validation)
                const phoneRegex = /^[\d\s-()+]+$/;
                if (phone && !phoneRegex.test(phone)) {
                  console.warn(`Invalid phone number at row ${index + 1}: ${phone}`);
                }

                return {
                  id: index + 1,
                  name: name || 'Unknown',
                  phone: phone || '',
                  selected: false,
                  valid: !!(name && phone && phoneRegex.test(phone)),
                  rawData: row, // Keep original data for reference
                };
              })
              .filter(contact => contact !== null);

            // Check if we have any valid contacts
            const validContacts = contactsList.filter(c => c.valid);
            if (validContacts.length === 0) {
              reject(new Error('No valid contacts found in the CSV file'));
              return;
            }

            resolve(contactsList);
          } catch (err) {
            reject(new Error(`Error parsing CSV: ${err.message}`));
          }
        },
        error: (error) => {
          reject(new Error(`CSV parsing error: ${error.message}`));
        },
      });
    });
  }, []);

  /**
   * Parse Excel file (XLSX/XLS)
   * Note: Requires additional library like 'xlsx' for full implementation
   */
  const parseExcel = useCallback(async () => {
    // For now, return error. In production, use 'xlsx' library
    throw new Error('Excel file parsing not yet implemented. Please use CSV format.');
    
    // Implementation with 'xlsx' library:
    // import * as XLSX from 'xlsx';
    // const data = await file.arrayBuffer();
    // const workbook = XLSX.read(data);
    // const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    // const jsonData = XLSX.utils.sheet_to_json(worksheet);
    // return processContacts(jsonData);
  }, []);

  /**
   * Handle file selection and processing
   */
  const handleFileSelect = useCallback(async (selectedFile) => {
    if (!selectedFile) return;

    setError(null);
    setFile(selectedFile);
    setContacts([]);
    setScanResult(null);

    try {
      // Step 1: Validate file
      const validation = validateFile(selectedFile);
      if (!validation.valid) {
        setScanResult({
          isClean: false,
          fileName: selectedFile.name,
          error: validation.error,
        });
        setError(validation.error);
        return;
      }

      // Step 2: Scan for viruses
      const scanRes = await simulateVirusScan(selectedFile);
      
      if (!scanRes.isClean) {
        setError(scanRes.threat || 'File contains threats');
        return;
      }

      // Step 3: Parse file based on type
      const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
      
      let parsedContacts;
      if (fileExtension === '.csv') {
        parsedContacts = await parseCSV(selectedFile);
      } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
        parsedContacts = await parseExcel(selectedFile);
      } else {
        throw new Error('Unsupported file format');
      }

      setContacts(parsedContacts);
      
      // Update scan result with success info
      setScanResult(prev => ({
        ...prev,
        contactsFound: parsedContacts.length,
        validContacts: parsedContacts.filter(c => c.valid).length,
      }));

    } catch (err) {
      const errorMessage = err.message || 'Error processing file';
      setError(errorMessage);
      setScanResult(prev => ({
        ...prev,
        isClean: false,
        error: errorMessage,
      }));
    }
  }, [validateFile, simulateVirusScan, parseCSV, parseExcel]);

  /**
   * Simulate file upload to server with progress
   */
  const uploadFile = useCallback(async (fileToUpload, additionalData = {}) => {
    if (!fileToUpload) {
      throw new Error('No file selected');
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Simulate upload progress
      const totalChunks = 10;
      for (let i = 0; i <= totalChunks; i++) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadProgress(Math.round((i / totalChunks) * 100));
      }

      // Simulate API call
      // In production, replace with actual API call:
      // const formData = new FormData();
      // formData.append('file', fileToUpload);
      // formData.append('data', JSON.stringify(additionalData));
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData,
      // });
      // return await response.json();

      return {
        success: true,
        fileId: `file_${Date.now()}`,
        fileName: fileToUpload.name,
        uploadedAt: new Date().toISOString(),
        ...additionalData,
      };

    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setFile(null);
    setIsScanning(false);
    setIsUploading(false);
    setUploadProgress(0);
    setScanResult(null);
    setContacts([]);
    setError(null);
  }, []);

  /**
   * Remove a specific contact from the list
   */
  const removeContact = useCallback((contactId) => {
    setContacts(prev => prev.filter(c => c.id !== contactId));
  }, []);

  /**
   * Update a contact's information
   */
  const updateContact = useCallback((contactId, updates) => {
    setContacts(prev => prev.map(c => 
      c.id === contactId ? { ...c, ...updates } : c
    ));
  }, []);

  return {
    // State
    file,
    isScanning,
    isUploading,
    uploadProgress,
    scanResult,
    contacts,
    error,
    
    // Methods
    handleFileSelect,
    uploadFile,
    reset,
    removeContact,
    updateContact,
    validateFile,
    
    // Computed values
    hasFile: !!file,
    isClean: scanResult?.isClean || false,
    contactCount: contacts.length,
    validContactCount: contacts.filter(c => c.valid).length,
  };
}