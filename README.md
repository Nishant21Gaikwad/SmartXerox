# 🧾 SmartXerox

> Digital print ordering system for college students and Xerox owners

## 📋 Overview

SmartXerox simplifies the college Xerox process by allowing students to upload documents online and collect printed copies without waiting in line. The system automatically manages orders and maintains privacy by deleting all files and data after 24 hours.

## ✨ Features

### 🎓 Student Features
- Upload files (PDF, PNG, JPG; max 10 MB)
- Enter basic info (Name, Phone, Number of copies, Color/B&W)
- Track order status: In Queue → Printing → Ready → Delivered
- View and manage own active orders

### 🧑‍💼 Admin Features
- Secure login with email/password
- Dashboard view of all active orders
- Download files for printing
- Update order status
- Automatic order expiry after 24 hours

## 🛠️ Tech Stack

- **Frontend**: React.js + Vite + Tailwind CSS
- **Backend Runtime**: Supabase Edge Functions (TypeScript)
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage
- **Scheduler**: Cron job for cleanup

## 📁 Project Structure

```
smartxerox/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── StudentPanel.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── components/
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   └── OrderCard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── App.jsx
│   └── package.json
├── server/                 # Node.js Backend
│   ├── routes/
│   │   ├── orders.js
│   │   └── admin.js
│   ├── services/
│   │   └── supabaseClient.js
│   ├── middleware/
│   │   └── auth.js
│   ├── cron/
│   │   └── cleanup.js
│   └── server.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase account
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SmartXerox
   ```

2. **Set up environment variables**
   
   Create `.env` in the `server/` folder:
   ```env
   PORT=5000
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   SUPABASE_STORAGE_BUCKET=smartxerox-files
   JWT_SECRET=your_jwt_secret
   ADMIN_EMAIL=your-admin-email@domain.com
   ADMIN_PASSWORD=your-admin-password
   ```
   
   Create `.env` in the `client/` folder:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_FUNCTIONS_URL=
   ```

3. **Set up Supabase Database**
   
   Run this SQL in your Supabase SQL editor:
   ```sql
   CREATE TABLE orders (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     student_name TEXT NOT NULL,
     phone_number TEXT NOT NULL,
     file_url TEXT NOT NULL,
     file_path TEXT NOT NULL,
     copies INTEGER NOT NULL DEFAULT 1,
     color_type TEXT NOT NULL CHECK (color_type IN ('B&W', 'Color')),
     status TEXT NOT NULL DEFAULT 'In Queue' CHECK (status IN ('In Queue', 'Printing', 'Ready', 'Delivered')),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   CREATE INDEX idx_phone_number ON orders(phone_number);
   CREATE INDEX idx_created_at ON orders(created_at);
   CREATE INDEX idx_status ON orders(status);
   ```

4. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

5. **Run the application**
   
   Terminal 1 (Supabase Functions - local):
   ```bash
   supabase start
   supabase functions serve --env-file supabase/.env.local
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Functions: http://127.0.0.1:54321/functions/v1

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Upload file + create order |
| GET | `/api/orders/:phoneNumber` | Fetch student's active orders |
| GET | `/api/admin/orders` | Fetch all active orders (admin only) |
| PUT | `/api/orders/:id/status` | Update order status (admin only) |
| DELETE | `/api/orders/:id` | Delete order (optional) |
| POST | `/api/admin/login` | Admin login |

## 🔐 Security

- File upload limited to < 10 MB
- Allowed file types: .pdf, .jpg, .png
- Admin routes protected with JWT authentication
- HTTPS enforced in production
- Environment variables for sensitive data

## 📊 Order Status Flow

```
In Queue (Gray) → Printing (Blue) → Ready (Green) → Delivered (Purple)
```

## 🧹 Automatic Cleanup

A cron job runs every hour to:
- Delete orders older than 24 hours
- Remove corresponding files from Supabase Storage

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd client
vercel --prod
```

### Backend (Railway)
1. Connect your GitHub repository to Railway
2. Add environment variables in Railway dashboard
3. Deploy automatically on push

## 🔮 Future Enhancements

- [ ] Integrate Razorpay/UPI for prepaid printing
- [ ] WhatsApp notification on "Ready" status
- [ ] QR-based pickup confirmation
- [ ] Support for multiple Xerox shops
- [ ] Analytics dashboard for shop owner

## 📝 License

MIT

## 👤 Author

Built with ❤️ for college students
