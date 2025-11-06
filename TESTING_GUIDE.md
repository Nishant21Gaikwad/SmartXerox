# SmartXerox Testing Guide

## Setting Up TestSprite

TestSprite is an MCP server for automated testing. Here's how to configure it:

### Option 1: VS Code Configuration

1. Open VS Code Settings (Ctrl+,)
2. Search for "MCP Servers" or edit `settings.json`
3. Add the following configuration:

```json
{
  "mcpServers": {
    "TestSprite": {
      "command": "npx",
      "args": [
        "@testsprite/testsprite-mcp@latest"
      ],
      "env": {
        "API_KEY": "your-testsprite-api-key-here"
      }
    }
  }
}
```

### Option 2: Claude Desktop Configuration

1. Open Claude Desktop settings
2. Navigate to MCP Servers configuration
3. Add TestSprite configuration from above

### Option 3: Project-Level Setup

If you want to use TestSprite programmatically in your project:

```bash
# Install TestSprite
npm install -D @testsprite/testsprite-mcp

# Or use it directly with npx
npx @testsprite/testsprite-mcp
```

## Getting Your API Key

1. Visit: https://testsprite.com (or TestSprite's official website)
2. Sign up for an account
3. Generate an API key from your dashboard
4. Replace `your-testsprite-api-key-here` with your actual API key

## Manual Testing Checklist

Before using automated testing, ensure these work manually:

### ✅ Student Registration & Login
- [ ] Register with valid data
- [ ] Login with credentials
- [ ] Verify JWT token stored
- [ ] Verify redirect to student panel

### ✅ File Upload
- [ ] Upload single PDF file
- [ ] Upload multiple files at once
- [ ] Set different copies for each file
- [ ] Set B&W and Color options
- [ ] Verify files appear in orders

### ✅ Order Display
- [ ] Orders grouped by student
- [ ] Status badges display correctly
- [ ] Time remaining shows correctly
- [ ] Delete order works

### ✅ Admin Panel
- [ ] Login with admin credentials (admin@smartxerox.com / smartadmin@675.)
- [ ] View all orders
- [ ] Filter by status
- [ ] Update single order status
- [ ] Bulk update multiple orders
- [ ] Download files
- [ ] View statistics

### ✅ Mobile Responsiveness
- [ ] Landing page mobile view
- [ ] Registration form mobile view
- [ ] Student panel mobile view
- [ ] Admin dashboard mobile view
- [ ] Navbar mobile view

### ✅ API Endpoints

Test these with Postman or Thunder Client:

**Auth Endpoints:**
```
POST http://localhost:5000/api/auth/register
POST http://localhost:5000/api/auth/login
GET http://localhost:5000/api/auth/profile
```

**Order Endpoints:**
```
POST http://localhost:5000/api/orders
GET http://localhost:5000/api/orders/:phoneNumber
DELETE http://localhost:5000/api/orders/:id
```

**Admin Endpoints:**
```
POST http://localhost:5000/api/admin/login
GET http://localhost:5000/api/admin/orders
PUT http://localhost:5000/api/admin/orders/:id/status
GET http://localhost:5000/api/admin/stats
```

## Automated Testing Scripts

### Using Playwright (Recommended)

```bash
# Install Playwright
npm install -D @playwright/test

# Run tests
npx playwright test
```

Create `tests/e2e.spec.js`:
```javascript
import { test, expect } from '@playwright/test';

test('Student Registration Flow', async ({ page }) => {
  await page.goto('http://localhost:5173/register');
  await page.fill('input[name="name"]', 'Test User');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="phone"]', '9876543210');
  await page.fill('input[name="password"]', 'password123');
  await page.fill('input[name="confirmPassword"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('http://localhost:5173/login');
});
```

## Performance Testing

### Using Apache Bench
```bash
# Test login endpoint
ab -n 1000 -c 10 -p login.json -T application/json http://localhost:5000/api/auth/login

# Test file upload
ab -n 100 -c 5 -p order.json -T multipart/form-data http://localhost:5000/api/orders
```

### Using Artillery
```bash
# Install
npm install -g artillery

# Run load test
artillery quick --count 10 --num 100 http://localhost:5000/api/orders
```

## Database Testing

### Test Supabase Connection
```javascript
// test/db.test.js
import { supabase } from '../server/services/supabaseClient.js';

async function testConnection() {
  const { data, error } = await supabase.from('orders').select('count');
  console.log('Connection successful:', data);
}

testConnection();
```

## Security Testing

### Test Authentication
- [ ] Try accessing /student without login (should redirect)
- [ ] Try accessing /admin/dashboard without token (should fail)
- [ ] Test JWT token expiration
- [ ] Test password hashing (bcrypt)

### Test File Upload Security
- [ ] Try uploading .exe file (should fail)
- [ ] Try uploading >10MB file (should fail)
- [ ] Test file path traversal
- [ ] Test SQL injection in form fields

## Browser Compatibility Testing

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

## Cleanup Testing

### Test 24-hour Auto-Delete
1. Create a test order
2. Manually change `created_at` in database to 25 hours ago
3. Wait for cron job to run (or trigger manually)
4. Verify order and file are deleted

```javascript
// Manual cleanup trigger
import cleanupExpiredOrders from './server/cron/cleanup.js';
await cleanupExpiredOrders();
```

## Test Data

### Valid Student Credentials
```json
{
  "name": "Test Student",
  "email": "student@test.com",
  "password": "test123",
  "phone": "9876543210"
}
```

### Valid Admin Credentials
```json
{
  "email": "admin@smartxerox.com",
  "password": "smartadmin@675."
}
```

### Sample Files
- `test.pdf` - Sample PDF file (< 10MB)
- `test.jpg` - Sample image file (< 10MB)
- `large.pdf` - Sample file (> 10MB) for testing size limit

## CI/CD Testing

### GitHub Actions Workflow
Create `.github/workflows/test.yml`:

```yaml
name: Test SmartXerox

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
```

## Monitoring & Logging

### Add to server for testing
```javascript
import morgan from 'morgan';
app.use(morgan('dev')); // Logs all requests
```

### Check logs
```bash
# Check server logs
pm2 logs

# Check error logs
tail -f error.log
```

## Reporting Issues

When testing finds bugs:
1. Note the exact steps to reproduce
2. Include browser/environment details
3. Capture screenshots/videos
4. Check console for errors
5. Check network tab for API failures

## Success Metrics

Your application should pass:
- ✅ All user flows complete successfully
- ✅ Page load time < 2 seconds
- ✅ File upload time < 5 seconds
- ✅ API response time < 500ms
- ✅ No console errors
- ✅ Mobile responsive
- ✅ Security vulnerabilities = 0

Happy Testing! 🧪
