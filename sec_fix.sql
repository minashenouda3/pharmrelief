-- Restrict the OCP verification function to signed-in members.
--
-- Postgres grants EXECUTE on new functions to PUBLIC by default. The
-- original migration revoked that, but anon may still hold execute via
-- Supabase's default grants on the public schema. An anonymous caller
-- cannot read any names — the function returns only matched/active — but
-- there is no reason for a signed-out visitor to be able to probe the
-- register at all. Verification only ever happens from a logged-in profile.
--
-- Idempotent.

revoke execute on function verify_ocp_member(text, text) from public;
revoke execute on function verify_ocp_member(text, text) from anon;
grant  execute on function verify_ocp_member(text, text) to authenticated;

-- Belt and braces: ensure the table itself is not directly selectable.
revoke all on table ocp_register from anon;
revoke all on table ocp_register from authenticated;

select 'anon execute'          as who, has_function_privilege('anon','verify_ocp_member(text,text)','EXECUTE')::text as can, 'expect false' as expected
union all
select 'authenticated execute', has_function_privilege('authenticated','verify_ocp_member(text,text)','EXECUTE')::text, 'expect true'
union all
select 'anon select table',     has_table_privilege('anon','ocp_register','SELECT')::text, 'expect false';
