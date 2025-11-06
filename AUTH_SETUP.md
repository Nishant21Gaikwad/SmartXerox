# SmartXerox Authentication Setup Guide

## Overview
SmartXerox now includes Supabase-based authentication with student registration and login.

## Database Setup

### 1. Run the Authentication Schema

Execute the following SQL in your Supabase SQL Editor:

```sql
-- Create students table for authentication
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(10) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);

-- Create index on phone for faster lookups
CREATE INDEX IF NOT EXISTS idx_students_phone ON students(phone);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON students
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

## Features

### Student Registration
- **Route**: `/register`
- **Fields**:
  - Full Name (required)
  - Email (required, unique)
  - Phone Number (required, unique, 10 digits)
  - Password (required, minimum 6 characters)
  - Confirm Password (must match password)
- **Validation**:
  - Email format validation
  - Phone number must be exactly 10 digits
  - Password must be at least 6 characters
  - Passwords must match
  - Email and phone must be unique

### Student Login
- **Route**: `/login`
- **Fields**:
  - Email
  - Password
- **Features**:
  - JWT token authentication
  - 7-day token expiration
  - Automatic redirect to student panel after login
  - User data stored in localStorage

### Student Panel (Protected)
- **Route**: `/student`
- **Authentication**: Requires valid JWT token
- **Features**:
  - Auto-populated name and phone from authenticated user
  - Name and phone fields are read-only (disabled)
  - Logout button to clear session
  - Automatic redirect to login if not authenticated

## API Endpoints

### POST /api/auth/register
Register a new student account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210"
  }
}
```

### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210"
  }
}
```

### GET /api/auth/profile
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "created_at": "2025-11-06T10:30:00Z"
  }
}
```

## Security Features

1. **Password Hashing**: Passwords are hashed using bcryptjs (10 salt rounds)
2. **JWT Tokens**: Secure token-based authentication with 7-day expiration
3. **Protected Routes**: Student panel requires valid authentication
4. **Unique Constraints**: Email and phone numbers must be unique
5. **Input Validation**: Server-side validation for all fields
6. **SQL Injection Protection**: Supabase provides built-in protection

## User Flow

### New User Flow
1. User visits `/login`
2. Clicks "Register here"
3. Fills registration form at `/register`
4. After successful registration, redirected to `/login`
5. Logs in with email and password
6. Redirected to `/student` panel

### Returning User Flow
1. User visits `/login`
2. Enters email and password
3. After successful login, redirected to `/student` panel
4. Token and user data stored in localStorage
5. Can upload files and track orders
6. Can logout anytime

### Session Management
- Token stored in `localStorage` as `smartxerox_token`
- User data stored in `localStorage` as `smartxerox_user`
- Token sent with all API requests via Authorization header
- Token expires after 7 days
- User can logout manually to clear session

## Testing the Authentication

### 1. Start the Servers
```bash
# Terminal 1: Start backend
cd server
npm start

# Terminal 2: Start frontend
cd client
npm run dev
```

### 2. Test Registration
1. Navigate to `http://localhost:5173/register`
2. Fill in all fields
3. Click "Register"
4. Should see success message and redirect to login

### 3. Test Login
1. Navigate to `http://localhost:5173/login`
2. Enter your registered email and password
3. Click "Login"
4. Should redirect to student panel

### 4. Test Protected Routes
1. Try accessing `http://localhost:5173/student` without logging in
2. Should automatically redirect to login page

### 5. Test Logout
1. From student panel, click "Logout" button
2. Should redirect to login page
3. Token and user data should be cleared

## Admin vs Student Authentication

- **Admin**: Still uses the original admin login at `/admin/login`
- **Students**: Use the new registration/login system
- **Separate tokens**: Admin and student tokens are managed separately
- **Admin dashboard**: Accessible only with admin credentials

## Troubleshooting

### "User not found" error on login
- Make sure you've run the database schema in Supabase
- Verify the user was successfully registered
- Check Supabase dashboard for the `students` table

### Token issues
- Clear localStorage and try logging in again
- Check that JWT_SECRET is set in server/.env
- Verify token is being sent in Authorization header

### Registration fails
- Check that email and phone are unique
- Verify all validation rules are met
- Check server logs for detailed error messages

## Environment Variables

Make sure your `server/.env` includes:
```
JWT_SECRET=your-secret-key-here
```

The JWT_SECRET should already be set from the initial setup. If not, add it.
