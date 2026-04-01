# Supabase-Only Backend Migration

This project can now run backend logic through Supabase Edge Functions without Render.

## What Was Added

- Edge functions under supabase/functions for auth, orders, admin, and health.
- Shared hardened utilities for CORS, JWT auth, env validation, and JSON responses.
- Frontend API client now calls Supabase Functions directly.

## Function List

- auth-register
- auth-login
- auth-profile
- orders-create
- orders-by-phone
- orders-delete
- admin-login
- admin-orders
- admin-order-status
- admin-stats
- health

## Prerequisites

1. Supabase CLI installed.
2. Logged in to Supabase CLI.
3. Linked project:

```bash
supabase login
supabase link --project-ref sxqsqdbqmwfemhlmrfey
```

## Required Secrets

Set these secrets for edge functions:

```bash
supabase secrets set SUPABASE_URL=https://sxqsqdbqmwfemhlmrfey.supabase.co
supabase secrets set SUPABASE_ANON_KEY=YOUR_ANON_KEY
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
supabase secrets set SUPABASE_STORAGE_BUCKET=smartxerox-files
supabase secrets set JWT_SECRET=YOUR_JWT_SECRET
supabase secrets set ADMIN_EMAIL=YOUR_ADMIN_EMAIL
supabase secrets set ADMIN_PASSWORD=YOUR_ADMIN_PASSWORD
supabase secrets set ALLOWED_ORIGINS=https://your-vercel-domain.vercel.app,http://localhost:5173
```

## Deploy Functions

From repository root:

```bash
supabase functions deploy auth-register
supabase functions deploy auth-login
supabase functions deploy auth-profile
supabase functions deploy orders-create
supabase functions deploy orders-by-phone
supabase functions deploy orders-delete
supabase functions deploy admin-login
supabase functions deploy admin-orders
supabase functions deploy admin-order-status
supabase functions deploy admin-stats
supabase functions deploy health
```

## Frontend Environment (Vercel)

Set these in Vercel project environment variables:

- VITE_SUPABASE_URL=https://sxqsqdbqmwfemhlmrfey.supabase.co
- VITE_SUPABASE_FUNCTIONS_URL=(optional, leave empty unless custom routing)

## Validation Checklist

1. Register student.
2. Login student.
3. Upload file with note.
4. Fetch orders by phone.
5. Admin login.
6. Admin updates status.
7. Admin stats loads.
8. Health check returns success:
   - https://sxqsqdbqmwfemhlmrfey.supabase.co/functions/v1/health

## Notes

- Render is no longer required once frontend points to functions and functions are deployed.
- Keep service role key private. Never expose it in frontend env.
