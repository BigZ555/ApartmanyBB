# ApartmanyBB

A modern apartment advertising website with admin panel, built with Next.js, Supabase, and Tailwind CSS.

## Features

- **Home page** with company (B-Servis) and apartments (BB Apartmány) selector
- **B-Servis page** – "Under construction" placeholder
- **BB Apartments page** – city description, photos, rooms, shared spaces, Google Maps, contact form, price list
- **Bilingual support** – Slovak (SK) and Hungarian (HU)
- **Admin panel** – edit all content: texts, photos, rooms, prices, map location, email
- **Supabase backend** – PostgreSQL database with Row Level Security

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) (Auth + Database)
- [Lucide Icons](https://lucide.dev/)
- Deployed on [Vercel](https://vercel.com/)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Go to **Settings > API** and copy your project URL and anon key

### 3. Configure environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Create admin user

1. In Supabase Dashboard, go to **Authentication > Users > Add user**
2. Create a user with email and password
3. In **SQL Editor**, run:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

1. Push this project to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home (company/apartment selector)
│   ├── b-servis/page.tsx     # B-Servis (under construction)
│   ├── apartments/page.tsx   # BB Apartments listing
│   ├── admin/
│   │   ├── page.tsx          # Admin login
│   │   └── dashboard/page.tsx # Admin CRUD panel
│   └── api/contact/route.ts  # Contact form API
├── components/
│   ├── Header.tsx            # Navigation + language selector
│   ├── ApartmentsContent.tsx # Public apartments page
│   ├── ContactForm.tsx       # Inquiry form
│   ├── PhotoGallery.tsx      # Image carousel
│   └── admin/                # Admin editor components
├── lib/
│   ├── supabase/             # Supabase client setup
│   ├── i18n/                 # Slovak/Hungarian translations
│   └── data/                 # Server-side data fetching
└── types/
    └── database.ts           # TypeScript types
```

## Admin Panel

Log in at `/admin` with your admin credentials. From the dashboard you can:

- **Apartment** – edit name, city, address, description, Google Maps embed URL, email, phone
- **Rooms** – add/edit/delete rooms with name, description, capacity
- **Images** – add photos by URL (city, apartment, room, shared categories)
- **Prices** – set room prices by season and currency
- **Settings** – company name, contact email, phone, map URL

### Adding Photos

Upload images to Supabase Storage or use any external URL, then paste the URL in the admin Images tab.

### Google Maps Embed

1. Go to [Google Maps](https://maps.google.com)
2. Find your location → Share → Embed a map
3. Copy the `src` URL from the iframe
4. Paste it in the admin Apartment editor

## Database Tables

| Table | Description |
|-------|-------------|
| `apartments` | Main apartment info (name, city, description, map, contact) |
| `rooms` | Individual rooms with capacity |
| `images` | Photos linked to apartment/room with category |
| `prices` | Room pricing by season |
| `profiles` | User profiles with admin role |
| `settings` | Global site settings |

## License

Private project – all rights reserved.
