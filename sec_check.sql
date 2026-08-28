-- Security posture check for ocp_register and the verification function.
-- Run in the Supabase SQL editor. All five rows should read as noted.

select 'RLS enabled on ocp_register' as check,
       relrowsecurity::text as value,
       'expect: true' as expected
  from pg_class where relname = 'ocp_register'

union all
select 'policies on ocp_register',
       count(*)::text,
       'expect: 0 (no policy + RLS = unreadable via API)'
  from pg_policies where tablename = 'ocp_register'

union all
select 'anon can SELECT the table',
       has_table_privilege('anon','ocp_register','SELECT')::text,
       'expect: false'

union all
select 'anon can EXECUTE verify fn',
       has_function_privilege('anon','verify_ocp_member(text,text)','EXECUTE')::text,
       'expect: false'

union all
select 'authenticated can EXECUTE verify fn',
       has_function_privilege('authenticated','verify_ocp_member(text,text)','EXECUTE')::text,
       'expect: true';
