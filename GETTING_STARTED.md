# 🚀 SmartXerox - Quick Start Guide

```
 ███████╗███╗   ███╗ █████╗ ██████╗ ████████╗██╗  ██╗███████╗██████╗  ██████╗ ██╗  ██╗
 ██╔════╝████╗ ████║██╔══██╗██╔══██╗╚══██╔══╝╚██╗██╔╝██╔════╝██╔══██╗██╔═══██╗╚██╗██╔╝
 ███████╗██╔████╔██║███████║██████╔╝   ██║    ╚███╔╝ █████╗  ██████╔╝██║   ██║ ╚███╔╝ 
 ╚════██║██║╚██╔╝██║██╔══██║██╔══██╗   ██║    ██╔██╗ ██╔══╝  ██╔══██╗██║   ██║ ██╔██╗ 
 ███████║██║ ╚═╝ ██║██║  ██║██║  ██║   ██║   ██╔╝ ██╗███████╗██║  ██║╚██████╔╝██╔╝ ██╗
 ╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝
```

## 🎯 What You'll Build

A complete digital print ordering system where:
- 👨‍🎓 Students upload files and track orders
- 👨‍💼 Admins manage and print orders
- 🤖 System auto-deletes files after 24 hours

---

## ⚡ 3-Step Quick Start

### Step 1️⃣: Setup Supabase (10 min)

```
1. Go to supabase.com → Create Project
2. SQL Editor → Paste database/schema.sql → Run
3. Storage → Create bucket "smartxerox-files" (Public)
4. Settings → API → Copy your keys
```

### Step 2️⃣: Install & Configure (5 min)

```powershell
# Install all dependencies
npm run install-all

# Configure backend
cd server
Copy-Item .env.example .env
# Edit .env with your Supabase keys

# Configure frontend
cd ../client
Copy-Item .env.example .env
# Set VITE_API_URL=http://localhost:5000
```

### Step 3️⃣: Run It! (2 min)

```powershell
# From root directory
npm run dev

# Opens automatically:
# Frontend: http://localhost:5173
# Backend:  http://localhost:5000
```

---

## 📋 Detailed Setup

### 🗄️ A. Supabase Configuration

#### 1. Create Project
```
→ supabase.com/dashboard
→ "New Project"
→ Name: smartxerox
→ Password: (save it!)
→ Region: (choose closest)
→ Wait ~2 minutes
```

#### 2. Setup Database
```
→ SQL Editor
→ "New Query"
→ Copy all from: database/schema.sql
→ Click "Run" (Ctrl+Enter)
→ See: "Success. No rows returned" ✅
```

#### 3. Create Storage Bucket
```
→ Storage (left sidebar)
→ "Create a new bucket"
→ Name: smartxerox-files
→ Public: ON ✅
→ "Create bucket"
```

#### 4. Set Storage Policies
```
→ Click bucket → Policies tab
→ "New Policy" → "Full customization"

Policy 1 (Upload):
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'smartxerox-files');

Policy 2 (Read):
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'smartxerox-files');

Policy 3 (Delete):
CREATE POLICY "Allow service role deletes"
ON storage.objects FOR DELETE
TO service_role
USING (bucket_id = 'smartxerox-files');
```

#### 5. Get API Keys
```
→ Settings → API
→ Copy these:
  ✓ Project URL
  ✓ anon public key
  ✓ service_role key (⚠️ Keep secret!)
```

---

### 💻 B. Local Development Setup

#### 1. Install Dependencies

**Option A: Install All at Once**
```powershell
npm run install-all
```

**Option B: Install Separately**
```powershell
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

#### 2. Configure Backend Environment

```powershell
cd server
Copy-Item .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...
JWT_SECRET=random-string-here-make-it-long
ADMIN_EMAIL=admin@smartxerox.com
ADMIN_PASSWORD=admin123
NODE_ENV=development
```

💡 **Generate secure JWT_SECRET**:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 3. Configure Frontend Environment

```powershell
cd ../client
Copy-Item .env.example .env
```

Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000
```

#### 4. Run the Application

**Option A: Run Both Together (Recommended)**
```powershell
# From root directory
npm run dev
```

**Option B: Run Separately**
```powershell
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

#### 5. Verify It's Working

```
✅ Backend running: http://localhost:5000
   Should see: {"success":true,"message":"SmartXerox API is running",...}

✅ Frontend running: http://localhost:5173
   Should see: SmartXerox student panel

✅ Check backend logs:
   "🚀 SmartXerox server running on port 5000"
   "🧹 Cleanup job scheduled to run every hour"
```

---

## 🧪 Testing

### Test as Student (http://localhost:5173)

```
1. Fill form:
   ✓ Name: John Doe
   ✓ Phone: 9876543210
   ✓ Copies: 2
   ✓ Type: B&W
   ✓ File: Upload a test PDF

2. Click "Submit Order"
   ✓ Should see success message
   ✓ Order appears below

3. Track order:
   ✓ Enter phone number: 9876543210
   ✓ Click "Track"
   ✓ See your order with status
```

### Test as Admin (http://localhost:5173/admin)

```
1. Login:
   ✓ Email: admin@smartxerox.com
   ✓ Password: admin123

2. Dashboard:
   ✓ See all orders
   ✓ View statistics
   ✓ Click status dropdown → Change to "Printing"
   ✓ Click "Download" → File opens

3. Verify:
   ✓ Status updated in student view
   ✓ Statistics changed
```

---

## 📱 Features Overview

### For Students 👨‍🎓

| Feature | Description |
|---------|-------------|
| 📤 Upload | PDF, JPG, PNG (max 10MB) |
| 📝 Order Info | Name, phone, copies, color type |
| 📊 Track Status | Real-time status updates |
| ⏰ Expiry Timer | See time remaining (24h) |
| 🗑️ Delete | Remove own orders |

### For Admin 👨‍💼

| Feature | Description |
|---------|-------------|
| 🔐 Login | Secure authentication |
| 📋 Dashboard | All orders in one place |
| 📥 Download | Get files for printing |
| 🔄 Update Status | In Queue → Printing → Ready → Delivered |
| 📊 Statistics | Total orders, by status, copies |
| 🔍 Filter | By status |

### Automatic 🤖

| Feature | Description |
|---------|-------------|
| ⏱️ Cron Job | Runs every hour |
| 🧹 Cleanup | Deletes orders > 24h old |
| 🗑️ File Removal | Removes files from storage |
| 🔒 Privacy | No permanent data storage |

---

## 🎨 Pages Overview

```
📄 Student Panel (/)
┌─────────────────────────────────────┐
│  📤 Submit Order    │  📋 Track     │
│  ┌───────────────┐  │  ┌──────────┐ │
│  │ Form          │  │  │ Orders   │ │
│  │ • Name        │  │  │ List     │ │
│  │ • Phone       │  │  │          │ │
│  │ • Copies      │  │  │ [Order 1]│ │
│  │ • Color       │  │  │ [Order 2]│ │
│  │ • File        │  │  │          │ │
│  │ [Submit] ────►│  │  │          │ │
│  └───────────────┘  │  └──────────┘ │
└─────────────────────────────────────┘

🔐 Admin Login (/admin/login)
┌─────────────────────────────────────┐
│         📄 SmartXerox               │
│         Admin Login                 │
│  ┌───────────────────────────────┐  │
│  │ Email: [_________________]    │  │
│  │ Password: [_________________] │  │
│  │           [🔐 Login]          │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘

📊 Admin Dashboard (/admin/dashboard)
┌─────────────────────────────────────┐
│  📊 Statistics                      │
│  [Total] [Queue] [Ready] [Copies]   │
│                                     │
│  🔍 Filter: [All Orders ▼] [Refresh]│
│                                     │
│  📋 Orders Table                    │
│  ┌─────────────────────────────┐   │
│  │Name│Info│Status│Time│Actions│   │
│  │────│────│──────│────│───────│   │
│  │...│... │[▼]   │... │[Down] │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 🎯 Status Flow

```
📤 Student Uploads File
        │
        ▼
    ┌───────────┐
    │ In Queue  │ ← Gray
    └─────┬─────┘
          │
          ▼
    ┌───────────┐
    │ Printing  │ ← Blue
    └─────┬─────┘
          │
          ▼
    ┌───────────┐
    │   Ready   │ ← Green
    └─────┬─────┘
          │
          ▼
    ┌───────────┐
    │ Delivered │ ← Purple
    └─────┬─────┘
          │
      After 24h
          │
          ▼
    🗑️ Auto-deleted
```

---

## 🔧 Common Commands

```powershell
# Install everything
npm run install-all

# Run development (both servers)
npm run dev

# Run backend only
cd server && npm run dev

# Run frontend only
cd client && npm run dev

# Build for production
cd client && npm run build

# Check if ports are in use
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📁 Important Files

```
🔧 Configuration:
├── server/.env          → Backend config
├── client/.env          → Frontend config
└── database/schema.sql  → Database setup

📚 Documentation:
├── README.md            → Project overview
├── SETUP_GUIDE.md       → Detailed setup
├── TROUBLESHOOTING.md   → Fix issues
└── API_DOCUMENTATION.md → API reference

🎨 Key Code Files:
├── server/server.js              → Backend entry
├── server/routes/orders.js       → Order API
├── server/routes/admin.js        → Admin API
├── client/src/App.jsx            → Frontend entry
├── client/src/pages/StudentPanel.jsx  → Student UI
└── client/src/pages/AdminDashboard.jsx → Admin UI
```

---

## ❓ Troubleshooting

### Backend not starting?
```powershell
✓ Check .env file exists in server/
✓ Verify all environment variables set
✓ Check port 5000 is free
✓ Run: cd server && npm install
```

### Frontend not loading?
```powershell
✓ Check backend is running (port 5000)
✓ Verify VITE_API_URL in client/.env
✓ Check port 5173 is free
✓ Run: cd client && npm install
```

### File upload fails?
```powershell
✓ Check Supabase bucket exists: smartxerox-files
✓ Verify bucket is public
✓ Check storage policies are set
✓ Verify Supabase keys in .env
```

### Can't login as admin?
```powershell
✓ Check credentials in server/.env:
  ADMIN_EMAIL=admin@smartxerox.com
  ADMIN_PASSWORD=admin123
✓ Restart backend server
✓ Clear browser localStorage
```

**More help?** See `TROUBLESHOOTING.md`

---

## 🚀 Deployment

### Deploy Frontend (Vercel)
```bash
1. Push code to GitHub
2. Go to vercel.com → New Project
3. Import repository
4. Root Directory: client
5. Add env: VITE_API_URL = (your backend URL)
6. Deploy! 🎉
```

### Deploy Backend (Railway)
```bash
1. Push code to GitHub
2. Go to railway.app → New Project
3. Deploy from GitHub
4. Root Directory: server
5. Add all environment variables from .env
6. Deploy! 🎉
```

**Full guide**: See `SETUP_GUIDE.md` → Part 3

---

## 📞 Need Help?

1. 📖 **Read Documentation**:
   - `SETUP_GUIDE.md` - Complete walkthrough
   - `TROUBLESHOOTING.md` - Fix common issues
   - `API_DOCUMENTATION.md` - API details

2. 🔍 **Check Logs**:
   - Backend: Server terminal
   - Frontend: Browser console (F12)
   - Supabase: Dashboard → Logs

3. ✅ **Verify Setup**:
   - [ ] Node.js 18+ installed
   - [ ] Supabase project created
   - [ ] Database table created
   - [ ] Storage bucket created
   - [ ] .env files configured
   - [ ] Dependencies installed

---

## ✅ Success Indicators

When everything works, you should see:

**Backend Terminal:**
```
🚀 SmartXerox server running on port 5000
🧹 Cleanup job scheduled to run every hour
```

**Frontend Browser:**
```
✓ Clean UI with upload form
✓ No console errors (F12)
✓ Can submit test order
✓ Order appears in tracking
```

**Admin Dashboard:**
```
✓ Can login with credentials
✓ See all orders in table
✓ Can download files
✓ Can update status
```

---

## 🎉 You're Ready!

```
 ✅ Backend running
 ✅ Frontend running
 ✅ Supabase configured
 ✅ Files uploading
 ✅ Orders tracking
 ✅ Admin working
 
 🎊 START ACCEPTING PRINT ORDERS! 🎊
```

---

**Total Setup Time: 15-20 minutes** ⏱️

**Questions?** Check `TROUBLESHOOTING.md` or `SETUP_GUIDE.md`

**Happy Printing!** 🖨️✨
