# BulkSMS Pro - Complete Workflow Guide

## System Overview
BulkSMS Pro is a two-role SMS management system with file validation, test messaging, and approval workflow.

---

## **MAKER WORKFLOW**

### Step 1: Upload & File Validation
- **Access**: Maker Dashboard → "Upload & Submit Campaign" section
- **Actions**:
  1. Click to upload or drag-and-drop a CSV file
  2. File is automatically validated for:
     - File type (CSV, XLSX, XLS)
     - File size (max 5MB)
     - File integrity (not corrupted/empty)
  3. System performs virus scan simulation (2 seconds)
  4. CSV is parsed and contacts are extracted
  5. Contacts are validated:
     - Must have "name" and "phone" columns
     - Phone numbers must be valid format (10+ digits)

**UI Elements**:
- Drag-and-drop upload area with visual feedback
- Real-time scanning progress with shield icon
- Success/Failure indicators with detailed messages
- Contact count display

### Step 2: Select Contact & Send Test Message
- **Purpose**: Verify that the message delivery works before submitting
- **Process**:
  1. Select one contact from the loaded list
  2. Enter test message (or use pre-filled message)
  3. Click "Send Test Message" button
  4. System simulates sending (2 seconds)
  5. Receive confirmation of success/failure

**UI Elements**:
- Contact dropdown with name + phone + validity status
- Textarea for custom test message
- "Send Test Message" button (disabled until contact selected)
- Test result notification (green success or red failure)

### Step 3: Submit for Approval
- **Available**: Only after successful test message
- **Action**: Click "Submit for Approval" button
- **What Happens**:
  - File submission is saved to localStorage
  - Submission includes:
    - Original CSV file
    - All contacts (valid only)
    - Test message content
    - Tested contact details
    - Submission timestamp
  - Success notification appears
  - File upload resets for next submission

**UI Elements**:
- Info box showing file validation status
- "Submit for Approval" button (enabled only after test)
- Success alert notification

### Monitoring
- **Activity Log** (right sidebar):
  - Shows recent submissions
  - Status: Pending, Approved, Rejected
  - File name and contact count
  - Timestamp

---

## **CHECKER WORKFLOW**

### Step 1: View Pending Submissions
- **Access**: Checker Dashboard
- **View**:
  - List of all pending submissions in left column
  - Click any submission to review details

**UI Elements**:
- Submissions list with:
  - File icon and name
  - Contact count
  - Submission date
  - Active/selected state highlighting

### Step 2: Review Submission Details
- **Visible Information**:
  - File name and status badge
  - Total contacts loaded
  - Valid contacts count
  - **Test Message Verification**:
    - Contact name who received test
    - Phone number
    - Exact message content in preview box
  - **Contact List Preview**:
    - First 5 contacts displayed in table
    - Name, Phone, Validity status
    - "... and X more contacts" indicator

**UI Elements**:
- Info boxes showing contact statistics
- Blue alert box with test message details
- Table with contact preview
- Pagination indicator

### Step 3: Approve & Send
- **Decision Point**: Review test message results and contact list
- **If Approving**:
  1. Click "Approve & Send SMS" button
  2. System shows sending progress (2.5 seconds)
  3. SMS is "sent" to all contacts
  4. Confirmation message shows count of messages sent
  5. Submission moves to approved status
  6. Automatically removed from pending list

- **If Rejecting**:
  1. Click "Reject" button
  2. Confirmation dialog appears
  3. Submission status changes to "rejected"
  4. Removed from pending list
  5. Maker is notified

**UI Elements**:
- "Approve & Send SMS" button (primary, blue)
- "Reject" button (secondary, white)
- Progress animation during sending
- Success message with timestamp and count

---

## **FILE HANDLING & VALIDATION**

### Supported File Formats
- CSV (.csv) - Primary format
- Excel (.xlsx, .xls) - For future expansion

### Validation Checks

#### File Level
```
✓ File type validation (extension check)
✓ File size check (max 5MB)
✓ File integrity check (not empty/corrupted)
✓ Virus scan simulation (90% clean rate)
```

#### CSV Level
```
✓ Must contain "name" column (case-insensitive)
✓ Must contain "phone" column (or "contact"/"number")
✓ Data rows must not be empty
```

#### Contact Level
```
✓ Phone must match pattern: [0-9\s\-\+()]+
✓ Phone must have min 10 digits
✓ Name and phone both required
✓ Trimmed whitespace automatically
```

### Error Handling
- Invalid file type → Red error box with message
- Corrupted file → Red error box with specific error
- Missing columns → CSV parsing error message
- Empty contacts → "No valid contacts found" message
- Test message failure → Red notification with retry option

---

## **DATA STORAGE**

### LocalStorage Keys
- `smsSubmissions`: Array of all file submissions
  - Each submission contains:
    - `file`: Original file object
    - `contacts`: Array of contact objects
    - `testMessage`: Message text
    - `testedContact`: Contact used for testing
    - `submittedAt`: ISO timestamp
    - `status`: "pending_approval" | "approved" | "rejected"
    - `sentAt`: ISO timestamp (if approved)
    - `rejectedAt`: ISO timestamp (if rejected)

### Contact Object Structure
```javascript
{
  id: number,
  name: string,
  phone: string,
  selected: boolean,
  valid: boolean          // Based on validation rules
}
```

---

## **USER EXPERIENCE ENHANCEMENTS**

### Animations
- **Slide Up**: File scan results, contact selection panel
- **Fade In**: Test results, approval confirmation
- **Scale In**: Success notifications
- **Smooth Transitions**: All interactions

### Visual Feedback
- Drag-and-drop hover states (blue border, background)
- Button hover effects (shadow, lift effect)
- Loading states with spinner animations
- Color-coded status badges (green, orange, red, blue)
- Progress indicators for long-running operations

### Accessibility
- Proper form labels
- Disabled states for unavailable actions
- Focus rings on interactive elements
- Semantic HTML structure
- Clear error messages

---

## **COMPLETE WORKFLOW EXAMPLE**

### Maker Perspective
```
1. Open Maker Dashboard
2. Click upload area → Select "contacts.csv"
3. File validates and scans ✓
4. 150 contacts loaded, 145 valid
5. Select "John Smith" from dropdown
6. Edit test message (optional)
7. Click "Send Test Message"
8. Receive success notification ✓
9. Click "Submit for Approval"
10. See "Submitted successfully" alert
11. Check Activity Log → shows pending submission
```

### Checker Perspective
```
1. Open Checker Dashboard
2. See "1 pending" in badge
3. Click submission in list
4. Review contact count (145 valid)
5. Read test message sent to John Smith
6. Preview first 5 contacts
7. Click "Approve & Send SMS"
8. See sending progress animation
9. Receive "Sent to 145 contacts" confirmation
10. Submission disappears from pending list
11. Activity shows as "Approved"
```

---

## **KEY FEATURES**

✅ **File Validation**
  - Format checking
  - Size limits
  - Integrity verification
  - Corruption detection

✅ **Virus Scanning**
  - Simulated scan with progress
  - 90% clean rate for demo
  - Safe/threat indicators

✅ **Contact Management**
  - Automatic parsing from CSV
  - Phone number validation
  - Invalid contact filtering
  - Contact preview in approval

✅ **Test Messaging**
  - Select specific contact
  - Custom message support
  - Send simulation
  - Success/failure feedback

✅ **Approval Workflow**
  - Reviewed by checker
  - Test verification
  - Batch SMS sending
  - Status tracking

✅ **UI/UX**
  - Modern, clean design
  - Responsive layout
  - Smooth animations
  - Comprehensive feedback
  - Activity tracking

---

## **TROUBLESHOOTING**

### File Upload Not Responding
- Check file size (max 5MB)
- Verify file type (CSV/Excel)
- Ensure file is not corrupted
- Try re-uploading

### Validation Errors
- **"CSV must contain name and phone columns"**
  - Ensure CSV has columns named "name" and "phone" (case-insensitive)
  - Check for extra spaces in column headers

- **"No valid contacts found"**
  - Verify phone numbers are 10+ digits
  - Remove special characters from phone if not in [0-9\s\-\+()]

- **"File is empty or corrupted"**
  - Re-create CSV file
  - Ensure UTF-8 encoding
  - Try different file

### Test Message Failures
- Simulate again by re-selecting contact
- Verify phone number is valid format
- Success rate is ~80% (by design)

### Submission Not Appearing in Checker
- Refresh Checker Dashboard
- Check localStorage (DevTools → Application → localStorage)
- Verify submission status is "pending_approval"

---

## **VERSION**
**BulkSMS Pro v1.0**
- Built with React 19.2.0
- Styled with Tailwind CSS 4.1.18
- Routing with React Router 7.13.0
- Icons with Lucide React 0.563.0
- CSV Parsing with PapaParse 5.5.3

---

**Created**: January 28, 2026
**Last Updated**: January 28, 2026
