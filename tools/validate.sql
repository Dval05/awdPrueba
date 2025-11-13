-- Quick validation after running schema and policies
set search_path to public;

-- Types
SELECT 'enum_types', array_agg(typname ORDER BY typname) FROM pg_type WHERE typname IN (
  'activity_status','media_type','attendance_status','task_status','task_priority','invoice_type','invoice_status',
  'notification_type','notification_priority','gender_type','service_type','student_payment_method','student_payment_status',
  'teacher_payment_method','teacher_payment_status'
);

-- Tables count
SELECT 'tables_count', COUNT(*) FROM information_schema.tables WHERE table_schema='public';

-- Constraints (FKs)
SELECT 'fk_constraints', array_agg(conname ORDER BY conname)
FROM pg_constraint c JOIN pg_class t ON t.oid=c.conrelid
WHERE c.contype='f' AND t.relnamespace = 'public'::regnamespace;

-- Triggers
SELECT 'triggers', array_agg(tgname ORDER BY tgname) FROM pg_trigger WHERE NOT tgisinternal;

-- RLS status
SELECT 'rls', relname, relrowsecurity FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
WHERE n.nspname='public' AND relkind='r' ORDER BY relname;

-- Seed data sanity
SELECT 'users', COUNT(*) FROM "user";
SELECT 'grades', COUNT(*) FROM grade;
SELECT 'students', COUNT(*) FROM student;
SELECT 'activities', COUNT(*) FROM activity;

-- Sequences alignment check (example)
SELECT 'student_seq', (SELECT MAX("StudentID") FROM student) AS max_id,
       currval(pg_get_serial_sequence('student','StudentID')) AS seq_curr
  FROM generate_series(1,1);
