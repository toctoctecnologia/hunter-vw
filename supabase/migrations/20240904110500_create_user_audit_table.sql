-- Migration: create user audit trail table
-- This migration ensures the user audit trail is versioned separately from feature flags
-- so deployments can track audit schema changes independently.

set check_function_bodies = off;

create extension if not exists "pgcrypto";

create table if not exists public.user_audit (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  actor_id uuid,
  action text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists user_audit_user_id_idx on public.user_audit (user_id);
create index if not exists user_audit_created_at_idx on public.user_audit (created_at desc);

comment on table public.user_audit is 'Auditoria de eventos relevantes do usuário, incluindo recálculos de saúde e mudanças de status.';
comment on column public.user_audit.metadata is 'JSON com dados adicionais enviados junto ao evento de auditoria.';
