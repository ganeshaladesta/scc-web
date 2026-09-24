# Bank Indonesia — SCC Web Input

Mobile-first web app for daily Security Command Center data entry.

## Stack

- Next.js 16 + React 19 + TypeScript
- Supabase Auth + PostgreSQL + RLS
- Tailwind CSS v4
- shadcn/ui + Radix
- React Hook Form + Zod

## Flow

KORSEC:

1. Login
2. Home
3. Personil Harian — choose Wilayah → Gedung → Shift → Korsec → Jumlah Personil
4. Kegiatan → Giat Masyarakat or Unjuk Rasa (optional)
5. Riwayat
6. Profil

SCC_ADMIN:

- Everything above
- Master Data
- Penugasan Harian: Operational Commander, SCC, ESS

## Environment

Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Never put a Supabase secret key/service-role key in the browser or `.env` variables exposed to the client.

## Supabase

Run `supabase/migrations/20260924000000_init_scc.sql` in the Supabase SQL editor.

New Auth users are automatically created as `KORSEC` in `public.profiles`.

### First SCC Admin

After creating the first SCC user in Supabase Authentication, copy the Auth user UUID and run:

```sql
update public.profiles
set role = 'SCC_ADMIN'
where id = 'USER_UUID';
```

Do not expose role promotion as a public UI.

## Development

```bash
npm install
npm run dev
```

Validation:

```bash
npm run lint
npx tsc --noEmit
npm run build
```
