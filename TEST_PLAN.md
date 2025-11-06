# SmartXerox - TestSprite Test Plan

## Project Overview
- **Project**: SmartXerox - Digital Print Ordering System
- **Frontend**: http://localhost:5173 (React + Vite)
- **Backend**: http://localhost:5000 (Node.js + Express)
- **Database**: Supabase PostgreSQL

## Test Categories

### 1. Authentication & Authorization Tests

#### Test 1.1: Student Registration
**Priority**: High
**Steps**:
1. Navigate to http://localhost:5173/register
2. Fill form with valid data:
   - Name: "Test Student"
   - Email: "test@student.com"
   - Phone: "9876543210"
   - Password: "test123456"
   - Confirm Password: "test123456"
3. Click "Register" button
4. Verify redirect to /login
5. Verify success message appears

**Expected Results**:
- ✅ Redirect to login page
- ✅ Success message displayed
- ✅ Student record created in database
- ✅ Password is hashed (not plain text)

#### Test 1.2: Student Login
**Priority**: High
**Steps**:
1. Navigate to http://localhost:5173/login
2. Enter credentials:
   - Email: "test@student.com"
   - Password: "test123456"
3. Click "Login" button
4. Verify redirect to /student
5. Verify user name appears in navbar

**Expected Results**:
- ✅ JWT token stored in localStorage
- ✅ User data stored in localStorage
- ✅ Redirect to student panel
- ✅ Navbar shows user name and email

#### Test 1.3: Admin Login
**Priority**: High
**Steps**:
1. Navigate to http://localhost:5173/admin/login
2. Enter admin credentials:
   - Email: "your-admin-email@domain.com"
   - Password: "your-admin-password"
3. Click "Login" button
4. Verify redirect to /admin/dashboard

**Expected Results**:
- ✅ Admin token stored
- ✅ Redirect to admin dashboard
- ✅ Can see all orders

#### Test 1.4: Protected Route Access
**Priority**: High
**Steps**:
1. Open incognito/private window
2. Try to access http://localhost:5173/student directly
3. Verify redirect to /login

**Expected Results**:
- ✅ Unauthorized access blocked
- ✅ Redirect to login page

---

### 2. File Upload Tests

#### Test 2.1: Single File Upload
**Priority**: High
**Steps**:
1. Login as student
2. Navigate to student panel
3. Click "Select Files"
4. Choose 1 PDF file (< 10MB)
5. Set copies: 5
6. Set type: B&W
7. Click "Submit"

**Expected Results**:
- ✅ File uploaded successfully
- ✅ Order created in database
- ✅ File stored in Supabase Storage
- ✅ Order appears in "My Orders"
- ✅ Success message displayed

#### Test 2.2: Multiple Files Upload (Batch)
**Priority**: High
**Steps**:
1. Login as student
2. Select 3 different files at once
3. Set different settings for each:
   - File 1: 2 copies, B&W
   - File 2: 5 copies, Color
   - File 3: 1 copy, B&W
4. Click "Submit" once

**Expected Results**:
- ✅ All 3 files uploaded
- ✅ 3 separate orders created
- ✅ Orders grouped together in display
- ✅ Individual settings preserved

#### Test 2.3: Invalid File Type
**Priority**: Medium
**Steps**:
1. Login as student
2. Try to upload .exe or .txt file

**Expected Results**:
- ✅ Upload rejected
- ✅ Error message: "Only PDF, JPG, and PNG files are allowed"

#### Test 2.4: File Size Limit
**Priority**: Medium
**Steps**:
1. Login as student
2. Try to upload file > 10MB

**Expected Results**:
- ✅ Upload rejected
- ✅ Error message: "File size must be less than 10MB"

---

### 3. Order Management Tests

#### Test 3.1: View My Orders (Student)
**Priority**: High
**Steps**:
1. Login as student
2. Upload several files
3. Check "My Orders" section

**Expected Results**:
- ✅ Only student's orders visible
- ✅ Orders grouped by submission time
- ✅ Student info shown once per group
- ✅ All files listed under each group
- ✅ Status badges displayed correctly

#### Test 3.2: Delete Order (Student)
**Priority**: Medium
**Steps**:
1. Login as student
2. Find an order
3. Click "Delete" button
4. Confirm deletion

**Expected Results**:
- ✅ Order removed from database
- ✅ File deleted from storage
- ✅ Order disappears from UI
- ✅ Success message shown

#### Test 3.3: View All Orders (Admin)
**Priority**: High
**Steps**:
1. Login as admin
2. View admin dashboard

**Expected Results**:
- ✅ All orders from all students visible
- ✅ Orders grouped by student
- ✅ Statistics displayed correctly
- ✅ Filter by status works

#### Test 3.4: Update Single Order Status
**Priority**: High
**Steps**:
1. Login as admin
2. Find order with single file
3. Change status from dropdown
4. Verify status updated

**Expected Results**:
- ✅ Status updated in database
- ✅ Status badge changes immediately
- ✅ No page reload needed

#### Test 3.5: Bulk Status Update
**Priority**: High
**Steps**:
1. Login as admin
2. Upload 3 files as student (from same submission)
3. Login as admin
4. Find the group of 3 files
5. Click bulk status button (e.g., "Printing")

**Expected Results**:
- ✅ All 3 files status updated at once
- ✅ Individual dropdowns not shown for multi-file groups
- ✅ Status updates reflected immediately

#### Test 3.6: Download File (Admin)
**Priority**: High
**Steps**:
1. Login as admin
2. Find an order
3. Click "Download File"

**Expected Results**:
- ✅ File downloads directly to device
- ✅ No new tab opens
- ✅ Correct file downloaded

---

### 4. UI/UX Tests

#### Test 4.1: Landing Page
**Priority**: Medium
**Steps**:
1. Navigate to http://localhost:5173/
2. Check all sections load

**Expected Results**:
- ✅ Hero section visible
- ✅ Features section loads
- ✅ "How It Works" section displays
- ✅ CTA buttons work
- ✅ Footer loads

#### Test 4.2: Mobile Responsiveness
**Priority**: High
**Steps**:
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test at 375px width (mobile)
4. Check all pages

**Expected Results**:
- ✅ Navbar responsive (logo + buttons fit)
- ✅ "Get Started" button sized properly
- ✅ Forms readable on mobile
- ✅ Order cards stack vertically
- ✅ No horizontal scroll

#### Test 4.3: Grouped Order Display
**Priority**: High
**Steps**:
1. Upload 3 files as student
2. View "My Orders"

**Expected Results**:
- ✅ Student name/phone shown once
- ✅ All 3 files listed below
- ✅ No repeated student info
- ✅ Time remaining shown
- ✅ Summary stats removed (as per user request)

#### Test 4.4: Navbar User Info
**Priority**: Medium
**Steps**:
1. Login as student
2. Check navbar

**Expected Results**:
- ✅ User icon + name displayed
- ✅ Email shown below name
- ✅ Logout button visible
- ✅ Logout works correctly

---

### 5. API Tests

#### Test 5.1: POST /api/auth/register
**Endpoint**: http://localhost:5000/api/auth/register
**Method**: POST
**Body**:
```json
{
  "name": "API Test User",
  "email": "apitest@example.com",
  "password": "password123",
  "phone": "9998887777"
}
```
**Expected**: 201 Created, user data returned

#### Test 5.2: POST /api/auth/login
**Endpoint**: http://localhost:5000/api/auth/login
**Method**: POST
**Body**:
```json
{
  "email": "apitest@example.com",
  "password": "password123"
}
```
**Expected**: 200 OK, JWT token returned

#### Test 5.3: POST /api/orders
**Endpoint**: http://localhost:5000/api/orders
**Method**: POST (multipart/form-data)
**Body**:
- student_name: "Test Student"
- phone_number: "9876543210"
- copies: 5
- color_type: "B&W"
- file: [PDF file]

**Expected**: 201 Created, order with file URL returned

#### Test 5.4: GET /api/orders/:phoneNumber
**Endpoint**: http://localhost:5000/api/orders/9876543210
**Method**: GET
**Expected**: 200 OK, array of orders for that phone

#### Test 5.5: POST /api/admin/login
**Endpoint**: http://localhost:5000/api/admin/login
**Method**: POST
**Body**:
```json
{
  "email": "your-admin-email@domain.com",
  "password": "your-admin-password"
}
```
**Expected**: 200 OK, admin JWT token

#### Test 5.6: GET /api/admin/orders
**Endpoint**: http://localhost:5000/api/admin/orders
**Method**: GET
**Headers**: Authorization: Bearer {admin_token}
**Expected**: 200 OK, all orders array

#### Test 5.7: PUT /api/admin/orders/:id/status
**Endpoint**: http://localhost:5000/api/admin/orders/{order_id}/status
**Method**: PUT
**Headers**: Authorization: Bearer {admin_token}
**Body**:
```json
{
  "status": "Printing"
}
```
**Expected**: 200 OK, updated order

#### Test 5.8: GET /api/admin/stats
**Endpoint**: http://localhost:5000/api/admin/stats
**Method**: GET
**Headers**: Authorization: Bearer {admin_token}
**Expected**: 200 OK, statistics object

---

### 6. Data Persistence Tests

#### Test 6.1: Auto-Delete After 24 Hours
**Priority**: High
**Steps**:
1. Create test order
2. Manually update `created_at` in database to 25 hours ago
3. Wait for cron job or trigger manually
4. Check if order deleted

**Expected Results**:
- ✅ Order deleted from database
- ✅ File deleted from storage
- ✅ Cleanup logged in console

#### Test 6.2: Session Persistence
**Priority**: Medium
**Steps**:
1. Login as student
2. Close browser
3. Reopen and navigate to site

**Expected Results**:
- ✅ Still logged in (token valid)
- ✅ User data persists
- ✅ Can access student panel

#### Test 6.3: Logout Clears Session
**Priority**: Medium
**Steps**:
1. Login as student
2. Click logout
3. Try to access /student

**Expected Results**:
- ✅ Token cleared from localStorage
- ✅ User data cleared
- ✅ Redirected to login page

---

### 7. Security Tests

#### Test 7.1: SQL Injection Prevention
**Priority**: High
**Steps**:
1. Try SQL injection in login form
   - Email: "admin@test.com' OR '1'='1"
   - Password: "anything"

**Expected Results**:
- ✅ Login fails
- ✅ No database breach
- ✅ Proper error message

#### Test 7.2: XSS Prevention
**Priority**: High
**Steps**:
1. Register with name: "<script>alert('XSS')</script>"
2. Check if script executes

**Expected Results**:
- ✅ Script not executed
- ✅ Text displayed as plain text
- ✅ HTML escaped

#### Test 7.3: JWT Token Expiration
**Priority**: Medium
**Steps**:
1. Login as student (token expires in 7 days)
2. Manually expire token
3. Try to access protected route

**Expected Results**:
- ✅ Access denied
- ✅ Redirect to login
- ✅ Proper error message

#### Test 7.4: Password Hashing
**Priority**: High
**Steps**:
1. Register a user
2. Check database directly
3. Verify password is hashed

**Expected Results**:
- ✅ Password not plain text
- ✅ Bcrypt hash format
- ✅ Cannot reverse engineer

---

### 8. Performance Tests

#### Test 8.1: Page Load Time
**Target**: < 2 seconds
**Steps**:
1. Open DevTools Network tab
2. Clear cache
3. Load each page
4. Check load time

**Expected Results**:
- ✅ Landing page: < 2s
- ✅ Student panel: < 2s
- ✅ Admin dashboard: < 2s

#### Test 8.2: API Response Time
**Target**: < 500ms
**Steps**:
1. Use Network tab
2. Make API calls
3. Check response times

**Expected Results**:
- ✅ Auth endpoints: < 300ms
- ✅ Order GET: < 400ms
- ✅ Order POST: < 2s (including upload)

#### Test 8.3: File Upload Time
**Target**: < 5 seconds per file
**Steps**:
1. Upload 5MB PDF
2. Measure time

**Expected Results**:
- ✅ Upload completes < 5s
- ✅ Progress indicator works
- ✅ No timeout errors

---

## Test Execution Checklist

### Pre-Testing Setup
- [ ] Servers running (backend port 5000, frontend port 5173)
- [ ] Supabase database schema created
- [ ] Supabase storage bucket created
- [ ] Test files prepared (PDF, JPG, PNG < 10MB)
- [ ] Large test file (> 10MB) for rejection testing
- [ ] Invalid file (.exe) for rejection testing

### Test Environment
- [ ] Chrome browser (latest)
- [ ] DevTools ready
- [ ] Network tab monitoring
- [ ] Console tab open for errors

### Post-Testing
- [ ] Document failed tests
- [ ] Screenshot errors
- [ ] Check server logs
- [ ] Clean up test data

## Bug Report Template

**Bug Title**: [Brief description]
**Priority**: High/Medium/Low
**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Result**:

**Actual Result**:

**Screenshots**: [Attach]

**Console Errors**: [Paste]

**Environment**:
- Browser: 
- OS: 
- Date: 

---

## Test Results Summary

| Category | Total Tests | Passed | Failed | Blocked |
|----------|-------------|--------|--------|---------|
| Authentication | 4 | | | |
| File Upload | 4 | | | |
| Order Management | 6 | | | |
| UI/UX | 4 | | | |
| API | 8 | | | |
| Data Persistence | 3 | | | |
| Security | 4 | | | |
| Performance | 3 | | | |
| **TOTAL** | **36** | **0** | **0** | **0** |

---

## Critical Path Tests (Must Pass)

1. ✅ Student can register
2. ✅ Student can login
3. ✅ Student can upload files
4. ✅ Orders display correctly
5. ✅ Admin can login
6. ✅ Admin can manage orders
7. ✅ Files auto-delete after 24h
8. ✅ Mobile responsive

## Known Issues
[List any known bugs or limitations]

## Test Notes
[Add any additional observations]
