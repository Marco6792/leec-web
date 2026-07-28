create or replace function public.delete_user_account()
returns void
language plpgsql
security definer
as $$
declare
  uid uuid;
begin
  uid := auth.uid();
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  delete from public.lab_members where user_id = uid;
  delete from public.education where user_id = uid;
  delete from public.profiles where id = uid;
  delete from auth.users where id = uid;
end;
$$;
