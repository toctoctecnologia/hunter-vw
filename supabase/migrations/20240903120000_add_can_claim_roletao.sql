-- Migration: add can_claim_roletao flag and health snapshot metadata
-- This migration prepares the users table to persist distribution flags and health snapshots
-- used by the health service.

alter table if exists public.users
  add column if not exists can_claim_roletao boolean not null default false;

alter table if exists public.users
  add column if not exists can_receive_new_leads boolean not null default true;

alter table if exists public.users
  add column if not exists health_snapshot jsonb;

alter table if exists public.users
  add column if not exists health_snapshot_updated_at timestamptz;

comment on column public.users.can_claim_roletao is 'Define se o usuário pode reivindicar leads na distribuição automática (roletão).';
comment on column public.users.can_receive_new_leads is 'Flag que indica se o usuário continua elegível para receber novos leads.';
comment on column public.users.health_snapshot is 'Último snapshot consolidado da saúde operacional do usuário (JSON).';
comment on column public.users.health_snapshot_updated_at is 'Timestamp do último recálculo do snapshot de saúde.';
