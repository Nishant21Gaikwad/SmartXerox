# 🚀 FREE Deployment Guide - Render + Vercel

**Complete step-by-step guide to deploy SmartXerox for FREE!**

**Cost:** $0/month forever ✅

---

## 📋 Prerequisites

- [x] Code pushed to GitHub ✅
- [x] GitHub account
- [ ] Render.com account (free - we'll create)
- [ ] Vercel account (free - we'll create)

---

## Part 1: Deploy Backend to Render.com (10 minutes)

### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Click **"Get Started"**
3. Sign up with your **GitHub account** (recommended)
4. Verify your email

### Step 2: Create New Web Service

1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Connect your GitHub repository:
   - Click **"Connect account"** if needed
   - Find and select: **`Nishant21Gaikwad/SmartXerox`**
   - Click **"Connect"**

### Step 3: Configure Service

Fill in these settings:

**Basic Settings:**
```
Name: smartxerox-backend (or any name you like)
Region: Oregon (US West) or closest to you
Branch: main
Root Directory: server
```

**Build & Deploy:**
```
Runtime: Node
Build Command: npm install
Start Command: npm start
```

**Instance Type:**
```
Select: Free (0 GB RAM, shared CPU)
```

### Step 4: Add Environment Variables

Click **"Advanced"** → Scroll to **"Environment Variables"**

Add these variables one by one:

```env
NODE_ENV=production
PORT=5000
SUPABASE_URL=https://mudfaoyxjyemwwonkcgl.supabase.co
SUPABASE_ANON_KEY=your-actual-anon-key-from-local-env
SUPABASE_SERVICE_KEY=your-actual-service-key-from-local-env
JWT_SECRET=f27b12c216ac2cc8ce3b389d4a90abcad2dd14e03e24c3ed51aeac49203da64a9c4a8dbaceaa62d9c12ae8a5b33535c32a18b84049ef5b2a25c5fd81b7b430c6
ADMIN_EMAIL=admin@smartxerox.com
ADMIN_PASSWORD=smartadmin@675.
FRONTEND_URL=http://localhost:5173
```

**⚠️ Important:** Copy your actual Supabase keys from your local `server/.env` file!

### Step 5: Deploy!

1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. You'll see build logs in real-time

### Step 6: Get Your Backend URL

Once deployed, you'll see:
```
✅ Live at: https://smartxerox-rag8.onrender.com
```

**Your Render URL:** https://smartxerox-rag8.onrender.com

**Copy this URL** - you'll need it for frontend!

### Step 7: Test Backend

Click on your URL or visit:
```
https://smartxerox-rag8.onrender.com
```

You should see:
```json
{
  "success": true,
  "message": "SmartXerox API is running",
  "timestamp": "2025-11-06T..."
}
```

✅ **Backend deployed successfully!**

---

## Part 2: Deploy Frontend to Vercel (5 minutes)

### Step 1: Update Frontend Configuration

**Update `client/.env` with your Render URL:**

```env
VITE_API_URL=https://smartxerox-rag8.onrender.com
```

**Commit and push this change:**

```bash
cd c:\Users\datta\Desktop\SmartXerox
git add client/.env
git commit -m "Update API URL for production"
git push origin main
```

### Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access GitHub

### Step 3: Import Project

1. Click **"Add New..."** → **"Project"**
2. Find **"SmartXerox"** repository
3. Click **"Import"**

### Step 4: Configure Project

**Framework Preset:**
```
Framework Preset: Vite
```

**Root Directory:**
```
Click "Edit" next to Root Directory
Enter: client
Click "Continue"
```

**Build Settings:**
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Step 5: Add Environment Variable

1. Click **"Environment Variables"**
2. Add:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://smartxerox-rag8.onrender.com` (your Render URL)
3. Click **"Add"**

### Step 6: Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Watch the build process

### Step 7: Get Your Frontend URL

Once deployed, you'll see:
```
✅ https://smartxerox.vercel.app
```

Or something like:
```
https://smart-xerox-xyz123.vercel.app
```

**Copy this URL!**

---

## Part 3: Update CORS (2 minutes)

Now that frontend is deployed, update backend CORS:

### Step 1: Update Render Environment

1. Go back to **Render Dashboard**
2. Click on your **smartxerox-backend** service
3. Go to **"Environment"** tab
4. Find `FRONTEND_URL` variable
5. Update value to your Vercel URL:
   ```
   https://smartxerox.vercel.app
   ```
6. Click **"Save Changes"**

### Step 2: Wait for Redeploy

Render will automatically redeploy (takes ~2 minutes)

---

## ✅ Deployment Complete!

### 🎉 Your Live URLs:

**Frontend (Public):**
```
https://smartxerox.vercel.app
```

**Backend API:**
```
https://smartxerox-rag8.onrender.com
```

---

## 🧪 Test Your Deployed App

### 1. Test Landing Page
Visit: `https://smartxerox.vercel.app`

Should show the landing page ✅

### 2. Test Student Registration
1. Go to: `https://smartxerox.vercel.app/register`
2. Create a test account
3. Should redirect to login ✅

### 3. Test Student Login
1. Login with test account
2. Should redirect to student panel ✅

### 4. Test File Upload
1. Upload a test PDF
2. Check if order appears ✅

### 5. Test Admin Login
1. Go to: `https://smartxerox.vercel.app/admin/login`
2. Use your admin credentials
3. Should see dashboard with orders ✅

---

## ⚠️ Important Notes

### Free Tier Limitations:

**Render Free Tier:**
- ✅ Your backend will **sleep after 15 minutes** of inactivity
- ⏱️ First request after sleep takes ~30-50 seconds to wake up
- ✅ Automatically wakes up on request
- ✅ Perfect for portfolio/demo projects
- ✅ 750 hours/month (enough for development)

**Vercel Free Tier:**
- ✅ No sleep time
- ✅ 100GB bandwidth/month
- ✅ Instant loads
- ✅ Unlimited deployments

### Keep Backend Active (Optional):

If you want to prevent backend from sleeping, use:
- [UptimeRobot](https://uptimerobot.com) (free)
- Pings your API every 5 minutes
- Keeps it awake 24/7

---

## 🔧 Troubleshooting

### Backend not responding?
**Solution:** Wait 30-50 seconds for the first request (waking from sleep)

### CORS Error?
**Solution:** 
1. Check `FRONTEND_URL` in Render matches your Vercel URL exactly
2. No trailing slash
3. Redeploy backend

### File upload fails?
**Solution:**
1. Check Supabase keys in Render environment
2. Verify storage bucket exists
3. Check file size < 10MB

### 500 Error?
**Solution:**
1. Check Render logs: Dashboard → Service → Logs
2. Verify all environment variables are set
3. Check Supabase connection

### Changes not showing?
**Solution:**
- Frontend: Push to GitHub, Vercel auto-deploys
- Backend: Push to GitHub, Render auto-deploys

---

## 📊 Monitoring Your App

### Render Dashboard
- View logs: Service → Logs
- Check metrics: Service → Metrics
- See deployments: Service → Events

### Vercel Dashboard
- View deployments: Project → Deployments
- Check analytics: Project → Analytics
- See logs: Deployment → View Function Logs

### Supabase Dashboard
- Check database: Table Editor
- View storage: Storage
- Monitor usage: Settings → Usage

---

## 🚀 Custom Domain (Optional)

### Add Custom Domain to Vercel (Free!)

1. Go to Vercel Dashboard
2. Select your project
3. Go to **"Settings"** → **"Domains"**
4. Add your domain (e.g., smartxerox.com)
5. Update DNS records as instructed
6. Wait for DNS propagation (~10 minutes)

**Update Render after adding domain:**
- Update `FRONTEND_URL` to your custom domain
- Save and redeploy

---

## 🔄 Making Updates

### Update Frontend:
```bash
# Make changes to client code
git add .
git commit -m "Update frontend"
git push origin main
# Vercel auto-deploys in 2-3 minutes
```

### Update Backend:
```bash
# Make changes to server code
git add .
git commit -m "Update backend"
git push origin main
# Render auto-deploys in 3-5 minutes
```

### Update Environment Variables:
1. Go to platform dashboard (Render or Vercel)
2. Update environment variables
3. Service will auto-redeploy

---

## 💰 Cost Breakdown

| Service | Cost | What You Get |
|---------|------|--------------|
| **Render** | $0/month | 750 hours, sleeps after 15 min |
| **Vercel** | $0/month | Unlimited, always on |
| **Supabase** | $0/month | 500MB storage, 2GB bandwidth |
| **Total** | **$0/month** | Perfect for portfolio projects! |

---

## 🎯 Next Steps

1. ✅ Test all features on production
2. ✅ Share your live URL with users
3. ✅ Monitor logs for any errors
4. ✅ Set up UptimeRobot (optional) to keep backend awake
5. ✅ Add custom domain (optional)
6. ✅ Enable Supabase RLS for security
7. ✅ Add analytics (Google Analytics, Vercel Analytics)

---

## 📞 Support

### Render Issues:
- Docs: https://render.com/docs
- Community: https://community.render.com

### Vercel Issues:
- Docs: https://vercel.com/docs
- Support: https://vercel.com/support

### App Issues:
- Check logs in Render/Vercel dashboards
- Verify environment variables
- Test locally first with `npm run dev`

---

## 🎊 Congratulations!

Your SmartXerox app is now live and accessible worldwide for **FREE**! 🚀

**Share your app:**
- Frontend: `https://smartxerox.vercel.app`
- Add to portfolio
- Share with friends
- Use for your college/business

---

**💡 Pro Tip:** The first load might be slow (30-50 seconds) if backend is sleeping. This is normal for free tier. Subsequent requests are fast!

**🎉 Enjoy your free deployment!**
