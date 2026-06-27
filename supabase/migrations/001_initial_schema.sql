-- SIA Playwriting Archive initial schema
-- Apply this after creating a Supabase project. It assumes Supabase Auth is enabled.

create extension if not exists "pgcrypto";

create type public.user_role as enum ('student', 'faculty', 'admin');
create type public.work_visibility as enum ('draft', 'published', 'archived');
create type public.community_board_type as enum ('free', 'questions', 'announcements', 'anonymous');
create type public.report_status as enum ('open', 'reviewing', 'resolved', 'dismissed');
create type public.notification_type as enum ('comment', 'reply', 'like', 'bookmark', 'announcement', 'system');

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text not null,
  avatar_path text,
  role public.user_role not null default 'student',
  bio text,
  is_blocked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table public.works (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author_id uuid references public.users(id) on delete set null,
  author_name text not null,
  year integer not null check (year >= 1900 and year <= 2100),
  genre text not null,
  synopsis text not null,
  category_id uuid references public.categories(id) on delete set null,
  poster_path text,
  script_pdf_path text,
  is_pdf_download_allowed boolean not null default false,
  visibility public.work_visibility not null default 'draft',
  is_featured boolean not null default false,
  view_count integer not null default 0 check (view_count >= 0),
  like_count integer not null default 0 check (like_count >= 0),
  bookmark_count integer not null default 0 check (bookmark_count >= 0),
  created_by uuid references public.users(id) on delete set null,
  updated_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table public.work_tags (
  work_id uuid not null references public.works(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (work_id, tag_id)
);

create table public.community_posts (
  id uuid primary key default gen_random_uuid(),
  board_type public.community_board_type not null,
  author_id uuid references public.users(id) on delete set null,
  title text not null,
  content text not null,
  is_anonymous boolean not null default false,
  is_pinned boolean not null default false,
  is_locked boolean not null default false,
  view_count integer not null default 0 check (view_count >= 0),
  like_count integer not null default 0 check (like_count >= 0),
  bookmark_count integer not null default 0 check (bookmark_count >= 0),
  report_count integer not null default 0 check (report_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint anonymous_board_requires_anonymous check (
    board_type <> 'anonymous' or is_anonymous = true
  )
);

create table public.community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  author_id uuid references public.users(id) on delete set null,
  content text not null,
  is_anonymous boolean not null default false,
  like_count integer not null default 0 check (like_count >= 0),
  report_count integer not null default 0 check (report_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null references public.works(id) on delete cascade,
  author_id uuid references public.users(id) on delete set null,
  content text not null,
  like_count integer not null default 0 check (like_count >= 0),
  report_count integer not null default 0 check (report_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.replies (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid references public.comments(id) on delete cascade,
  community_comment_id uuid references public.community_comments(id) on delete cascade,
  author_id uuid references public.users(id) on delete set null,
  content text not null,
  like_count integer not null default 0 check (like_count >= 0),
  report_count integer not null default 0 check (report_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint replies_single_parent check (
    (comment_id is not null and community_comment_id is null)
    or (comment_id is null and community_comment_id is not null)
  )
);

create table public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  work_id uuid references public.works(id) on delete cascade,
  post_id uuid references public.community_posts(id) on delete cascade,
  comment_id uuid references public.comments(id) on delete cascade,
  community_comment_id uuid references public.community_comments(id) on delete cascade,
  reply_id uuid references public.replies(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint likes_single_target check (
    num_nonnulls(work_id, post_id, comment_id, community_comment_id, reply_id) = 1
  ),
  constraint likes_unique_target unique nulls not distinct (
    user_id,
    work_id,
    post_id,
    comment_id,
    community_comment_id,
    reply_id
  )
);

create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  work_id uuid references public.works(id) on delete cascade,
  post_id uuid references public.community_posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint bookmarks_single_target check (
    (work_id is not null and post_id is null)
    or (work_id is null and post_id is not null)
  ),
  constraint bookmarks_unique_target unique nulls not distinct (
    user_id,
    work_id,
    post_id
  )
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.users(id) on delete cascade,
  actor_id uuid references public.users(id) on delete set null,
  type public.notification_type not null,
  title text not null,
  body text,
  work_id uuid references public.works(id) on delete cascade,
  post_id uuid references public.community_posts(id) on delete cascade,
  comment_id uuid references public.comments(id) on delete cascade,
  reply_id uuid references public.replies(id) on delete cascade,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index users_role_idx on public.users(role);
create index works_visibility_created_at_idx on public.works(visibility, created_at desc);
create index works_category_id_idx on public.works(category_id);
create index works_author_id_idx on public.works(author_id);
create index works_featured_idx on public.works(is_featured) where is_featured = true;
create index work_tags_tag_id_idx on public.work_tags(tag_id);
create index community_posts_board_created_at_idx on public.community_posts(board_type, created_at desc);
create index community_posts_author_id_idx on public.community_posts(author_id);
create index community_comments_post_id_idx on public.community_comments(post_id);
create index comments_work_id_idx on public.comments(work_id);
create index replies_comment_id_idx on public.replies(comment_id);
create index replies_community_comment_id_idx on public.replies(community_comment_id);
create index likes_user_id_idx on public.likes(user_id);
create index bookmarks_user_id_idx on public.bookmarks(user_id);
create index notifications_recipient_read_idx on public.notifications(recipient_id, read_at, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_users_updated_at
before update on public.users
for each row execute function public.set_updated_at();

create trigger set_categories_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

create trigger set_works_updated_at
before update on public.works
for each row execute function public.set_updated_at();

create trigger set_community_posts_updated_at
before update on public.community_posts
for each row execute function public.set_updated_at();

create trigger set_community_comments_updated_at
before update on public.community_comments
for each row execute function public.set_updated_at();

create trigger set_comments_updated_at
before update on public.comments
for each row execute function public.set_updated_at();

create trigger set_replies_updated_at
before update on public.replies
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where id = auth.uid()
      and role = 'admin'
      and is_blocked = false
  );
$$;

create or replace function public.is_active_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where id = auth.uid()
      and is_blocked = false
  );
$$;

alter table public.users enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.works enable row level security;
alter table public.work_tags enable row level security;
alter table public.community_posts enable row level security;
alter table public.community_comments enable row level security;
alter table public.comments enable row level security;
alter table public.replies enable row level security;
alter table public.likes enable row level security;
alter table public.bookmarks enable row level security;
alter table public.notifications enable row level security;

create policy "Users can read public profiles"
on public.users for select
using (true);

create policy "Users can insert own profile"
on public.users for insert
with check (id = auth.uid());

create policy "Users can update own profile"
on public.users for update
using (id = auth.uid())
with check (id = auth.uid());

create policy "Admins can manage users"
on public.users for all
using (public.is_admin())
with check (public.is_admin());

create policy "Everyone can read categories"
on public.categories for select
using (true);

create policy "Admins can manage categories"
on public.categories for all
using (public.is_admin())
with check (public.is_admin());

create policy "Everyone can read tags"
on public.tags for select
using (true);

create policy "Admins can manage tags"
on public.tags for all
using (public.is_admin())
with check (public.is_admin());

create policy "Everyone can read published works"
on public.works for select
using (visibility = 'published' or public.is_admin());

create policy "Admins can manage works"
on public.works for all
using (public.is_admin())
with check (public.is_admin());

create policy "Everyone can read work tags"
on public.work_tags for select
using (
  exists (
    select 1 from public.works
    where works.id = work_tags.work_id
      and (works.visibility = 'published' or public.is_admin())
  )
);

create policy "Admins can manage work tags"
on public.work_tags for all
using (public.is_admin())
with check (public.is_admin());

create policy "Everyone can read visible community posts"
on public.community_posts for select
using (deleted_at is null or public.is_admin());

create policy "Active users can create community posts"
on public.community_posts for insert
with check (author_id = auth.uid() and public.is_active_user());

create policy "Authors can update own community posts"
on public.community_posts for update
using (author_id = auth.uid() and deleted_at is null)
with check (author_id = auth.uid());

create policy "Admins can manage community posts"
on public.community_posts for all
using (public.is_admin())
with check (public.is_admin());

create policy "Everyone can read visible community comments"
on public.community_comments for select
using (deleted_at is null or public.is_admin());

create policy "Active users can create community comments"
on public.community_comments for insert
with check (author_id = auth.uid() and public.is_active_user());

create policy "Authors can update own community comments"
on public.community_comments for update
using (author_id = auth.uid() and deleted_at is null)
with check (author_id = auth.uid());

create policy "Admins can manage community comments"
on public.community_comments for all
using (public.is_admin())
with check (public.is_admin());

create policy "Everyone can read visible work comments"
on public.comments for select
using (deleted_at is null or public.is_admin());

create policy "Active users can create work comments"
on public.comments for insert
with check (author_id = auth.uid() and public.is_active_user());

create policy "Authors can update own work comments"
on public.comments for update
using (author_id = auth.uid() and deleted_at is null)
with check (author_id = auth.uid());

create policy "Admins can manage work comments"
on public.comments for all
using (public.is_admin())
with check (public.is_admin());

create policy "Everyone can read visible replies"
on public.replies for select
using (deleted_at is null or public.is_admin());

create policy "Active users can create replies"
on public.replies for insert
with check (author_id = auth.uid() and public.is_active_user());

create policy "Authors can update own replies"
on public.replies for update
using (author_id = auth.uid() and deleted_at is null)
with check (author_id = auth.uid());

create policy "Admins can manage replies"
on public.replies for all
using (public.is_admin())
with check (public.is_admin());

create policy "Users can read own likes"
on public.likes for select
using (user_id = auth.uid() or public.is_admin());

create policy "Active users can create own likes"
on public.likes for insert
with check (user_id = auth.uid() and public.is_active_user());

create policy "Users can delete own likes"
on public.likes for delete
using (user_id = auth.uid() or public.is_admin());

create policy "Users can read own bookmarks"
on public.bookmarks for select
using (user_id = auth.uid() or public.is_admin());

create policy "Active users can create own bookmarks"
on public.bookmarks for insert
with check (user_id = auth.uid() and public.is_active_user());

create policy "Users can delete own bookmarks"
on public.bookmarks for delete
using (user_id = auth.uid() or public.is_admin());

create policy "Users can read own notifications"
on public.notifications for select
using (recipient_id = auth.uid() or public.is_admin());

create policy "Users can update own notifications"
on public.notifications for update
using (recipient_id = auth.uid())
with check (recipient_id = auth.uid());

create policy "Admins can manage notifications"
on public.notifications for all
using (public.is_admin())
with check (public.is_admin());
