-- Sync public.auth_users from auth.users

-- Insert existing users
INSERT INTO public.auth_users (id, email)
SELECT id, email FROM auth.users
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

-- Auto-sync on new auth signup
create or replace function public.sync_auth_user()
returns trigger as $$
begin
  insert into public.auth_users (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = EXCLUDED.email;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_sync on auth.users;
create trigger on_auth_user_sync
  after insert on auth.users
  for each row execute function public.sync_auth_user();
