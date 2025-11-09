# Luxury Nails & Spa - Customer Portal

A comprehensive customer interface for a nail salon, built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

## 🎯 Features

### Customer-Facing Features

1. **Walk-in Check-In** (`/check-in`)
   - 3-step process: Select services → Choose technician → Enter information
   - Service selection with real-time price and duration calculation
   - Technician selection with "Next Available" option
   - Optional phone number validation

2. **Book Appointment** (`/book-appointment`)
   - 4-step booking flow: Contact info → Services → Date & Time → Notes
   - Interactive calendar for date selection
   - 30-minute time slot intervals (9 AM - 7 PM)
   - Optional notes for special requests

3. **My Appointments** (`/my-appointments`)
   - Search appointments by phone number
   - View all past and upcoming appointments
   - Detailed service breakdown and pricing

4. **Contact Us** (`/contact`)
   - Contact form with validation
   - Salon information display
   - Mapbox integration (with graceful fallback)
   - Business hours

### Management Features

1. **Management Login** (`/management/login`)
   - Secure authentication with Supabase Auth
   - Email/password login

2. **Management Signup** (`/management/signup`)
   - New staff member registration
   - Email verification support

3. **Management Dashboard** (`/management/dashboard`)
   - Protected route requiring authentication
   - Overview of appointments, check-ins, and messages
   - Sign out functionality

## 🛠 Technology Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Mapping**: Mapbox GL (optional)
- **Date Handling**: date-fns

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)
- (Optional) Mapbox account for map integration

### 1. Clone and Install

```bash
git clone <repository-url>
cd checkdus
npm install
```

### 2. Set Up Supabase

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned
3. Go to Settings → API to find your credentials

#### Run the Database Schema

1. In your Supabase project, go to SQL Editor
2. Copy the entire contents of `supabase-schema.sql`
3. Paste and run it in the SQL Editor
4. This will:
   - Create all necessary tables (services, technicians, check_ins, appointments, contact_messages)
   - **Set up proper RLS policies** (fixes the appointment booking error)
   - Insert sample data for services and technicians
   - Create indexes for performance

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy from .env.example
cp .env.example .env.local
```

Edit `.env.local` with your actual values:

```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Mapbox Configuration (OPTIONAL)
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token-here

# Salon Information (OPTIONAL - defaults provided)
NEXT_PUBLIC_SALON_NAME=Luxury Nails & Spa
NEXT_PUBLIC_SALON_ADDRESS=123 Main Street, Suite 100, City, State 12345
NEXT_PUBLIC_SALON_PHONE=(555) 123-4567
NEXT_PUBLIC_SALON_EMAIL=info@luxurynails.com
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

## 🔒 Security Features Implemented

### Row Level Security (RLS) Policies

The application includes **properly configured RLS policies** that fix the critical appointment booking error mentioned in your analysis:

```sql
-- CRITICAL FIX: Allow anonymous users to INSERT appointments
CREATE POLICY "Anyone can create appointments"
  ON appointments FOR INSERT
  TO anon
  WITH CHECK (true);
```

**What was fixed:**
- ❌ **Before**: "Error: new row violates row-level security policy for table 'appointments'"
- ✅ **After**: Anonymous users can successfully book appointments

### Phone Validation

**Consistent validation** across all forms using a unified `validatePhone()` utility:

```typescript
// Accepts: (555) 123-4567, 555-123-4567, 5551234567, +1 555 123 4567
export function validatePhone(phone: string): boolean {
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length === 10 || digitsOnly.length === 11;
}
```

**What was fixed:**
- ❌ **Before**: Two different validation styles (toast vs inline)
- ✅ **After**: Consistent inline validation with clear error messages

### Mapbox Integration

**Graceful handling** of missing Mapbox token:

**What was fixed:**
- ❌ **Before**: "Map requires Mapbox token. Configure MAPBOX_PUBLIC_TOKEN in backend secrets"
- ✅ **After**: Clear error message with instructions, map is optional

## 📊 Database Schema

### Tables

1. **services** - Nail salon services (manicures, pedicures, etc.)
2. **technicians** - Staff members with specialties
3. **check_ins** - Walk-in customer check-ins
4. **appointments** - Scheduled appointments
5. **contact_messages** - Messages from contact form

### Sample Data

The schema includes sample data:
- 8 services (Basic Manicure, Gel Manicure, Acrylic Full Set, etc.)
- 4 technicians (Sarah Chen, Maria Rodriguez, Jennifer Kim, Lisa Thompson)

## 🎨 User Flows

### Flow 1: Walk-in Check-In
1. Customer clicks "Check In Now"
2. Selects services (with running total)
3. Chooses technician (or "Next Available")
4. Enters name and optional phone
5. Receives confirmation

### Flow 2: Book Appointment
1. Customer clicks "Book Appointment"
2. Enters name and phone number
3. Selects services
4. Picks date and time from calendar
5. Adds optional notes
6. Reviews summary and confirms

### Flow 3: View Appointments
1. Customer clicks "My Appointments"
2. Enters phone number
3. Views all appointments with full details
4. Sees status badges (pending, confirmed, completed, cancelled)

### Flow 4: Contact
1. Customer clicks "Contact Us"
2. Fills out contact form
3. Views salon information and hours
4. Sees location on map (if configured)

### Flow 5: Management Login
1. Staff clicks "Management Login"
2. Signs in with email/password
3. Accesses protected dashboard
4. Views appointments, check-ins, and messages

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🐛 Issues Fixed from Original Analysis

| Issue | Status | Fix |
|-------|--------|-----|
| Appointment booking RLS error | ✅ Fixed | Added proper RLS policies for anonymous users |
| Missing Mapbox token | ✅ Fixed | Graceful error handling with clear instructions |
| Inconsistent phone validation | ✅ Fixed | Unified validation utility across all forms |

## 📝 Future Enhancements

- [ ] Real-time Mapbox map integration
- [ ] Email notifications for appointments
- [ ] SMS reminders
- [ ] Online payment processing
- [ ] Advanced management dashboard with analytics
- [ ] Appointment rescheduling
- [ ] Customer reviews and ratings
- [ ] Service package bundles

## 🧪 Testing

To test the application:

1. **Check-in Flow**: Create a walk-in check-in
2. **Booking Flow**: Book an appointment for tomorrow
3. **Lookup**: Search for your appointment by phone
4. **Contact**: Submit a contact form message
5. **Management**: Create an account and sign in

## 📄 License

This project is licensed under the MIT License.

## 🤝 Support

For issues or questions:
- Check the documentation
- Review the database schema
- Verify environment variables are set correctly
- Check browser console for errors

## 🎉 Credits

Built with modern web technologies and best practices for salon management.
