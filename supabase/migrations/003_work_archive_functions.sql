-- Work archive helpers used by the browser client.
-- Apply after `001_initial_schema.sql`.

create or replace function public.increment_work_view_count(work_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.works
  set view_count = view_count + 1
  where id = work_id
    and visibility = 'published';
end;
$$;

create or replace function public.sync_work_bookmark_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' and new.work_id is not null then
    update public.works
    set bookmark_count = bookmark_count + 1
    where id = new.work_id;
  end if;

  if tg_op = 'DELETE' and old.work_id is not null then
    update public.works
    set bookmark_count = greatest(bookmark_count - 1, 0)
    where id = old.work_id;
  end if;

  return null;
end;
$$;

drop trigger if exists sync_work_bookmark_count_on_insert on public.bookmarks;
drop trigger if exists sync_work_bookmark_count_on_delete on public.bookmarks;

create trigger sync_work_bookmark_count_on_insert
after insert on public.bookmarks
for each row execute function public.sync_work_bookmark_count();

create trigger sync_work_bookmark_count_on_delete
after delete on public.bookmarks
for each row execute function public.sync_work_bookmark_count();
