-- KPIs resumidos do imóvel
-- Parâmetros: $1 = property_id, $2 = data_inicial (opcional), $3 = data_final (opcional)
with params as (
  select
    $1::bigint as property_id,
    coalesce($2::timestamptz, timezone('UTC', date_trunc('day', now()) - interval '90 days')) as start_at,
    coalesce($3::timestamptz, timezone('UTC', now())) as end_at
), interessados as (
  select property_id, count(*) as total
  from crm_leads
  where property_id = (select property_id from params)
    and created_at between (select start_at from params) and (select end_at from params)
  group by property_id
), visitas as (
  select property_id, count(*) as total
  from crm_visits
  where property_id = (select property_id from params)
    and scheduled_at between (select start_at from params) and (select end_at from params)
  group by property_id
), propostas as (
  select property_id, count(*) as total, count(*) filter (where status = 'accepted') as accepted
  from crm_proposals
  where property_id = (select property_id from params)
    and created_at between (select start_at from params) and (select end_at from params)
  group by property_id
), negocios as (
  select property_id, count(*) as total, sum(amount) as total_amount
  from crm_deals
  where property_id = (select property_id from params)
    and closed_at between (select start_at from params) and (select end_at from params)
  group by property_id
)
select
  coalesce(interessados.total, 0) as total_interessados,
  coalesce(visitas.total, 0) as total_visitas,
  coalesce(propostas.total, 0) as total_propostas,
  coalesce(negocios.total, 0) as total_negocios,
  coalesce(negocios.total_amount, 0) as ticket_total,
  case when coalesce(interessados.total, 0) > 0 then round(100.0 * coalesce(visitas.total, 0) / interessados.total, 2) end as taxa_visitas,
  case when coalesce(visitas.total, 0) > 0 then round(100.0 * coalesce(propostas.total, 0) / visitas.total, 2) end as taxa_propostas,
  case when coalesce(propostas.total, 0) > 0 then round(100.0 * coalesce(negocios.total, 0) / propostas.total, 2) end as taxa_fechamento
from params
left join interessados using (property_id)
left join visitas using (property_id)
left join propostas using (property_id)
left join negocios using (property_id);

-- Linha do tempo unificada
-- Parâmetros: $1 = property_id, $2 = limite (default 50), $3 = offset (default 0)
with eventos as (
  select id as entity_id,
         property_id,
         created_at as occurred_at,
         'lead'::text as event_type,
         nome as title,
         origem as description,
         created_by as actor
  from crm_leads
  where property_id = $1

  union all

  select id,
         property_id,
         scheduled_at,
         'visit'::text,
         concat('Visita com ', visitor_name),
         status,
         broker_name
  from crm_visits
  where property_id = $1

  union all

  select id,
         property_id,
         created_at,
         'proposal'::text,
         concat('Proposta ', status),
         concat('Valor ', to_char(amount, 'L9G999G999D99')),
         broker_name
  from crm_proposals
  where property_id = $1

  union all

  select id,
         property_id,
         closed_at,
         'deal'::text,
         concat('Negócio ', status),
         concat('Valor ', to_char(amount, 'L9G999G999D99')),
         broker_name
  from crm_deals
  where property_id = $1
)
select *
from eventos
where occurred_at is not null
order by occurred_at desc
limit coalesce($2::int, 50)
offset coalesce($3::int, 0);

-- Interessados (com paginação)
-- Parâmetros: $1 = property_id, $2 = limite, $3 = offset
select
  id,
  nome,
  email,
  telefone,
  status,
  created_at,
  lead_id
from crm_leads
where property_id = $1
order by created_at desc
limit coalesce($2::int, 50)
offset coalesce($3::int, 0);

-- Visitas
select
  id,
  visitor_name,
  broker_name,
  scheduled_at,
  status,
  lead_id
from crm_visits
where property_id = $1
order by scheduled_at desc
limit coalesce($2::int, 50)
offset coalesce($3::int, 0);

-- Carrinho / oportunidades em negociação
select
  id,
  buyer_name,
  broker_name,
  stage,
  created_at,
  lead_id
from crm_cart
where property_id = $1
order by created_at desc
limit coalesce($2::int, 50)
offset coalesce($3::int, 0);

-- Propostas
select
  id,
  buyer_name,
  broker_name,
  amount,
  status,
  created_at,
  lead_id
from crm_proposals
where property_id = $1
order by created_at desc
limit coalesce($2::int, 50)
offset coalesce($3::int, 0);

-- Negócios
select
  id,
  buyer_name,
  broker_name,
  amount,
  status,
  closed_at,
  lead_id
from crm_deals
where property_id = $1
order by closed_at desc nulls last
limit coalesce($2::int, 50)
offset coalesce($3::int, 0);

-- Espelho de portais
select
  portal,
  status,
  last_synced_at,
  portal_url,
  notes
from property_portal_status
where property_id = $1
order by portal;
