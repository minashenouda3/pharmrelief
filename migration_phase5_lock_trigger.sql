-- Lock shifts in the database rather than from the browser.
--
-- Previously the client updated shifts.status = 'locked' after both parties
-- confirmed. That update is subject to RLS, and the pharmacist does not own
-- the shift row — so when the pharmacist confirmed second, the update was
-- silently rejected while the UI still reported the shift as locked.
--
-- A trigger runs with the table owner's rights, so the lock happens exactly
-- once both flags are true, no matter who confirmed last.
-- Idempotent: safe to re-run.

create or replace function lock_shift_when_both_confirmed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Keep the derived status column honest as well, so reporting built on
  -- it (ops dashboards, fill-rate metrics) cannot drift from the flags.
  new.status := case
    when new.pharmacy_confirmed and new.pharmacist_confirmed then 'both_confirmed'
    when new.pharmacy_confirmed then 'pharmacy_confirmed'
    when new.pharmacist_confirmed then 'pharmacist_confirmed'
    else coalesce(new.status, 'pending')
  end;

  if new.pharmacy_confirmed and new.pharmacist_confirmed then
    -- Only an open shift may lock. A cancelled shift must stay cancelled:
    -- cancelShift() in the client writes 'cancelled', and without this
    -- guard a late confirmation would silently revive it.
    update shifts set status = 'locked'
      where id = new.shift_id and status = 'open';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_lock_shift on shift_applications;

create trigger trg_lock_shift
  before update of pharmacy_confirmed, pharmacist_confirmed
  on shift_applications
  for each row
  execute function lock_shift_when_both_confirmed();

-- Backfill: any application already confirmed by both parties whose shift
-- never locked because of the bug above.
update shifts s
set status = 'locked'
from shift_applications a
where a.shift_id = s.id
  and a.pharmacy_confirmed
  and a.pharmacist_confirmed
  and s.status = 'open';

-- Verify
select
  (select count(*) from pg_trigger where tgname = 'trg_lock_shift') as trigger_installed,
  (select count(*) from shifts where status = 'locked')             as locked_shifts,
  (select count(*) from shift_applications
     where pharmacy_confirmed and pharmacist_confirmed)             as fully_confirmed_apps;
