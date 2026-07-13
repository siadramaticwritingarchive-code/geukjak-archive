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

create or replace function public.sync_like_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    if new.work_id is not null then
      update public.works set like_count = like_count + 1 where id = new.work_id;
    elsif new.post_id is not null then
      update public.community_posts set like_count = like_count + 1 where id = new.post_id;
    elsif new.comment_id is not null then
      update public.comments set like_count = like_count + 1 where id = new.comment_id;
    elsif new.community_comment_id is not null then
      update public.community_comments set like_count = like_count + 1 where id = new.community_comment_id;
    end if;
  end if;

  if tg_op = 'DELETE' then
    if old.work_id is not null then
      update public.works set like_count = greatest(like_count - 1, 0) where id = old.work_id;
    elsif old.post_id is not null then
      update public.community_posts set like_count = greatest(like_count - 1, 0) where id = old.post_id;
    elsif old.comment_id is not null then
      update public.comments set like_count = greatest(like_count - 1, 0) where id = old.comment_id;
    elsif old.community_comment_id is not null then
      update public.community_comments set like_count = greatest(like_count - 1, 0) where id = old.community_comment_id;
    end if;
  end if;

  return null;
end;
$$;

drop trigger if exists sync_like_count_on_insert on public.likes;
drop trigger if exists sync_like_count_on_delete on public.likes;

create trigger sync_like_count_on_insert
after insert on public.likes
for each row execute function public.sync_like_count();

create trigger sync_like_count_on_delete
after delete on public.likes
for each row execute function public.sync_like_count();

create or replace function public.sync_community_bookmark_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' and new.post_id is not null then
    update public.community_posts
    set bookmark_count = bookmark_count + 1
    where id = new.post_id;
  end if;

  if tg_op = 'DELETE' and old.post_id is not null then
    update public.community_posts
    set bookmark_count = greatest(bookmark_count - 1, 0)
    where id = old.post_id;
  end if;

  return null;
end;
$$;

drop trigger if exists sync_community_bookmark_count_on_insert on public.bookmarks;
drop trigger if exists sync_community_bookmark_count_on_delete on public.bookmarks;

create trigger sync_community_bookmark_count_on_insert
after insert on public.bookmarks
for each row execute function public.sync_community_bookmark_count();

create trigger sync_community_bookmark_count_on_delete
after delete on public.bookmarks
for each row execute function public.sync_community_bookmark_count();

create or replace function public.sync_community_comment_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.community_posts
    set comment_count = comment_count + 1
    where id = new.post_id;
  end if;

  if tg_op = 'UPDATE'
    and old.deleted_at is null
    and new.deleted_at is not null
  then
    update public.community_posts
    set comment_count = greatest(comment_count - 1, 0)
    where id = new.post_id;
  end if;

  return null;
end;
$$;

drop trigger if exists sync_community_comment_count_on_insert on public.community_comments;
drop trigger if exists sync_community_comment_count_on_soft_delete on public.community_comments;

create trigger sync_community_comment_count_on_insert
after insert on public.community_comments
for each row execute function public.sync_community_comment_count();

create trigger sync_community_comment_count_on_soft_delete
after update of deleted_at on public.community_comments
for each row execute function public.sync_community_comment_count();

create trigger sync_work_bookmark_count_on_delete
after delete on public.bookmarks
for each row execute function public.sync_work_bookmark_count();
