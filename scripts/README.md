# Database Setup Scripts

## Populating Services

Your booking system needs services data to function. Follow these steps:

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** (in left sidebar)
3. Click **New Query**
4. Copy the contents of `seed-services.sql`
5. Paste into the SQL editor
6. Click **Run** (or press Ctrl/Cmd + Enter)

### Option 2: Using Supabase CLI

```bash
# Make sure you're logged in to Supabase CLI
supabase db push

# Run the seed script
supabase db execute -f scripts/seed-services.sql
```

## What Services Are Included?

The seed script adds these services:

**Manicures:**
- Classic Manicure - $25 (30 min)
- Gel Manicure - $35 (45 min)
- Acrylic Full Set - $55 (90 min)
- Acrylic Fill - $40 (60 min)
- Dip Powder Manicure - $45 (60 min)
- Nail Art (per nail) - $5 (10 min)

**Pedicures:**
- Basic Pedicure - $35 (45 min)
- Deluxe Spa Pedicure - $50 (60 min)
- Luxury Spa Pedicure - $65 (75 min)
- Gel Pedicure - $45 (60 min)

**Combos:**
- Manicure & Pedicure Combo - $55 (90 min)
- Gel Manicure & Pedicure Combo - $70 (105 min)

**Waxing:**
- Eyebrow Waxing - $12 (15 min)
- Lip Waxing - $8 (10 min)
- Full Face Waxing - $35 (30 min)
- Underarm Waxing - $20 (15 min)

## Customizing Services

You can modify prices and services by:

1. **Edit before running:** Modify `seed-services.sql` before running it
2. **Edit in Supabase:** Go to Table Editor → services → Edit rows
3. **Add more services:** Insert additional rows in Supabase Table Editor

## Verify Services Are Loaded

After running the seed script:

1. Go to Supabase → Table Editor → `services` table
2. You should see 16 services listed
3. Test by visiting `/book-appointment` on your site
4. Services should now appear in Step 2

## Troubleshooting

**"No services available" in booking flow:**
- Check that the `services` table exists in Supabase
- Verify data was inserted (check Table Editor)
- Check browser console for API errors

**Services not showing up:**
- Clear browser cache
- Check Supabase RLS (Row Level Security) policies
- Ensure services table has SELECT policy for anon users
