-- ══════════════════════════════════════════════════════════════════════════════
-- Pillar — Waitlist & Analytics Schema
-- Run this in Supabase Dashboard → SQL Editor → New Query → Run
-- ══════════════════════════════════════════════════════════════════════════════

-- 1. Waitlist signups
create table waitlist (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  source text not null default 'landing',  -- 'landing' or 'demo'
  referrer text,
  created_at timestamptz default now()
);

-- 2. Analytics events
create table events (
  id uuid default gen_random_uuid() primary key,
  type text not null,        -- 'page_view', 'demo_start', 'demo_end', 'waitlist_signup'
  page text,                 -- '/', '/demo'
  session_id text not null,  -- random per-session ID
  duration_ms integer,       -- session duration (for demo_end events)
  referrer text,
  user_agent text,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- 3. Indexes for fast analytics queries
create index idx_waitlist_created on waitlist (created_at desc);
create index idx_events_type on events (type, created_at desc);
create index idx_events_session on events (session_id);

-- 4. Row Level Security — allow anonymous inserts only
alter table waitlist enable row level security;
create policy "anon_insert_waitlist" on waitlist
  for insert to anon with check (true);

alter table events enable row level security;
create policy "anon_insert_events" on events
  for insert to anon with check (true);

-- 5. Convenience views for the pitch deck metrics
create or replace view waitlist_stats as
select
  count(*) as total_signups,
  count(*) filter (where source = 'landing') as from_landing,
  count(*) filter (where source = 'demo') as from_demo,
  min(created_at) as first_signup,
  max(created_at) as last_signup
from waitlist;

create or replace view demo_stats as
select
  count(*) filter (where type = 'demo_start') as total_sessions,
  round(avg(duration_ms) filter (where type = 'demo_end') / 1000.0, 1) as avg_duration_seconds,
  round(avg(duration_ms) filter (where type = 'demo_end') / 60000.0, 1) as avg_duration_minutes
from events;

-- Grant read access on views (for dashboard queries via service key)
grant select on waitlist_stats to authenticated;
grant select on demo_stats to authenticated;
