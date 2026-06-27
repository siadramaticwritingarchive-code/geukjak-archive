-- Auth profile bootstrap for email signup.
-- Apply after `001_initial_schema.sql`.

alter table public.users
add constraint users_display_name_key unique (display_name);

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_display_name text;
  fallback_display_name text;
begin
  requested_display_name := nullif(trim(new.raw_user_meta_data->>'display_name'), '');
  fallback_display_name := 'member-' || substr(new.id::text, 1, 8);

  insert into public.users (id, email, display_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(requested_display_name, fallback_display_name)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();
