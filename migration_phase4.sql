-- PharmRelief Phase 4 migration
-- Ratings, profile photos, OCP verification, and the hours/payment ledger.
-- Safe to re-run: every statement is guarded.

-- ---------- 1. PROFILE PHOTO + VERIFICATION ----------
alter table pharmacist_profiles add column if not exists avatar_url text;
alter table pharmacist_profiles add column if not exists phone text;
alter table pharmacist_profiles add column if not exists years_experience int;
alter table pharmacist_profiles add column if not exists bio text;

-- Verification is a reviewed state, not a self-declared boolean.
-- unverified -> pending -> verified | rejected
alter table pharmacist_profiles add column if not exists verification_status text
  not null default 'unverified';
alter table pharmacist_profiles add column if not exists verification_note text;
alter table pharmacist_profiles add column if not exists verified_at timestamptz;
alter table pharmacist_profiles add column if not exists legal_name text;

alter table pharmacies add column if not exists avatar_url text;
alter table pharmacies add column if not exists phone text;
alter table pharmacies add column if not exists address text;
alter table pharmacies add column if not exists verification_status text
  not null default 'unverified';

-- ---------- 2. RATINGS ----------
create table if not exists ratings (
  id uuid primary key default gen_random_uuid(),
  shift_id uuid not null references shifts(id) on delete cascade,
  rater_id uuid not null references auth.users(id) on delete cascade,
  ratee_id uuid not null references auth.users(id) on delete cascade,
  rater_role text not null check (rater_role in ('pharmacy','agency','pharmacist')),
  score int not null check (score between 1 and 5),
  reliability int check (reliability between 1 and 5),
  professionalism int check (professionalism between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  -- one rating per person per shift
  unique (shift_id, rater_id)
);

create index if not exists ratings_ratee_idx on ratings(ratee_id);
create index if not exists ratings_shift_idx on ratings(shift_id);

alter table ratings enable row level security;

do $$ begin
  -- Ratings are visible to everyone: that is the point of a reputation system.
  if not exists (select 1 from pg_policies where tablename='ratings' and policyname='Ratings readable') then
    create policy "Ratings readable" on ratings for select using (true);
  end if;
  -- You may only write a rating as yourself, and never rate yourself.
  if not exists (select 1 from pg_policies where tablename='ratings' and policyname='Own rating insert') then
    create policy "Own rating insert" on ratings for insert
      with check (auth.uid() = rater_id and auth.uid() <> ratee_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='ratings' and policyname='Own rating update') then
    create policy "Own rating update" on ratings for update using (auth.uid() = rater_id);
  end if;
end $$;

-- ---------- 3. WORK LOG / PAYMENT LEDGER ----------
-- Records hours worked and what is owed. Does NOT move money; payment
-- status is recorded once settlement happens outside the platform.
create table if not exists shift_worklogs (
  id uuid primary key default gen_random_uuid(),
  shift_id uuid not null references shifts(id) on delete cascade unique,
  pharmacist_id uuid not null references auth.users(id) on delete cascade,
  pharmacy_id uuid not null references auth.users(id) on delete cascade,

  clock_in timestamptz,
  clock_out timestamptz,
  break_minutes int not null default 0,

  hours_worked numeric(6,2),
  hourly_rate numeric(8,2),
  gross_amount numeric(10,2),

  -- submitted -> approved -> paid, or disputed at any point
  status text not null default 'draft'
    check (status in ('draft','submitted','approved','disputed','paid')),
  submitted_at timestamptz,
  approved_at timestamptz,
  approved_by uuid references auth.users(id),
  paid_at timestamptz,
  payment_method text,
  payment_reference text,
  dispute_reason text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists worklogs_pharmacist_idx on shift_worklogs(pharmacist_id);
create index if not exists worklogs_pharmacy_idx on shift_worklogs(pharmacy_id);
create index if not exists worklogs_status_idx on shift_worklogs(status);

alter table shift_worklogs enable row level security;

do $$ begin
  -- Only the two parties to the shift can see its financial record.
  if not exists (select 1 from pg_policies where tablename='shift_worklogs' and policyname='Worklog parties read') then
    create policy "Worklog parties read" on shift_worklogs for select
      using (auth.uid() = pharmacist_id or auth.uid() = pharmacy_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='shift_worklogs' and policyname='Pharmacist creates worklog') then
    create policy "Pharmacist creates worklog" on shift_worklogs for insert
      with check (auth.uid() = pharmacist_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='shift_worklogs' and policyname='Worklog parties update') then
    create policy "Worklog parties update" on shift_worklogs for update
      using (auth.uid() = pharmacist_id or auth.uid() = pharmacy_id);
  end if;
end $$;

-- ---------- 4. AGGREGATE RATING VIEW ----------
-- Reading averages from a view keeps the number honest: it cannot drift
-- out of sync the way a cached column on the profile would.
create or replace view rating_summary as
select
  ratee_id,
  count(*)::int                        as rating_count,
  round(avg(score)::numeric, 2)        as avg_score,
  round(avg(reliability)::numeric, 2)  as avg_reliability,
  round(avg(professionalism)::numeric, 2) as avg_professionalism
from ratings
group by ratee_id;

-- ---------- 5. STORAGE BUCKET FOR AVATARS ----------
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

do $$ begin
  if not exists (select 1 from pg_policies where tablename='objects' and policyname='Avatar images are public') then
    create policy "Avatar images are public" on storage.objects for select
      using (bucket_id = 'avatars');
  end if;
  -- Users may only write into a folder named after their own uid.
  if not exists (select 1 from pg_policies where tablename='objects' and policyname='Own avatar upload') then
    create policy "Own avatar upload" on storage.objects for insert
      with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
  end if;
  if not exists (select 1 from pg_policies where tablename='objects' and policyname='Own avatar update') then
    create policy "Own avatar update" on storage.objects for update
      using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
  end if;
  if not exists (select 1 from pg_policies where tablename='objects' and policyname='Own avatar delete') then
    create policy "Own avatar delete" on storage.objects for delete
      using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
  end if;
end $$;

-- ---------- VERIFY ----------
select 'ratings' as object, count(*)::text as detail from ratings
union all select 'worklogs', count(*)::text from shift_worklogs
union all select 'rating_summary view', 'created'
union all select 'avatars bucket',
  coalesce((select id from storage.buckets where id='avatars'), 'MISSING');
