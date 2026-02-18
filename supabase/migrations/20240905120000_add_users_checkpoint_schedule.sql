-- Migration: add checkpoint scheduling and suspension columns to users
-- These fields allow the operational health service to persist scheduling metadata
-- and temporary suspensions for lead distribution and roletão participation.

alter table if exists public.users
  add column if not exists next_checkpoint_at timestamptz;

alter table if exists public.users
  add column if not exists suspend_leads_until timestamptz;

alter table if exists public.users
  add column if not exists suspend_roletao_until timestamptz;

create index if not exists users_next_checkpoint_at_idx
  on public.users (next_checkpoint_at);

create index if not exists users_suspend_leads_until_idx
  on public.users (suspend_leads_until);

create index if not exists users_suspend_roletao_until_idx
  on public.users (suspend_roletao_until);
