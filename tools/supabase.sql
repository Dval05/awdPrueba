-- Example table for students
create table if not exists public.students (
  id bigserial primary key,
  first_name text not null,
  last_name text not null,
  email text unique
);

-- Example RLS policy if using Supabase Row Level Security
alter table public.students enable row level security;

create policy "Allow read for authenticated" on public.students
for select using (
  auth.role() = 'authenticated'
);

create policy "Allow insert for authenticated" on public.students
for insert with check (
  auth.role() = 'authenticated'
);
