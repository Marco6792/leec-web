-- ============================================================================
-- LEEC Platform — Row-Level Security Policies
-- Apply AFTER running drizzle migrations to create the tables.
-- ============================================================================

-- ─── Helper Functions ──────────────────────────────────────────────────────

-- Check if a user is a member of a lab
create or replace function public.is_lab_member(lab_id uuid)
returns boolean as $$
  select exists (
    select 1 from lab_members
    where lab_members.user_id = auth.uid()
    and lab_members.lab_id = $1
    and lab_members.status = 'active'
  );
$$ language sql stable;

-- Check if a user has a specific role in a lab
create or replace function public.has_lab_role(lab_id uuid, role_name text)
returns boolean as $$
  select exists (
    select 1 from lab_members
    where lab_members.user_id = auth.uid()
    and lab_members.lab_id = $1
    and lab_members.role::text = role_name
    and lab_members.status = 'active'
  );
$$ language sql stable;

-- Check if a user is an admin of any lab
create or replace function public.is_any_lab_admin()
returns boolean as $$
  select exists (
    select 1 from lab_members
    where lab_members.user_id = auth.uid()
    and lab_members.role in ('director', 'pi')
    and lab_members.status = 'active'
  );
$$ language sql stable;

-- ============================================================================
-- PROFILES
-- ============================================================================

-- Everyone can view public profiles
create policy "Anyone can view public profiles"
  on profiles for select
  using (is_public = true);

-- Users can view their own profile
create policy "Users can view own profile"
  on profiles for select
  using (id = auth.uid());

-- Lab admins can view all profiles in their lab
create policy "Lab admins can view all lab profiles"
  on profiles for select
  using (is_any_lab_admin());

-- Users can update their own profile
create policy "Users can update own profile"
  on profiles for update
  using (id = auth.uid());

-- ============================================================================
-- LAB MEMBERS
-- ============================================================================

create policy "Lab members can view lab membership"
  on lab_members for select
  using (is_lab_member(lab_id));

create policy "Users can view own membership"
  on lab_members for select
  using (user_id = auth.uid());

create policy "Lab directors can manage membership"
  on lab_members for all
  using (has_lab_role(lab_id, 'director'));

-- ============================================================================
-- PUBLICATIONS
-- ============================================================================

create policy "Anyone can view publications"
  on publications for select
  using (true);

create policy "Lab members can create publications"
  on publications for insert
  with check (is_lab_member(
    (select lab_id from projects where projects.id = publications.id)
  ));

create policy "Authors can update their publications"
  on publications for update
  using (exists (
    select 1 from publication_authors
    where publication_authors.publication_id = publications.id
    and publication_authors.profile_id = auth.uid()
  ));

-- ============================================================================
-- NEWS
-- ============================================================================

create policy "Anyone can view published news"
  on news for select
  using (published = true);

create policy "Lab members can view all lab news"
  on news for select
  using (is_lab_member(lab_id));

create policy "Lab directors can manage news"
  on news for all
  using (has_lab_role(lab_id, 'director'));

-- ============================================================================
-- EVENTS
-- ============================================================================

create policy "Anyone can view published events"
  on events for select
  using (published = true);

create policy "Lab members can manage events"
  on events for all
  using (is_lab_member(lab_id));

-- ============================================================================
-- PROJECTS
-- ============================================================================

create policy "Anyone can view active projects"
  on projects for select
  using (status = 'active');

create policy "Lab members can view all lab projects"
  on projects for select
  using (is_lab_member(lab_id));

create policy "PI can manage their projects"
  on projects for all
  using (pi_id = auth.uid());

-- ============================================================================
-- EQUIPMENT
-- ============================================================================

create policy "Anyone can view public equipment"
  on equipment for select
  using (is_public = true);

create policy "Lab members can view all lab equipment"
  on equipment for select
  using (is_lab_member(lab_id));

create policy "Lab directors can manage equipment"
  on equipment for all
  using (has_lab_role(lab_id, 'director'));

-- ============================================================================
-- EQUIPMENT BOOKINGS
-- ============================================================================

create policy "Users can view own bookings"
  on equipment_bookings for select
  using (user_id = auth.uid());

create policy "Lab members can view all lab bookings"
  on equipment_bookings for select
  using (is_lab_member(
    (select lab_id from equipment where equipment.id = equipment_bookings.equipment_id)
  ));

create policy "Users can create bookings"
  on equipment_bookings for insert
  with check (user_id = auth.uid());

create policy "Lab admin can manage bookings"
  on equipment_bookings for update
  using (is_any_lab_admin());

-- ============================================================================
-- COMPLIANCE
-- ============================================================================

create policy "Lab admin can manage compliance records"
  on compliance_records for all
  using (has_lab_role(lab_id, 'director'));

-- ============================================================================
-- AUDIT LOGS (immutable — insert only)
-- ============================================================================

create policy "Lab admin can view audit logs"
  on audit_logs for select
  using (is_any_lab_admin());

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

create policy "Users can view own notifications"
  on notifications for select
  using (user_id = auth.uid());

create policy "System can insert notifications"
  on notifications for insert
  with check (true);

create policy "Users can mark own notifications as read"
  on notifications for update
  using (user_id = auth.uid());
