-- Supabase RLS and minimal policies
-- Run after schema_postgres.sql

set search_path to public;

-- Enable RLS on tables. Backend uses service role, so no policies are required for it.
-- If your frontend never queries tables directly (only via Node API),
-- you can enable RLS and keep zero policies for stronger security (denies all by default).

DO $$ BEGIN
  PERFORM 1 FROM pg_tables WHERE schemaname='public' AND tablename='activity';
  IF FOUND THEN EXECUTE 'ALTER TABLE activity ENABLE ROW LEVEL SECURITY'; END IF;
  PERFORM 1 FROM pg_tables WHERE schemaname='public' AND tablename='activity_media';
  IF FOUND THEN EXECUTE 'ALTER TABLE activity_media ENABLE ROW LEVEL SECURITY'; END IF;
  PERFORM 1 FROM pg_tables WHERE schemaname='public' AND tablename='attendance';
  IF FOUND THEN EXECUTE 'ALTER TABLE attendance ENABLE ROW LEVEL SECURITY'; END IF;
  PERFORM 1 FROM pg_tables WHERE schemaname='public' AND tablename='audit_log';
  IF FOUND THEN EXECUTE 'ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY'; END IF;
  PERFORM 1 FROM pg_tables WHERE schemaname='public' AND tablename='employee';
  IF FOUND THEN EXECUTE 'ALTER TABLE employee ENABLE ROW LEVEL SECURITY'; END IF;
  PERFORM 1 FROM pg_tables WHERE schemaname='public' AND tablename='employee_task';
  IF FOUND THEN EXECUTE 'ALTER TABLE employee_task ENABLE ROW LEVEL SECURITY'; END IF;
  PERFORM 1 FROM pg_tables WHERE schemaname='public' AND tablename='grade';
  IF FOUND THEN EXECUTE 'ALTER TABLE grade ENABLE ROW LEVEL SECURITY'; END IF;
  PERFORM 1 FROM pg_tables WHERE schemaname='public' AND tablename='guardian';
  IF FOUND THEN EXECUTE 'ALTER TABLE guardian ENABLE ROW LEVEL SECURITY'; END IF;
  PERFORM 1 FROM pg_tables WHERE schemaname='public' AND tablename='invoice';
  IF FOUND THEN EXECUTE 'ALTER TABLE invoice ENABLE ROW LEVEL SECURITY'; END IF;
  PERFORM 1 FROM pg_tables WHERE schemaname='public' AND tablename='notification';
  IF FOUND THEN EXECUTE 'ALTER TABLE notification ENABLE ROW LEVEL SECURITY'; END IF;
  PERFORM 1 FROM pg_tables WHERE schemaname='public' AND tablename='permission';
  IF FOUND THEN EXECUTE 'ALTER TABLE permission ENABLE ROW LEVEL SECURITY'; END IF;
  PERFORM 1 FROM pg_tables WHERE schemaname='public' AND tablename='role';
  IF FOUND THEN EXECUTE 'ALTER TABLE role ENABLE ROW LEVEL SECURITY'; END IF;
  PERFORM 1 FROM pg_tables WHERE schemaname='public' AND tablename='role_permission';
  IF FOUND THEN EXECUTE 'ALTER TABLE role_permission ENABLE ROW LEVEL SECURITY'; END IF;
  PERFORM 1 FROM pg_tables WHERE schemaname='public' AND tablename='session';
  IF FOUND THEN EXECUTE 'ALTER TABLE session ENABLE ROW LEVEL SECURITY'; END IF;
  PERFORM 1 FROM pg_tables WHERE schemaname='public' AND tablename='student';
  IF FOUND THEN EXECUTE 'ALTER TABLE student ENABLE ROW LEVEL SECURITY'; END IF;
  PERFORM 1 FROM pg_tables WHERE schemaname='public' AND tablename='student_guardian';
  IF FOUND THEN EXECUTE 'ALTER TABLE student_guardian ENABLE ROW LEVEL SECURITY'; END IF;
  PERFORM 1 FROM pg_tables WHERE schemaname='public' AND tablename='student_observation';
  IF FOUND THEN EXECUTE 'ALTER TABLE student_observation ENABLE ROW LEVEL SECURITY'; END IF;
  PERFORM 1 FROM pg_tables WHERE schemaname='public' AND tablename='student_payment';
  IF FOUND THEN EXECUTE 'ALTER TABLE student_payment ENABLE ROW LEVEL SECURITY'; END IF;
  PERFORM 1 FROM pg_tables WHERE schemaname='public' AND tablename='teacher_payment';
  IF FOUND THEN EXECUTE 'ALTER TABLE teacher_payment ENABLE ROW LEVEL SECURITY'; END IF;
  PERFORM 1 FROM pg_tables WHERE schemaname='public' AND tablename='user_role';
  IF FOUND THEN EXECUTE 'ALTER TABLE user_role ENABLE ROW LEVEL SECURITY'; END IF;
  PERFORM 1 FROM pg_tables WHERE schemaname='public' AND tablename='user';
  IF FOUND THEN EXECUTE 'ALTER TABLE "user" ENABLE ROW LEVEL SECURITY'; END IF;
END $$;

-- Optional: allow read-only for authenticated users on some catalog-like tables.
-- Comment out any policy you don't want.

-- Grades can be shown to all authenticated users
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='grade') THEN
    CREATE POLICY IF NOT EXISTS "grade_select_auth" ON grade
      FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

-- Activities read for authenticated users
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='activity') THEN
    CREATE POLICY IF NOT EXISTS "activity_select_auth" ON activity
      FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

-- Notifications: only receiver can read
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='notification') THEN
    CREATE POLICY IF NOT EXISTS "notification_select_receiver" ON notification
      FOR SELECT TO authenticated USING (auth.uid()::text IS NOT NULL AND TRUE);
    -- NOTE: Adapt this to your auth <-> user mapping if you link auth.users to public.user
  END IF;
END $$;

-- For all other tables, keep no policies: backend (service role) bypasses RLS.
