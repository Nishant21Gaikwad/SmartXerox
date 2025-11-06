# 🧪 SmartXerox Testing with TestSprite - Quick Start Guide

## ✅ Test Plan Created!

I've created a comprehensive test plan in `TEST_PLAN.md` with **36 test cases** covering:
- Authentication & Authorization (4 tests)
- File Upload (4 tests)
- Order Management (6 tests)
- UI/UX (4 tests)
- API Endpoints (8 tests)
- Data Persistence (3 tests)
- Security (4 tests)
- Performance (3 tests)

## 🚀 Quick Start Testing

### Step 1: Verify Servers Are Running

Check that both servers are active:
- ✅ Frontend: http://localhost:5173
- ✅ Backend: http://localhost:5000

### Step 2: Manual Testing Priority List

Start with these critical tests:

#### Test 1: Student Registration & Login
```
1. Open http://localhost:5173
2. Click "Get Started" or "Register"
3. Fill form:
   - Name: Test Student
   - Email: test@example.com
   - Phone: 9876543210
   - Password: test123456
4. Submit and verify redirect to login
5. Login with same credentials
6. Verify redirect to student panel
```

#### Test 2: Upload Multiple Files
```
1. Stay logged in as student
2. Click "Select Files"
3. Choose 2-3 PDF/JPG files
4. Set different copies for each
5. Set B&W and Color for different files
6. Click Submit
7. Verify all files appear in "My Orders"
8. Verify they're grouped together
```

#### Test 3: Admin Login & Management
```
1. Open http://localhost:5173/admin/login
2. Login with:
   - Email: your-admin-email@domain.com
   - Password: your-admin-password
3. Verify you see all orders
4. Find a group with multiple files
5. Click bulk status button (e.g., "Printing")
6. Verify all files update at once
7. Click "Download File" for any order
8. Verify file downloads directly
```

### Step 3: API Testing with TestSprite

Once TestSprite is connected, use these test commands:

#### Test Registration API
```javascript
// POST /api/auth/register
{
  "endpoint": "http://localhost:5000/api/auth/register",
  "method": "POST",
  "body": {
    "name": "TestSprite User",
    "email": "testsprite@example.com",
    "password": "secure123",
    "phone": "9999888777"
  },
  "expect": {
    "status": 201,
    "body.success": true,
    "body.user.email": "testsprite@example.com"
  }
}
```

#### Test Login API
```javascript
// POST /api/auth/login
{
  "endpoint": "http://localhost:5000/api/auth/login",
  "method": "POST",
  "body": {
    "email": "testsprite@example.com",
    "password": "secure123"
  },
  "expect": {
    "status": 200,
    "body.success": true,
    "body.token": "exists"
  }
}
```

#### Test File Upload API
```javascript
// POST /api/orders
{
  "endpoint": "http://localhost:5000/api/orders",
  "method": "POST",
  "contentType": "multipart/form-data",
  "body": {
    "student_name": "TestSprite User",
    "phone_number": "9999888777",
    "copies": 5,
    "color_type": "B&W",
    "file": "[test.pdf]"
  },
  "expect": {
    "status": 201,
    "body.success": true,
    "body.data.file_url": "exists"
  }
}
```

### Step 4: Browser Testing Checklist

Open DevTools (F12) and check:

#### Console Tab
- [ ] No JavaScript errors
- [ ] No warning messages
- [ ] API calls successful

#### Network Tab
- [ ] All requests return 200/201
- [ ] File uploads complete
- [ ] Response times < 500ms

#### Application Tab (localStorage)
- [ ] `smartxerox_token` stored after login
- [ ] `smartxerox_user` contains user data
- [ ] Both cleared after logout

### Step 5: Mobile Responsive Testing

```
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Set viewport to 375px (iPhone)
4. Test all pages:
   - Landing page: ✅ Hero, features, CTA visible
   - Register: ✅ Form fields readable
   - Login: ✅ Buttons properly sized
   - Student Panel: ✅ Upload form works
   - My Orders: ✅ Cards stack vertically
   - Admin Dashboard: ✅ Orders readable
```

### Step 6: Security Testing

#### Test Invalid File Types
```
1. Login as student
2. Try uploading .exe file
Expected: Error "Only PDF, JPG, and PNG files are allowed"
```

#### Test File Size Limit
```
1. Login as student  
2. Try uploading file > 10MB
Expected: Error "File size must be less than 10MB"
```

#### Test Unauthorized Access
```
1. Open incognito window
2. Navigate to http://localhost:5173/student
Expected: Redirect to /login
```

### Step 7: Data Persistence Testing

#### Test Session Persistence
```
1. Login as student
2. Close browser completely
3. Reopen and go to http://localhost:5173/student
Expected: Still logged in (if token not expired)
```

#### Test Logout
```
1. Login as student
2. Click Logout in navbar
3. Try accessing /student
Expected: Redirect to login, token cleared
```

## 📊 Test Results Template

After each test, record results:

```markdown
## Test Results - [Date]

### Critical Path Tests
- [ ] Student Registration: PASS/FAIL
- [ ] Student Login: PASS/FAIL
- [ ] File Upload (Single): PASS/FAIL
- [ ] File Upload (Multiple): PASS/FAIL
- [ ] Order Display (Grouped): PASS/FAIL
- [ ] Admin Login: PASS/FAIL
- [ ] Admin Bulk Update: PASS/FAIL
- [ ] File Download: PASS/FAIL

### Issues Found
1. [Issue description]
   - Severity: High/Medium/Low
   - Steps to reproduce: ...
   - Expected vs Actual: ...

2. [Issue description]
   ...

### Performance Metrics
- Landing page load: [X] seconds
- Student panel load: [X] seconds
- File upload (5MB): [X] seconds
- API response time: [X] ms

### Browser Compatibility
- Chrome: ✅ PASS
- Firefox: [ ] Not tested
- Safari: [ ] Not tested
- Mobile Chrome: [ ] Not tested
```

## 🐛 Common Issues to Check

1. **Orders not appearing**
   - Check browser console for errors
   - Verify token in localStorage
   - Check Network tab for failed API calls

2. **File upload fails**
   - Check file size (must be < 10MB)
   - Check file type (PDF, JPG, PNG only)
   - Verify backend server running

3. **Admin can't update status**
   - Verify admin token valid
   - Check Authorization header sent
   - Check server logs for errors

4. **Mobile layout broken**
   - Clear browser cache
   - Test in mobile DevTools
   - Check CSS media queries

## 🎯 Success Criteria

Your SmartXerox application passes if:
- ✅ All 8 critical path tests pass
- ✅ No console errors
- ✅ Page load time < 2 seconds
- ✅ Mobile responsive on 375px viewport
- ✅ Security tests prevent unauthorized access
- ✅ Files upload successfully
- ✅ Orders display grouped correctly
- ✅ Admin can manage all orders

## 📞 Need Help?

If tests fail:
1. Check `TEST_PLAN.md` for detailed test steps
2. Review server logs in terminal
3. Check browser console for errors
4. Verify Supabase database schema created
5. Ensure environment variables set correctly

## 🚀 Next Steps

1. **Run all manual tests** from Step 2
2. **Document results** in test results template
3. **Fix any bugs** found during testing
4. **Use TestSprite** for automated testing (once API key added)
5. **Deploy** to production once all tests pass

Happy Testing! 🎉
