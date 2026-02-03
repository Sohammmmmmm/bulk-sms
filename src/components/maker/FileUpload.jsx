import { useState, useRef } from 'react';
import { FileText } from 'lucide-react';
import { apiClient, API_ENDPOINTS } from '../../utils/apiConfig';
import { fileUtils, csvUtils, constants } from './fileUploadUtils';
import UploadArea from './UploadArea';
import ScanProgress from './ScanProgress';
import ScanResult from './ScanResult';
import ContactsTable from './ContactsTable';
import TestMessageSection from './TestMessageSection';
import TestResult from './TestResult';
import SubmitApproval from './SubmitApproval';

export default function FileUpload({ onFileProcessed, onWorkflowComplete }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [testMessage, setTestMessage] = useState(constants.TEST_MESSAGE_DEFAULT);
  const [testSent, setTestSent] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [bulkMessage, setBulkMessage] = useState('');
  const [contactsCurrentPage, setContactsCurrentPage] = useState(1);
  const fileInputRef = useRef(null);

  const simulateVirusScan = async (scannedFile) => {
    setIsScanning(true);
    setScanResult(null);

    try {
      await fileUtils.validateFileCorruption(scannedFile);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const isClean = Math.random() > 0.1;
      setScanResult({
        isClean,
        fileName: scannedFile.name,
        fileSize: (scannedFile.size / 1024).toFixed(2) + ' KB',
        scanTime: new Date().toLocaleTimeString(),
      });
      setIsScanning(false);
      return isClean;
    } catch (error) {
      setScanResult({
        isClean: false,
        fileName: scannedFile.name,
        error: error.message,
      });
      setIsScanning(false);
      return false;
    }
  };

  const handleFileSelect = async (selectedFile) => {
    if (!selectedFile) return;

    if (!fileUtils.isValidFileType(selectedFile.name)) {
      setScanResult({
        isClean: false,
        fileName: selectedFile.name,
        error: 'Invalid file type. Please upload CSV or Excel files only.',
      });
      return;
    }

    setFile(selectedFile);
    setTestSent(false);
    setSelectedContact(null);
    setTestResult(null);
    setContactsCurrentPage(1);

    const isClean = await simulateVirusScan(selectedFile);

    if (isClean && fileUtils.getFileExtension(selectedFile.name) === '.csv') {
      try {
        const parsedContacts = await csvUtils.parseCSV(selectedFile);
        setContacts(parsedContacts);
        onFileProcessed({
          file: selectedFile,
          contacts: parsedContacts,
          scanResult,
        });
      } catch (error) {
        setScanResult({
          isClean: false,
          fileName: selectedFile.name,
          error: error.message,
        });
        setContacts([]);
      }
    }
  };

  const sendTestMessage = async () => {
    if (!selectedContact || !testMessage.trim()) {
      alert('Please select a contact and enter a test message');
      return;
    }

    setIsSendingTest(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const success = Math.random() > 0.2;
    setTestResult({
      success,
      message: success 
        ? `Test message sent successfully to ${selectedContact.name} (${selectedContact.phone})`
        : `Failed to send test message to ${selectedContact.phone}`,
      timestamp: new Date().toLocaleTimeString(),
    });
    setIsSendingTest(false);
    setTestSent(true);
  };

  const submitForApproval = async () => {
    if (!testSent || !testResult?.success) {
      alert('Please send a successful test message before submitting for approval');
      return;
    }

    const validContacts = contacts.filter(c => c.valid);
    if (validContacts.length === 0) {
      alert('No valid contacts to submit');
      return;
    }

    try {
      const submission = {
        file,
        contacts: validContacts,
        testMessage,
        bulkMessage: bulkMessage || testMessage,
        testedContact: selectedContact,
        submittedAt: new Date().toISOString(),
        status: 'pending_approval',
      };

      try {
        await apiClient.uploadFile(API_ENDPOINTS.SUBMISSIONS.CREATE, file, {
          contacts: JSON.stringify(validContacts),
          testMessage,
          testedContact: JSON.stringify(selectedContact),
          bulkMessage: bulkMessage || testMessage,
        });
      } catch (apiError) {
        console.warn('Backend API not available, using localStorage:', apiError.message);
      }

      const submissions = JSON.parse(localStorage.getItem('smsSubmissions') || '[]');
      submissions.push(submission);
      localStorage.setItem('smsSubmissions', JSON.stringify(submissions));

      onWorkflowComplete?.(submission);
      alert('File submitted for approval! The checker will review it soon.');
      resetUpload();
    } catch (error) {
      console.error('Error submitting for approval:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setScanResult(null);
    setContacts([]);
    setIsScanning(false);
    setTestSent(false);
    setSelectedContact(null);
    setTestResult(null);
    setBulkMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  return (
    <div className="space-y-6">
      {!file && (
        <UploadArea
          isDragging={isDragging}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onUpload={handleFileSelect}
          fileInputRef={fileInputRef}
        />
      )}

      {isScanning && <ScanProgress fileName={file?.name} />}

      {scanResult && !isScanning && (
        <ScanResult scanResult={scanResult} contacts={contacts} onReset={resetUpload} />
      )}

      {file && !isScanning && scanResult?.isClean && contacts.length > 0 && (
        <div className="space-y-4 animate-slide-up">
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center gap-3">
            <FileText className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-indigo-900">{file.name}</p>
              <p className="text-sm text-indigo-600">
                {contacts.length} contacts loaded • {contacts.filter(c => c.valid).length} valid
              </p>
            </div>
          </div>

          <ContactsTable
            contacts={contacts}
            selectedContact={selectedContact}
            currentPage={contactsCurrentPage}
            onPageChange={setContactsCurrentPage}
            onSelectContact={setSelectedContact}
            contactsPerPage={constants.CONTACTS_PER_PAGE}
          />

          <TestMessageSection
            selectedContact={selectedContact}
            testMessage={testMessage}
            onTestMessageChange={setTestMessage}
            bulkMessage={bulkMessage}
            onBulkMessageChange={setBulkMessage}
            isSendingTest={isSendingTest}
            testSent={testSent}
            onSendTest={sendTestMessage}
          />

          {testResult && <TestResult testResult={testResult} />}

          {testSent && testResult?.success && (
            <SubmitApproval
              validCount={contacts.filter(c => c.valid).length}
              onSubmit={submitForApproval}
            />
          )}
        </div>
      )}
    </div>
  );
}