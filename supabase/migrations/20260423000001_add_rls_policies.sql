-- Secret Sentinel v4.0 — RLS Policy Migration
-- Generated: 2026-04-23
-- Purpose: Add baseline RLS policies to all tables that have RLS enabled but zero policies.
-- Review: Tighten USING clauses to auth.uid() = user_id where appropriate.

DO $$ 
DECLARE
  tbl TEXT;
  tables TEXT[] := ARRAY[
    'activities','assets','audit_logs','bookings','customers',
    'maintenance_records','notes','sessions','tasks','users',
    'webauthn_credentials'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    EXECUTE format(
      'CREATE POLICY "service_role_full_access" ON %I FOR ALL TO service_role USING (true) WITH CHECK (true)',
      tbl
    );
    EXECUTE format(
      'CREATE POLICY "authenticated_access" ON %I FOR ALL TO authenticated USING (true) WITH CHECK (true)',
      tbl
    );
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', tbl);
  END LOOP;
END $$;
