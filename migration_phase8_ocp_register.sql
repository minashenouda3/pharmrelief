-- OCP member register — verification reference only.
--
-- This table holds personal information about ~29,000 identifiable people
-- who never signed up for PharmRelief. It is deliberately NOT a directory.
--
-- PIPEDA permits using a public registry without consent only where the use
-- relates directly to the purpose the registry serves. The OCP register
-- exists so that anyone can verify a member's licence. Checking a signup
-- against it is squarely within that purpose. Letting members browse,
-- search or export 21,000 names is not, and would also hand every
-- signed-up account a recruitment list.
--
-- So: no member-facing select policy at all. The only access is through
-- verify_ocp_member(), a security-definer function that answers a yes/no
-- question about a number the caller already claims to hold. It cannot be
-- used to enumerate the register — it requires the surname as well as the
-- number, and returns no names.
--
-- Idempotent: safe to re-run.

create table if not exists ocp_register (
  member_number text primary key,
  last_name text,
  first_name text,
  preferred_name text,
  member_type text,          -- Pharmacist, Pharmacy Technician, Intern, Intern Technician
  member_status text,        -- Active, Resigned, Revoked, Deceased, ...
  injection_training boolean,
  source_updated_on date default current_date,
  created_at timestamptz not null default now()
);

create index if not exists ocp_register_lastname_idx
  on ocp_register (lower(last_name));
create index if not exists ocp_register_status_idx
  on ocp_register (member_status);

alter table ocp_register enable row level security;

-- No policies are created. With RLS enabled and no policy, the table is
-- unreadable through the API by any client, including authenticated ones.
-- Access happens only through the function below, which runs as the owner.

create or replace function verify_ocp_member(
  p_member_number text,
  p_last_name text
)
returns table (
  matched boolean,
  is_active boolean,
  member_type text,
  injection_training boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  rec ocp_register%rowtype;
begin
  -- Requires both the number and the surname, so the function cannot be
  -- walked to enumerate the register. Returns no names under any branch.
  select * into rec
  from ocp_register
  where member_number = trim(p_member_number)
    and lower(trim(last_name)) = lower(trim(p_last_name));

  if not found then
    return query select false, false, null::text, null::boolean;
    return;
  end if;

  return query select
    true,
    rec.member_status = 'Active',
    rec.member_type,
    rec.injection_training;
end;
$$;

revoke all on function verify_ocp_member(text, text) from public;
grant execute on function verify_ocp_member(text, text) to authenticated;

-- Verify
select
  (select count(*) from pg_tables where tablename='ocp_register') as table_created,
  (select count(*) from pg_policies where tablename='ocp_register') as policies_should_be_zero,
  (select count(*) from ocp_register) as rows_loaded;
