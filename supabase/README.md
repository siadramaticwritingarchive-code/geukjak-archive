# Supabase setup

This folder contains local SQL and configuration artifacts only.

Apply order:

1. `migrations/001_initial_schema.sql`
2. `storage/buckets.sql`
3. Generate TypeScript types into `src/types/supabase.generated.ts`

Recommended type generation command after linking a real project:

```bash
supabase gen types typescript --project-id <project-id> --schema public > src/types/supabase.generated.ts
```

Do not commit service role keys or private Supabase credentials.
