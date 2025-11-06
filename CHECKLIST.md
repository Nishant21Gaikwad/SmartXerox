# SmartXerox - Quick Start Checklist

## ✅ Pre-Setup
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Supabase account created
- [ ] Code editor (VS Code) installed

## ✅ Supabase Configuration (10 mins)
- [ ] Create new Supabase project
- [ ] Run `database/schema.sql` in SQL Editor
- [ ] Create `smartxerox-files` storage bucket (Public)
- [ ] Set storage policies (INSERT, SELECT, DELETE)
- [ ] Copy Project URL, anon key, and service key

## ✅ Backend Setup (5 mins)
- [ ] Navigate to `server/` folder
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Fill in Supabase credentials in `.env`
- [ ] Set JWT_SECRET (random string)
- [ ] Test: `npm run dev` (should start on port 5000)

## ✅ Frontend Setup (5 mins)
- [ ] Navigate to `client/` folder
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Set `VITE_API_URL=http://localhost:5000`
- [ ] Test: `npm run dev` (should open on port 5173)

## ✅ Testing (5 mins)
- [ ] Open http://localhost:5173
- [ ] Submit test order as student
- [ ] Track order with phone number
- [ ] Login to admin panel at `/admin`
- [ ] View orders in admin dashboard
- [ ] Download a file
- [ ] Update order status

## ✅ Production Deployment (Optional)

### Backend (Railway)
- [ ] Push code to GitHub
- [ ] Connect repo to Railway
- [ ] Set all environment variables
- [ ] Deploy and copy backend URL

### Frontend (Vercel)
- [ ] Connect GitHub repo to Vercel
- [ ] Set `VITE_API_URL` to Railway URL
- [ ] Deploy

## 🎉 Success Indicators
- ✅ No console errors
- ✅ Files upload successfully
- ✅ Orders appear in admin panel
- ✅ Status updates work
- ✅ Files are downloadable
- ✅ Cron job logs appear in terminal

## 📞 Stuck?
1. Check browser console (F12)
2. Check server terminal logs
3. Verify all .env variables
4. Review Supabase dashboard → Logs
5. See SETUP_GUIDE.md for detailed help

---

**Total Setup Time: ~25 minutes** ⏱️
