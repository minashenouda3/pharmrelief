-- External shifts: work a pharmacist booked directly or through another
-- agency, recorded here so PharmRelief holds their complete schedule and
-- income record rather than only the shifts it sourced.
--
-- Deliberately a separate table rather than a flag on `shifts`:
--   * `shifts.pharmacy_id` is a foreign key to a real pharmacy account.
--     External work has no account behind it, so reusing that table would
--     mean weakening a constraint that currently prevents fabricated shifts.
--   * External shifts are owned entirely by the pharmacist. One simple RLS
--     rule (pharmacist_id = auth.uid()) covers read and write, with no
--     second party to reconcile.
--   * Hours and payment live on the row itself. There is no counterparty to
--     approve a timesheet, so the shift_worklogs approval flow does not fit.
--
-- Idempotent: safe to re-run.

create table if not exists external_shifts (
  id uuid primary key default gen_random_uuid(),
  pharmacist_id uuid not null references auth.users(id) on delete cascade,

  pharmacy_name text not null,
  source text not null default 'direct'
    check (source in ('direct','agency','locum','other')),
  source_name text,                      -- which agency, when source='agency'

  shift_date date not null,
  start_time time,
  end_time time,
  break_minutes int not null default 0,
  hours_worked numeric(6,2),

  hourly_rate numeric(8,2),
  gross_amount numeric(10,2),

  location text,
  notes text,

  -- The pharmacist tracks payment themselves; there is no approver.
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid','invoiced','paid')),
  paid_at timestamptz,

  created_at timestamptz not null default now()
);

create index if not exists external_shifts_pharmacist_idx
  on external_shifts(pharmacist_id);
create index if not exists external_shifts_date_idx
  on external_shifts(shift_date);

alter table external_shifts enable row level security;

do $$ begin
  -- External shifts are private to the pharmacist who logged them. They are
  -- a personal record, not marketplace data, and may name pharmacies that
  -- are competitors of PharmRelief customers.
  if not exists (select 1 from pg_policies
                 where tablename='external_shifts' and policyname='Own external shifts') then
    create policy "Own external shifts" on external_shifts
      for all using (auth.uid() = pharmacist_id)
      with check (auth.uid() = pharmacist_id);
  end if;
end $$;

-- Verify
select
  (select count(*) from pg_tables where tablename='external_shifts') as table_created,
  (select count(*) from pg_policies where tablename='external_shifts') as policies,
  (select count(*) from external_shifts) as rows;
