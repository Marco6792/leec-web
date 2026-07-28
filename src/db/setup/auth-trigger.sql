-- ============================================================================
-- LEEC Platform — Auth & RLS Setup
-- Run this AFTER drizzle-kit migrate creates the tables.
-- ============================================================================

-- ─── 1. Profiles FK to auth.users ──────────────────────────────────────────
-- The profiles.id references auth.users.id.
-- This FK is NOT in the Drizzle schema (drizzle can't reference the auth schema).

alter table profiles
  add constraint fk_profiles_auth_users
  foreign key (id) references auth.users(id)
  on delete cascade;

-- ─── 2. Auto-create profile on user signup ─────────────────────────────────

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, researcher_type, institution, department, organization, title, speciality)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email, 'Unknown'),
    new.raw_user_meta_data ->> 'avatar_url',
    new.raw_user_meta_data ->> 'researcher_type',
    new.raw_user_meta_data ->> 'institution',
    new.raw_user_meta_data ->> 'department',
    new.raw_user_meta_data ->> 'organization',
    new.raw_user_meta_data ->> 'title',
    new.raw_user_meta_data ->> 'speciality'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop the trigger if it already exists (idempotent)
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── 3. Enable RLS on all tables (policies are in rls.sql) ─────────────────

do $$
declare
  tbl text;
begin
  for tbl in
    select tablename from pg_tables
    where schemaname = 'public'
      and tablename not in ('_prisma_migrations', 'drizzle_migrations')
  loop
    execute format('alter table %I enable row level security;', tbl);
  end loop;
end $$;

-- ─── 4. Lab members FK to profiles ─────────────────────────────────────────
-- (lab_members.user_id FK is already in the Drizzle schema)
-- (lab_members.lab_id → research_centers FK is already in the Drizzle schema)
