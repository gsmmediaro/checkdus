# 🚀 Vercel + Supabase Setup Guide

## Current Issues & Status

### ✅ Already Fixed in Latest Code
These bugs have been fixed and will work once deployed:
1. **Pricing Removed** - All customer-facing prices removed
2. **12-Hour Time Format** - Times display as "9:00 AM" instead of "09:00"
3. **Booking Error Handling** - Enhanced validation and error messages
4. **Customer Creation Error Handling** - Better error messages and logging
5. **Form Validation** - Name and phone validation on booking form

### ⚠️ Setup Required
These issues require database setup in Supabase:
1. **Services Not Loading** - Need to run database schema
2. **Appointments Not Saving** - Need to run database schema
3. **Customers Not Saving** - Need to run customer profiles schema

---

## Step 1: Set Up Supabase Database

### 1.1 Run the Main Schema

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the file `supabase-schema.sql` in this repository
5. Copy ALL the contents and paste into the SQL Editor
6. Click **Run** (or press Ctrl+Enter)

**What this creates:**
- `services` table with 8 default services (Acrylic Full Set, Gel Manicure, etc.)
- `technicians` table with 4 sample technicians
- `appointments` table for customer bookings
- `check_ins` table for walk-in customers
- `contact_messages` table for contact form
- RLS (Row Level Security) policies to allow public booking

### 1.2 Run the Customer Profiles Schema

1. Still in SQL Editor, click **New Query**
2. Open the file `supabase-schema-customer-profiles.sql` in this repository
3. Copy ALL the contents and paste into the SQL Editor
4. Click **Run**

**What this creates:**
- `customer_profiles` table with nail preferences, allergies, notes, etc.
- Auto-update triggers to track last visit date
- RLS policies for customer management

### 1.3 Run the Admin Access Policies

1. Still in SQL Editor, click **New Query**
2. Open the file `supabase-admin-policies.sql` in this repository
3. Copy ALL the contents and paste into the SQL Editor
4. Click **Run**

**What this creates:**
- RLS policies allowing authenticated admins to view/manage all data
- Enables the management dashboard to view check-ins, appointments, customers
- **IMPORTANT:** Without this, admins can't see check-ins in the backend!

### 1.4 Verify Tables Were Created

1. In Supabase, click **Table Editor** in the left sidebar
2. You should see these tables:
   - ✓ services (8 rows)
   - ✓ technicians (4 rows)
   - ✓ appointments (empty initially)
   - ✓ check_ins (empty initially)
   - ✓ contact_messages (empty initially)
   - ✓ customer_profiles (empty initially)

---

## Step 2: Configure Vercel Environment Variables

Your app needs to connect to Supabase. You must add environment variables to Vercel.

### 2.1 Get Your Supabase Credentials

1. In Supabase, click **Project Settings** (gear icon in sidebar)
2. Click **API** in the left menu
3. Copy these two values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### 2.2 Add to Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** tab
3. Click **Environment Variables** in the left menu
4. Add these two variables:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Project URL from Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon/public key from Supabase |

5. Make sure to check **Production**, **Preview**, and **Development** for both
6. Click **Save**

### 2.3 Redeploy

After adding environment variables, you MUST redeploy:

1. Go to **Deployments** tab in Vercel
2. Find the most recent deployment
3. Click the three dots **•••** on the right
4. Click **Redeploy**
5. Confirm the redeploy

Wait 1-2 minutes for the deployment to complete.

---

## Step 3: Verify Everything Works

### 3.1 Test Customer Booking Flow

1. Go to your Vercel URL (e.g., `your-project.vercel.app`)
2. Click **Book Appointment**
3. **Verify:**
   - ✓ Services show up in Step 2 (Acrylic Full Set, Gel Manicure, etc.)
   - ✓ NO prices are visible
   - ✓ Times show in 12-hour format (9:00 AM, not 09:00)
   - ✓ Can't proceed from Step 1 without name and phone
   - ✓ Booking creates appointment successfully

### 3.2 Test Admin Panel

1. Go to `your-project.vercel.app/management/login`
2. Create an admin account (first signup becomes admin)
3. **Test Appointment Management:**
   - Go to **Appointments** - should see any test bookings
   - Click **+ New Appointment** - should see services list
4. **Test Customer Profiles:**
   - Go to **Customers**
   - Click **+ New Customer**
   - Fill out the form and submit
   - Should see success and customer appears in list
5. **Test Check-Ins Management:**
   - Create a test walk-in check-in from the customer portal
   - Go to **Check-Ins** in admin dashboard
   - Should see the check-in with all details

---

## Step 4: Clear Browser Cache (Important!)

If you're still seeing old bugs (pricing, military time, etc.):

1. **Hard Refresh:**
   - Chrome/Edge: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Firefox: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)

2. **Or Clear Cache:**
   - Chrome: Settings → Privacy → Clear browsing data → Cached images and files
   - Then refresh the page

---

## Troubleshooting

### Services Still Not Loading

**Check browser console:**
1. Press F12 to open Developer Tools
2. Go to **Console** tab
3. Look for errors when loading the page

**Common issues:**
- `"relation \"services\" does not exist"` → Run `supabase-schema.sql` in Supabase
- `"Failed to fetch"` or CORS error → Check environment variables in Vercel
- `"Invalid API key"` → Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct

### Booking Still Fails

**Check console logs:**
1. F12 → Console tab
2. Try to book an appointment
3. Look for red error messages

**Common issues:**
- `"relation \"appointments\" does not exist"` → Run `supabase-schema.sql`
- `"row-level security policy"` → Schema includes RLS policies, re-run it
- `"Load failed"` → Environment variables not set or incorrect

### Still Seeing Pricing or Military Time

**This means you're viewing an old cached version:**
1. Hard refresh (Ctrl+Shift+R)
2. Or check which deployment is live:
   - Vercel → Deployments
   - Make sure the latest commit is deployed
   - Look for: "fix: Critical booking flow improvements..."

---

## Summary Checklist

- [ ] Run `supabase-schema.sql` in Supabase SQL Editor
- [ ] Run `supabase-schema-customer-profiles.sql` in Supabase SQL Editor
- [ ] Run `supabase-admin-policies.sql` in Supabase SQL Editor (IMPORTANT!)
- [ ] Verify tables exist in Table Editor
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL` to Vercel environment variables
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel environment variables
- [ ] Redeploy in Vercel after adding env variables
- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Test booking flow - services load, no pricing, 12-hour time
- [ ] Test admin panel - create customer, create appointment, view check-ins

---

## What Auto-Deploys to Vercel

**Automatic:**
- Every `git push` to GitHub triggers a new Vercel deployment
- Main branch → Production deployment
- Other branches → Preview deployments

**Each deployment includes:**
- Latest code changes
- Environment variables (set once, persist across deploys)

**After setup, any future code changes will auto-deploy when you push to GitHub!**
