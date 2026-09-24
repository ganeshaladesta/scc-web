-- Bank Indonesia SCC — data-entry schema
-- Web app writes raw reports. Power Apps consumes this data separately.

create extension if not exists "pgcrypto";

do $$ begin
  create type public.app_role as enum ('KORSEC', 'SCC_ADMIN');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.contact_person_jenis as enum ('OPERATIONAL_COMMANDER', 'SCC', 'ESS');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.activity_jenis as enum ('GIAT_MASYARAKAT', 'UNRAS');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.tingkat_perhatian as enum ('RENDAH', 'SEDANG', 'TINGGI', 'KRITIS');
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  role public.app_role not null default 'KORSEC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.master_wilayah (
  id uuid primary key default gen_random_uuid(),
  nama_wilayah text not null,
  keterangan text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id)
);

create table if not exists public.master_gedung (
  id uuid primary key default gen_random_uuid(),
  wilayah_id uuid not null references public.master_wilayah (id),
  nama_gedung text not null,
  alamat text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id)
);

create table if not exists public.master_shift (
  id uuid primary key default gen_random_uuid(),
  nama_shift text not null,
  jam_mulai time not null,
  jam_selesai time not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id)
);

create table if not exists public.master_korsec (
  id uuid primary key default gen_random_uuid(),
  nama_korsec text not null,
  no_hp text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id)
);

create table if not exists public.master_pambi_organik (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  nip text,
  jabatan text,
  photo_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id)
);

create table if not exists public.master_contact_person (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  jenis public.contact_person_jenis not null,
  jabatan text,
  no_hp text,
  foto_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id)
);

create table if not exists public.daily_contact_assignment (
  id uuid primary key default gen_random_uuid(),
  tanggal date not null,
  jenis public.contact_person_jenis not null,
  contact_person_id uuid not null references public.master_contact_person (id),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id),
  constraint daily_contact_assignment_tanggal_jenis_key unique (tanggal, jenis)
);

create table if not exists public.daily_personnel_reports (
  id uuid primary key default gen_random_uuid(),
  tanggal date not null,
  wilayah_id uuid not null references public.master_wilayah (id),
  gedung_id uuid not null references public.master_gedung (id),
  shift_id uuid not null references public.master_shift (id),
  korsec_id uuid not null references public.master_korsec (id),
  jumlah_personil integer not null check (jumlah_personil >= 0),
  created_by uuid not null default auth.uid() references auth.users (id),
  created_at timestamptz not null default now(),
  constraint daily_personnel_reports_tanggal_gedung_shift_key unique (tanggal, gedung_id, shift_id)
);

create table if not exists public.activity_reports (
  id uuid primary key default gen_random_uuid(),
  jenis public.activity_jenis not null,
  tanggal date not null,
  waktu_mulai time not null,
  waktu_selesai time not null,
  wilayah_id uuid references public.master_wilayah (id),
  gedung_id uuid references public.master_gedung (id),
  lokasi_text text not null,
  nama_kegiatan text,
  jumlah_peserta integer not null check (jumlah_peserta >= 0),
  pihak_terlibat text not null,
  tingkat_perhatian public.tingkat_perhatian not null,
  uraian text not null,
  created_by uuid not null default auth.uid() references auth.users (id),
  created_at timestamptz not null default now()
);

create index if not exists master_gedung_wilayah_id_idx on public.master_gedung (wilayah_id);
create index if not exists master_wilayah_active_idx on public.master_wilayah (active);
create index if not exists master_gedung_active_idx on public.master_gedung (active);
create index if not exists daily_personnel_reports_tanggal_idx on public.daily_personnel_reports (tanggal desc);
create index if not exists daily_personnel_reports_created_by_idx on public.daily_personnel_reports (created_by);
create index if not exists activity_reports_tanggal_idx on public.activity_reports (tanggal desc);
create index if not exists activity_reports_jenis_idx on public.activity_reports (jenis);
create index if not exists activity_reports_created_by_idx on public.activity_reports (created_by);
create index if not exists daily_contact_assignment_tanggal_idx on public.daily_contact_assignment (tanggal desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'KORSEC'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_scc_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'SCC_ADMIN'
  );
$$;

create or replace function public.validate_personnel_gedung()
returns trigger
language plpgsql
as $$
declare
  v_wilayah uuid;
begin
  select wilayah_id into v_wilayah
  from public.master_gedung
  where id = new.gedung_id;

  if v_wilayah is distinct from new.wilayah_id then
    raise exception 'Gedung tidak sesuai dengan wilayah yang dipilih';
  end if;

  return new;
end;
$$;

drop trigger if exists daily_personnel_reports_validate_gedung on public.daily_personnel_reports;
create trigger daily_personnel_reports_validate_gedung
before insert or update on public.daily_personnel_reports
for each row execute function public.validate_personnel_gedung();

create or replace function public.validate_contact_assignment_jenis()
returns trigger
language plpgsql
as $$
declare
  v_jenis public.contact_person_jenis;
begin
  select jenis into v_jenis
  from public.master_contact_person
  where id = new.contact_person_id;

  if v_jenis is distinct from new.jenis then
    raise exception 'Jenis contact person tidak sesuai dengan penugasan';
  end if;

  return new;
end;
$$;

drop trigger if exists daily_contact_assignment_validate_jenis on public.daily_contact_assignment;
create trigger daily_contact_assignment_validate_jenis
before insert or update on public.daily_contact_assignment
for each row execute function public.validate_contact_assignment_jenis();

alter table public.profiles enable row level security;
alter table public.master_wilayah enable row level security;
alter table public.master_gedung enable row level security;
alter table public.master_shift enable row level security;
alter table public.master_korsec enable row level security;
alter table public.master_pambi_organik enable row level security;
alter table public.master_contact_person enable row level security;
alter table public.daily_contact_assignment enable row level security;
alter table public.daily_personnel_reports enable row level security;
alter table public.activity_reports enable row level security;

-- Profiles
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
for select to authenticated
using (id = auth.uid() or public.is_scc_admin());

drop policy if exists profiles_update_admin on public.profiles;
create policy profiles_update_admin on public.profiles
for update to authenticated
using (public.is_scc_admin())
with check (public.is_scc_admin());

-- Master tables: authenticated can read active rows; admin can read all and write
drop policy if exists master_wilayah_select on public.master_wilayah;
create policy master_wilayah_select on public.master_wilayah
for select to authenticated
using (active = true or public.is_scc_admin());

drop policy if exists master_wilayah_write on public.master_wilayah;
create policy master_wilayah_write on public.master_wilayah
for all to authenticated
using (public.is_scc_admin())
with check (public.is_scc_admin());

drop policy if exists master_gedung_select on public.master_gedung;
create policy master_gedung_select on public.master_gedung
for select to authenticated
using (active = true or public.is_scc_admin());

drop policy if exists master_gedung_write on public.master_gedung;
create policy master_gedung_write on public.master_gedung
for all to authenticated
using (public.is_scc_admin())
with check (public.is_scc_admin());

drop policy if exists master_shift_select on public.master_shift;
create policy master_shift_select on public.master_shift
for select to authenticated
using (active = true or public.is_scc_admin());

drop policy if exists master_shift_write on public.master_shift;
create policy master_shift_write on public.master_shift
for all to authenticated
using (public.is_scc_admin())
with check (public.is_scc_admin());

drop policy if exists master_korsec_select on public.master_korsec;
create policy master_korsec_select on public.master_korsec
for select to authenticated
using (active = true or public.is_scc_admin());

drop policy if exists master_korsec_write on public.master_korsec;
create policy master_korsec_write on public.master_korsec
for all to authenticated
using (public.is_scc_admin())
with check (public.is_scc_admin());

drop policy if exists master_pambi_organik_select on public.master_pambi_organik;
create policy master_pambi_organik_select on public.master_pambi_organik
for select to authenticated
using (active = true or public.is_scc_admin());

drop policy if exists master_pambi_organik_write on public.master_pambi_organik;
create policy master_pambi_organik_write on public.master_pambi_organik
for all to authenticated
using (public.is_scc_admin())
with check (public.is_scc_admin());

drop policy if exists master_contact_person_select on public.master_contact_person;
create policy master_contact_person_select on public.master_contact_person
for select to authenticated
using (active = true or public.is_scc_admin());

drop policy if exists master_contact_person_write on public.master_contact_person;
create policy master_contact_person_write on public.master_contact_person
for all to authenticated
using (public.is_scc_admin())
with check (public.is_scc_admin());

drop policy if exists daily_contact_assignment_select on public.daily_contact_assignment;
create policy daily_contact_assignment_select on public.daily_contact_assignment
for select to authenticated
using (public.is_scc_admin());

drop policy if exists daily_contact_assignment_write on public.daily_contact_assignment;
create policy daily_contact_assignment_write on public.daily_contact_assignment
for all to authenticated
using (public.is_scc_admin())
with check (public.is_scc_admin());


-- Reports: created_by is always auth.uid(); KORSEC cannot spoof it
drop policy if exists daily_personnel_reports_select on public.daily_personnel_reports;
create policy daily_personnel_reports_select on public.daily_personnel_reports
for select to authenticated
using (created_by = auth.uid() or public.is_scc_admin());

drop policy if exists daily_personnel_reports_insert on public.daily_personnel_reports;
create policy daily_personnel_reports_insert on public.daily_personnel_reports
for insert to authenticated
with check (created_by = auth.uid());

drop policy if exists activity_reports_select on public.activity_reports;
create policy activity_reports_select on public.activity_reports
for select to authenticated
using (created_by = auth.uid() or public.is_scc_admin());

drop policy if exists activity_reports_insert on public.activity_reports;
create policy activity_reports_insert on public.activity_reports
for insert to authenticated
with check (created_by = auth.uid());

insert into public.master_shift (nama_shift, jam_mulai, jam_selesai, active)
select v.nama_shift, v.jam_mulai::time, v.jam_selesai::time, true
from (
  values
    ('PAGI', '06:00', '14:00'),
    ('SIANG', '14:00', '22:00'),
    ('MALAM', '22:00', '06:00')
) as v(nama_shift, jam_mulai, jam_selesai)
where not exists (
  select 1 from public.master_shift s where s.nama_shift = v.nama_shift
);

