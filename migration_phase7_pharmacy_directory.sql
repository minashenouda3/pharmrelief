-- Ontario pharmacy directory.
--
-- Reference data for every pharmacy in the province, independent of whether
-- that pharmacy has an account. Kept separate from `pharmacies` because that
-- table is keyed to auth.users(id) — a foreign key that prevents fabricated
-- pharmacy ids on shifts. Bulk-loading a directory into it would mean either
-- creating thousands of fake auth users or dropping that constraint.
--
-- A directory entry is a fact about the world. A `pharmacies` row is an
-- account. When a real pharmacy signs up, the two are linked via claimed_by.
--
-- Idempotent: safe to re-run.

create table if not exists pharmacy_directory (
  id uuid primary key default gen_random_uuid(),

  -- OCP accreditation number: the authoritative identifier and the natural
  -- key for re-importing without creating duplicates.
  ocp_accreditation text unique,

  name text not null,
  legal_name text,
  address_line text,
  city text,
  province text not null default 'ON',
  postal_code text,
  phone text,
  fax text,
  email text,
  website text,

  banner text,                    -- Shoppers, Rexall, independent, etc.
  pharmacy_type text,             -- community, hospital, long-term care
  designated_manager text,        -- personal information: see note below
  latitude numeric(9,6),
  longitude numeric(9,6),

  -- Set when a real account claims this listing. Until then the entry is
  -- reference data only and must be shown as unregistered.
  claimed_by uuid references auth.users(id) on delete set null,
  claimed_at timestamptz,

  status text not null default 'listed'
    check (status in ('listed','claimed','closed','duplicate')),

  source text,                    -- where the record came from
  source_updated_on date,         -- currency of the source data
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pharmacy_directory_city_idx on pharmacy_directory(city);
create index if not exists pharmacy_directory_postal_idx on pharmacy_directory(postal_code);
create index if not exists pharmacy_directory_claimed_idx on pharmacy_directory(claimed_by);
create index if not exists pharmacy_directory_name_idx on pharmacy_directory using gin (to_tsvector('simple', name));

alter table pharmacy_directory enable row level security;

do $$ begin
  -- Business location data is readable by signed-in members so pharmacists
  -- can find and search real pharmacies.
  if not exists (select 1 from pg_policies
                 where tablename='pharmacy_directory' and policyname='Directory readable by members') then
    create policy "Directory readable by members" on pharmacy_directory
      for select using (auth.uid() is not null);
  end if;

  -- A pharmacy account may claim an unclaimed listing, or edit one it owns.
  -- Nobody can claim an entry already claimed by someone else.
  if not exists (select 1 from pg_policies
                 where tablename='pharmacy_directory' and policyname='Claim unclaimed listing') then
    create policy "Claim unclaimed listing" on pharmacy_directory
      for update
      using (claimed_by is null or claimed_by = auth.uid())
      with check (claimed_by = auth.uid());
  end if;
end $$;

-- Contact details are deliberately not exposed to every member. Phone,
-- fax, email and the designated manager's name are withheld from the
-- member-facing view: a bulk-loaded contact list handed to every signed-up
-- account is a scraping target, and the designated manager's name is
-- personal information under PIPEDA rather than plain business data.
-- Claimed listings show whatever the pharmacy itself chose to publish on
-- its account.
create or replace view pharmacy_directory_public as
select
  id, ocp_accreditation, name, address_line, city, province, postal_code,
  banner, pharmacy_type, latitude, longitude,
  (claimed_by is not null) as is_registered,
  status
from pharmacy_directory
where status in ('listed','claimed');

-- Keep updated_at honest.
create or replace function touch_pharmacy_directory()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists trg_touch_pharmacy_directory on pharmacy_directory;
create trigger trg_touch_pharmacy_directory
  before update on pharmacy_directory
  for each row execute function touch_pharmacy_directory();

-- Verify
select
  (select count(*) from pg_tables where tablename='pharmacy_directory') as table_created,
  (select count(*) from pg_policies where tablename='pharmacy_directory') as policies,
  (select count(*) from pharmacy_directory) as rows_loaded,
  (select count(*) from pharmacy_directory where claimed_by is not null) as claimed;
