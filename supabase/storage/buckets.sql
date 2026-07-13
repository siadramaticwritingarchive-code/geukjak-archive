-- Storage buckets and policies for public browser clients.
-- Apply after `migrations/001_initial_schema.sql`.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'work-images',
    'work-images',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'work-pdfs',
    'work-pdfs',
    false,
    52428800,
    array['application/pdf']
  ),
  (
    'profile-images',
    'profile-images',
    true,
    2097152,
    array['image/jpeg', 'image/png', 'image/webp']
  )
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Anyone can read work images"
on storage.objects for select
using (bucket_id = 'work-images');

create policy "Admins can upload work images"
on storage.objects for insert
with check (
  bucket_id = 'work-images'
  and public.can_manage_work_archive()
);

create policy "Admins can update work images"
on storage.objects for update
using (
  bucket_id = 'work-images'
  and public.can_manage_work_archive()
)
with check (
  bucket_id = 'work-images'
  and public.can_manage_work_archive()
);

create policy "Admins can delete work images"
on storage.objects for delete
using (
  bucket_id = 'work-images'
  and public.can_manage_work_archive()
);

create policy "profiles can read downloadable work PDFs"
on storage.objects for select
using (
  bucket_id = 'work-pdfs'
  and exists (
    select 1
    from public.works
    where works.script_pdf_path = storage.objects.name
      and works.visibility = 'published'
      and works.is_pdf_download_allowed = true
  )
);

create policy "Admins can upload work PDFs"
on storage.objects for insert
with check (
  bucket_id = 'work-pdfs'
  and public.can_manage_work_archive()
);

create policy "Admins can update work PDFs"
on storage.objects for update
using (
  bucket_id = 'work-pdfs'
  and public.can_manage_work_archive()
)
with check (
  bucket_id = 'work-pdfs'
  and public.can_manage_work_archive()
);

create policy "Admins can delete work PDFs"
on storage.objects for delete
using (
  bucket_id = 'work-pdfs'
  and public.can_manage_work_archive()
);

create policy "Anyone can read profile images"
on storage.objects for select
using (bucket_id = 'profile-images');

create policy "profiles can upload own profile image"
on storage.objects for insert
with check (
  bucket_id = 'profile-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "profiles can update own profile image"
on storage.objects for update
using (
  bucket_id = 'profile-images'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'profile-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "profiles can delete own profile image"
on storage.objects for delete
using (
  bucket_id = 'profile-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);
