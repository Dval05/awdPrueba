-- Minimal schema to support dashboard endpoints
-- Employees
create table if not exists public.employees (
  id bigserial primary key,
  first_name text,
  last_name text,
  role text
);

-- Attendance
create table if not exists public.attendance (
  id bigserial primary key,
  student_id bigint,
  date date not null,
  status text check (status in ('Present','Absent','Late','Excused'))
);

-- Activities
create table if not exists public.activities (
  id bigserial primary key,
  name text not null,
  category text,
  scheduled_date date,
  status text
);

-- Invoices
create table if not exists public.invoices (
  id bigserial primary key,
  student_id bigint references students(id) on delete set null,
  total_amount numeric(12,2) not null default 0,
  due_date date,
  status text check (status in ('Pending','Paid','Cancelled'))
);

-- Payments
create table if not exists public.payments (
  id bigserial primary key,
  invoice_id bigint references invoices(id) on delete cascade,
  amount numeric(12,2) not null,
  paid_at timestamptz default now()
);
