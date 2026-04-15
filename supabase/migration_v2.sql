create extension if not exists pgcrypto;

do $$ begin
  create type forma_pagamento as enum ('A_VISTA','CARTAO','BOLETO','PIX','TRANSFERENCIA');
exception when duplicate_object then null; end $$;

do $$ begin
  create type tipo_recorrencia as enum ('SEM_RECORRENCIA','SEMANAL','QUINZENAL','MENSAL','ANUAL');
exception when duplicate_object then null; end $$;

create table if not exists categorias_despesa (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

insert into categorias_despesa (nome)
select categoria from (values ('FINANCIAMENTO'),('IPVA'),('LICENCIAMENTO'),('SEGURO'),('MANUTENCAO'),('OLEO'),('PNEU'),('COMBUSTIVEL'),('LAVAGEM'),('OUTROS')) as t(categoria)
on conflict (nome) do nothing;

alter table modelos_despesa add column if not exists categoria_id uuid references categorias_despesa(id) on delete set null;
alter table modelos_despesa add column if not exists tipo_recorrencia tipo_recorrencia not null default 'SEM_RECORRENCIA';
alter table modelos_despesa add column if not exists dia_recorrencia integer;
alter table modelos_despesa add column if not exists quantidade_parcelas integer;

alter table despesas add column if not exists categoria_id uuid references categorias_despesa(id) on delete set null;
alter table despesas add column if not exists forma_pagamento forma_pagamento not null default 'A_VISTA';
alter table despesas add column if not exists cartao_titular text;
alter table despesas add column if not exists recorrente boolean not null default false;
alter table despesas add column if not exists tipo_recorrencia tipo_recorrencia not null default 'SEM_RECORRENCIA';
alter table despesas add column if not exists dia_recorrencia integer;
alter table despesas add column if not exists quantidade_parcelas integer;
alter table despesas add column if not exists parcela_atual integer;

alter table modelos_despesa alter column categoria type text using categoria::text;
alter table despesas alter column categoria type text using categoria::text;

update modelos_despesa md set categoria_id = cd.id from categorias_despesa cd where md.categoria = cd.nome and md.categoria_id is null;
update despesas d set categoria_id = cd.id from categorias_despesa cd where d.categoria = cd.nome and d.categoria_id is null;
