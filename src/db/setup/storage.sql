-- ============================================================================
-- LEEC Platform — Storage setup (PDF documents)
-- Run this in the Supabase SQL editor AFTER applying rls.sql (needs helpers).
--
-- Creates a public `documents` bucket used by the admin PDF uploads and
-- allows lab staff (director / pi / technician) to manage objects in it.
-- ============================================================================

-- ─── 1. Bucket ─────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do update set public = true;

-- ─── 2. Helper: is the current user an active lab staff member ────────────

create or replace function public.is_lab_staff()
returns boolean as $$
  select exists (
    select 1 from lab_members
    where lab_members.user_id = auth.uid()
    and lab_members.role in ('director', 'pi', 'technician')
    and lab_members.status = 'active'
  );
$$ language sql stable;

-- ─── 3. Policies on storage.objects for the documents bucket ──────────────

-- Everyone can read public documents
create policy "Anyone can read documents"
  on storage.objects for select
  using (bucket_id = 'documents');

-- Lab staff can upload documents
create policy "Lab staff can upload documents"
  on storage.objects for insert
  with check (bucket_id = 'documents' and public.is_lab_staff());

-- Lab staff can update documents
create policy "Lab staff can update documents"
  on storage.objects for update
  using (bucket_id = 'documents' and public.is_lab_staff());

-- Lab staff can delete documents
create policy "Lab staff can delete documents"
  on storage.objects for delete
  using (bucket_id = 'documents' and public.is_lab_staff());
