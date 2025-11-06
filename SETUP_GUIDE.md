# 🚀 SmartXerox Setup Guide

Complete step-by-step guide to set up and run SmartXerox locally and deploy to production.

---

## 📋 Prerequisites

Before starting, make sure you have:

- ✅ Node.js 18+ installed ([Download](https://nodejs.org/))
- ✅ A Supabase account ([Sign up](https://supabase.com/))
- ✅ Git installed
- ✅ A code editor (VS Code recommended)

---

## 🎯 Part 1: Supabase Setup

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in:
   - Project Name: `smartxerox`
   - Database Password: (save this securely)
   - Region: Choose closest to you
4. Wait for project to be created (~2 minutes)

### Step 2: Set Up Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy the entire contents of `database/schema.sql` and paste it
4. Click **"Run"** or press `Ctrl+Enter`
5. You should see: "Success. No rows returned"

### Step 3: Create Storage Bucket

1. Go to **Storage** in the left sidebar
2. Click **"Create a new bucket"**
3. Bucket name: `smartxerox-files`
4. Make it **Public**: Toggle on "Public bucket"
5. Click **"Create bucket"**

### Step 4: Set Storage Policies

1. Click on the `smartxerox-files` bucket
2. Go to **Policies** tab
3. Click **"New Policy"**
4. Choose **"Full customization"**
5. Add these policies:

**For INSERT (Upload):**
```sql
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'smartxerox-files');
```

**For SELECT (Read):**
```sql
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'smartxerox-files');
```

**For DELETE:**
```sql
CREATE POLICY "Allow service role deletes"
ON storage.objects FOR DELETE
TO service_role
USING (bucket_id = 'smartxerox-files');
```

### Step 5: Get API Keys

1. Go to **Settings** → **API**
2. Copy these values (you'll need them soon):
   - `Project URL` → This is your `SUPABASE_URL`
   - `anon public` key → This is your `SUPABASE_ANON_KEY`
   - `service_role` key → This is your `SUPABASE_SERVICE_KEY` (⚠️ Keep secret!)

---

## 💻 Part 2: Local Development Setup

### Step 1: Install Dependencies

Open terminal in the SmartXerox folder:

```powershell
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Step 2: Configure Environment Variables

**For Backend (`server/.env`):**

1. Copy the example file:
```powershell
cd server
Copy-Item .env.example .env
```

2. Edit `server/.env` and fill in:
```env
PORT=5000
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
SUPABASE_SERVICE_KEY=eyJhbGc...your-service-key
JWT_SECRET=change-this-to-a-random-string-abc123xyz789
ADMIN_EMAIL=admin@smartxerox.com
ADMIN_PASSWORD=admin123
NODE_ENV=development
```

**For Frontend (`client/.env`):**

1. Copy the example file:
```powershell
cd ../client
Copy-Item .env.example .env
```

2. Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000
```

### Step 3: Run the Application

**Option A: Run Both Servers Together (Recommended)**

From the root folder:
```powershell
npm run dev
```

**Option B: Run Separately**

Terminal 1 (Backend):
```powershell
cd server
npm run dev
```

Terminal 2 (Frontend):
```powershell
cd client
npm run dev
```

### Step 4: Test the Application

1. Open browser: http://localhost:5173
2. You should see the Student Panel
3. Try uploading a test file
4. Go to http://localhost:5173/admin/login
   - Email: `admin@smartxerox.com`
   - Password: `admin123`

---

## 🧪 Testing the Features

### Student Flow:
1. ✅ Fill in name and phone number
2. ✅ Select number of copies and print type
3. ✅ Upload a PDF/image file
4. ✅ Click "Submit Order"
5. ✅ Use phone number to track order status

### Admin Flow:
1. ✅ Login with admin credentials
2. ✅ See all orders in dashboard
3. ✅ Download files
4. ✅ Update order status
5. ✅ See statistics

### Cleanup Job:
- Runs automatically every hour
- Check server logs for: `"🧹 Starting cleanup job..."`

---

## 🚀 Part 3: Production Deployment

### Deploy Backend (Railway)

1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Connect your GitHub account and select the repo
4. Railway will auto-detect Node.js
5. Add environment variables:
   - Click on your service
   - Go to **Variables** tab
   - Add all variables from `server/.env`
   - Set `NODE_ENV=production`
6. Set start command:
   - Go to **Settings** → **Deploy**
   - Root directory: `/server`
   - Start command: `npm start`
7. Deploy! Your API will be at: `https://your-app.up.railway.app`

### Deploy Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - Framework: Vite
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variable:
   - `VITE_API_URL` = Your Railway backend URL
6. Click **"Deploy"**
7. Your app will be live at: `https://your-app.vercel.app`

---

## 🔧 Troubleshooting

### Issue: "Failed to upload file"
- ✅ Check Supabase storage bucket is created
- ✅ Verify storage policies are set correctly
- ✅ Ensure bucket name is `smartxerox-files`

### Issue: "Failed to fetch orders"
- ✅ Check database table `orders` exists
- ✅ Verify Supabase URL and keys are correct
- ✅ Check backend server is running

### Issue: "Admin login fails"
- ✅ Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`
- ✅ Use exact credentials: `admin@smartxerox.com` / `admin123`

### Issue: "File upload stuck"
- ✅ Check file size is under 10MB
- ✅ Verify file type is PDF, JPG, or PNG
- ✅ Check browser console for errors

### Issue: "Cleanup not running"
- ✅ Check server logs for cron messages
- ✅ Keep server running (cron needs active process)
- ✅ Verify node-cron is installed

---

## 📊 Database Management

### View All Orders
```sql
SELECT * FROM orders ORDER BY created_at DESC;
```

### Count Orders by Status
```sql
SELECT status, COUNT(*) FROM orders GROUP BY status;
```

### Manual Cleanup (delete old orders)
```sql
DELETE FROM orders WHERE created_at < NOW() - INTERVAL '24 hours';
```

### View Statistics
```sql
SELECT * FROM order_statistics;
```

---

## 🎨 Customization

### Change Admin Credentials
Edit `server/.env`:
```env
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-secure-password
```

### Adjust File Size Limit
Edit `server/routes/orders.js`:
```javascript
limits: {
  fileSize: 20 * 1024 * 1024, // Change to 20MB
}
```

### Change Expiry Time
Edit `server/cron/cleanup.js`:
```javascript
// Change 24 hours to 48 hours
.lt('created_at', new Date(Date.now() - 48 * 60 * 60 * 1000))
```

---

## 📱 Mobile Responsiveness

The app is fully responsive and works on:
- ✅ Desktop (1920x1080+)
- ✅ Laptop (1366x768+)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667+)

---

## 🔒 Security Best Practices

1. ✅ Never commit `.env` files to Git
2. ✅ Use strong JWT_SECRET (32+ characters)
3. ✅ Change default admin password
4. ✅ Enable HTTPS in production
5. ✅ Regularly update dependencies
6. ✅ Monitor Supabase usage limits

---

## 📞 Support

Having issues? Check:
1. Server logs in terminal
2. Browser console (F12)
3. Supabase logs (Logs & Analytics)
4. Network tab for API errors

---

## 🎉 Success Checklist

- [ ] Supabase project created
- [ ] Database tables created
- [ ] Storage bucket configured
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Can upload files as student
- [ ] Can track orders with phone number
- [ ] Admin login works
- [ ] Can update order status
- [ ] Files are accessible
- [ ] Cleanup cron job scheduled

---

**🎓 You're all set! Start accepting print orders!**
