# 🔧 SmartXerox Troubleshooting Guide

Common issues and their solutions.

---

## 🚨 Installation Issues

### Issue: `npm install` fails

**Symptoms**:
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions**:
1. Clear npm cache:
   ```powershell
   npm cache clean --force
   ```

2. Delete `node_modules` and `package-lock.json`:
   ```powershell
   Remove-Item -Recurse -Force node_modules, package-lock.json
   npm install
   ```

3. Use legacy peer deps:
   ```powershell
   npm install --legacy-peer-deps
   ```

4. Update Node.js to version 18+:
   - Download from: https://nodejs.org/

---

## 🗄️ Supabase Issues

### Issue: "Failed to upload file to storage"

**Symptoms**:
- File upload hangs
- Console error: `StorageError: Bucket not found`

**Solutions**:
1. **Check bucket exists**:
   - Go to Supabase → Storage
   - Verify bucket named `smartxerox-files` exists
   - Create if missing (make it public)

2. **Verify storage policies**:
   ```sql
   -- Check existing policies
   SELECT * FROM storage.policies WHERE bucket_id = 'smartxerox-files';
   ```
   
   - Should have INSERT, SELECT, DELETE policies
   - See `SETUP_GUIDE.md` for correct policies

3. **Check Supabase keys**:
   - Verify `SUPABASE_URL` is correct
   - Use `SUPABASE_SERVICE_KEY` (not anon key) for uploads
   - Keys should start with `eyJ...`

### Issue: "Failed to create order"

**Symptoms**:
- Order submission fails after file upload
- Database error in logs

**Solutions**:
1. **Check table exists**:
   ```sql
   SELECT * FROM orders LIMIT 1;
   ```

2. **Run schema again**:
   - Copy `database/schema.sql`
   - Run in Supabase SQL Editor

3. **Check column names match**:
   - Ensure no typos in column names
   - Schema should have: `file_path`, `file_url`, etc.

---

## 🔐 Authentication Issues

### Issue: Admin login fails

**Symptoms**:
- "Invalid credentials" message
- Can't access admin dashboard

**Solutions**:
1. **Check `.env` file**:
   ```env
   ADMIN_EMAIL=admin@smartxerox.com
   ADMIN_PASSWORD=admin123
   ```

2. **Restart server** after changing `.env`:
   ```powershell
   # Stop server (Ctrl+C)
   npm run dev
   ```

3. **Check JWT_SECRET is set**:
   ```env
   JWT_SECRET=your-random-string-here
   ```

4. **Clear browser localStorage**:
   - F12 → Application → Local Storage
   - Delete `adminToken`
   - Try login again

### Issue: "Authentication required" on admin routes

**Symptoms**:
- 401 Unauthorized error
- Logged out unexpectedly

**Solutions**:
1. **Check token in localStorage**:
   - F12 → Application → Local Storage
   - Should see `adminToken`

2. **Token expired** (24h limit):
   - Login again to get new token

3. **CORS issues**:
   - Check backend logs for CORS errors
   - Verify frontend URL matches allowed origins

---

## 📁 File Upload Issues

### Issue: "Invalid file type"

**Symptoms**:
- Upload rejected
- Error: "Only PDF, JPG, and PNG files are allowed"

**Solutions**:
1. **Check file extension**:
   - Must be: `.pdf`, `.jpg`, `.jpeg`, or `.png`
   - Not: `.doc`, `.docx`, `.txt`, etc.

2. **Check MIME type**:
   - Some files have wrong MIME type
   - Re-save file or convert to correct format

### Issue: "File size must be less than 10MB"

**Symptoms**:
- Large file upload fails

**Solutions**:
1. **Compress file**:
   - PDFs: Use online PDF compressor
   - Images: Resize or compress

2. **Change limit** (if needed):
   - Edit `server/routes/orders.js`:
   ```javascript
   limits: {
     fileSize: 20 * 1024 * 1024, // 20MB
   }
   ```

### Issue: Upload stuck at "Submitting..."

**Symptoms**:
- Progress bar stuck
- No error message

**Solutions**:
1. **Check network**:
   - F12 → Network tab
   - Look for failed requests

2. **Check backend is running**:
   - Should see server logs
   - Test: http://localhost:5000

3. **Check file path**:
   - Ensure file is accessible
   - Not in protected directory

---

## 🌐 Network Issues

### Issue: "Failed to fetch orders"

**Symptoms**:
- Orders don't load
- Network error in console

**Solutions**:
1. **Check backend URL**:
   - Client `.env`:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

2. **Verify backend is running**:
   ```powershell
   cd server
   npm run dev
   ```
   - Should see: "🚀 SmartXerox server running"

3. **Check CORS**:
   - Backend should allow frontend origin
   - Check `server/server.js` CORS config

4. **Test API directly**:
   - Open: http://localhost:5000/
   - Should see: `{"success":true,...}`

### Issue: CORS Error

**Symptoms**:
```
Access to fetch at 'http://localhost:5000' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**Solutions**:
1. **Check CORS middleware** in `server/server.js`:
   ```javascript
   app.use(cors());
   ```

2. **Clear browser cache**:
   - Hard refresh: Ctrl+Shift+R

3. **Try different browser**:
   - Test in Chrome incognito mode

---

## ⏰ Cron Job Issues

### Issue: Cleanup not running

**Symptoms**:
- Old orders not deleted
- No cleanup logs in console

**Solutions**:
1. **Check server is running**:
   - Cron job only runs while server is active
   - Keep server running in background

2. **Check logs**:
   - Should see: "✅ Cleanup cron job scheduled"
   - After 1 hour: "🧹 Starting cleanup job..."

3. **Test manually**:
   ```javascript
   // Add to server.js temporarily
   import { cleanupExpiredOrders } from './cron/cleanup.js';
   cleanupExpiredOrders(); // Run immediately
   ```

4. **Check time calculation**:
   - Verify 24-hour calculation in `cleanup.js`
   - Test with shorter interval (e.g., 1 minute) for testing

---

## 🎨 Frontend Issues

### Issue: Tailwind styles not working

**Symptoms**:
- Plain unstyled page
- No colors or layout

**Solutions**:
1. **Check `index.css` imported**:
   - `src/main.jsx` should import `./index.css`

2. **Run Tailwind build**:
   ```powershell
   cd client
   npm install
   npm run dev
   ```

3. **Check `tailwind.config.js` content**:
   ```javascript
   content: [
     "./index.html",
     "./src/**/*.{js,ts,jsx,tsx}",
   ]
   ```

4. **Clear Vite cache**:
   ```powershell
   Remove-Item -Recurse -Force node_modules/.vite
   npm run dev
   ```

### Issue: React Router not working

**Symptoms**:
- Routes show 404
- Navigation doesn't work

**Solutions**:
1. **Check Router setup** in `App.jsx`:
   ```javascript
   import { BrowserRouter as Router } from 'react-router-dom';
   ```

2. **Use correct navigation**:
   ```javascript
   // Use Link or navigate()
   import { Link, useNavigate } from 'react-router-dom';
   ```

3. **For production** (Vercel):
   - Add `vercel.json`:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

---

## 🐛 Common Errors

### Error: "Cannot find module"

**Solution**:
```powershell
npm install
```

### Error: "Port 5000 already in use"

**Solution**:
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F

# Or change port in server/.env
PORT=5001
```

### Error: "Environment variable not defined"

**Solution**:
1. Check `.env` file exists
2. Restart server after editing `.env`
3. Use correct env var names (no typos)

### Error: "Supabase client is not defined"

**Solution**:
1. Check `SUPABASE_URL` and keys in `.env`
2. Restart server
3. Verify import in file:
   ```javascript
   import { supabaseAdmin } from '../services/supabaseClient.js';
   ```

---

## 📊 Database Issues

### Issue: Query fails

**Symptoms**:
- Database errors in logs
- Orders not saving

**Solutions**:
1. **Check connection**:
   - Test in Supabase SQL Editor
   ```sql
   SELECT * FROM orders;
   ```

2. **Check table structure**:
   ```sql
   \d orders
   ```

3. **Check indexes**:
   ```sql
   SELECT * FROM pg_indexes WHERE tablename = 'orders';
   ```

4. **Re-run schema**:
   - Copy `database/schema.sql`
   - Run in Supabase SQL Editor

---

## 🚀 Deployment Issues

### Issue: Vercel build fails

**Symptoms**:
- Deployment fails
- Build errors

**Solutions**:
1. **Check build locally**:
   ```powershell
   cd client
   npm run build
   ```

2. **Environment variables**:
   - Add `VITE_API_URL` in Vercel dashboard
   - Redeploy

3. **Check Node version**:
   - Vercel settings → Node.js version → 18.x

### Issue: Railway deployment fails

**Symptoms**:
- Backend not accessible
- Deployment errors

**Solutions**:
1. **Check start command**:
   - Settings → `npm start`

2. **Set root directory**:
   - Settings → Root directory → `/server`

3. **Add all environment variables**:
   - Copy from `.env`
   - Set in Railway dashboard

4. **Check logs**:
   - Railway → Deployments → View logs

---

## 🔍 Debugging Tips

### Enable Detailed Logging

**Backend** (`server/server.js`):
```javascript
// Add after routes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

**Frontend** (any component):
```javascript
console.log('Debug:', { variable, state, props });
```

### Check Supabase Logs

1. Go to Supabase dashboard
2. Logs & Analytics → Logs
3. Filter by table or storage

### Browser Developer Tools

- **Console** (F12): Check for errors
- **Network** tab: See API requests
- **Application** tab: Check localStorage

---

## 📞 Still Need Help?

1. **Check logs**:
   - Server terminal output
   - Browser console (F12)
   - Supabase logs

2. **Review documentation**:
   - `README.md` - Overview
   - `SETUP_GUIDE.md` - Setup steps
   - `API_DOCUMENTATION.md` - API details

3. **Common fixes**:
   - Restart server
   - Clear browser cache
   - Re-install dependencies
   - Check environment variables

4. **Testing checklist**:
   - [ ] Backend running (port 5000)
   - [ ] Frontend running (port 5173)
   - [ ] Supabase configured
   - [ ] .env files set up
   - [ ] Database table created
   - [ ] Storage bucket created

---

## ✅ Health Check Commands

```powershell
# Test backend
Invoke-WebRequest http://localhost:5000

# Check if port is in use
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Check Node/npm versions
node --version  # Should be 18+
npm --version

# Test database connection (from Supabase SQL Editor)
SELECT NOW();

# Check storage bucket (from Supabase Storage)
# Click on smartxerox-files bucket
```

---

**💡 Pro Tip**: When reporting issues, include:
- Error message (full text)
- Console logs
- Steps to reproduce
- Environment (OS, Node version, browser)

This helps identify the problem faster! 🚀
