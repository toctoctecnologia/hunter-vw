-- Migration: add auto enforcement flags to users
-- These columns persist whether the automations should enforce eligibility for leads
-- and roletão participation by default in the operational health service.

alter table if exists public.users
  add column if not exists auto_enforce_health_leads boolean not null default true;

alter table if exists public.users
  add column if not exists auto_enforce_roletao boolean not null default true;

comment on column public.users.auto_enforce_health_leads is 'Define se a automação pode reativar automaticamente o recebimento de leads com base na saúde.';
comment on column public.users.auto_enforce_roletao is 'Define se a automação pode reativar automaticamente a participação no roletão conforme indicadores.';
