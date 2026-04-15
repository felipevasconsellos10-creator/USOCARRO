# Controle de carro por KM

Aplicativo web mobile-first para controle de despesas, rateio por quilometragem e inferência automática do uso do Everton entre um uso do Felipe e outro.

## Stack
- Next.js App Router
- TypeScript
- Supabase (Postgres + API + RPC)

## Funcionalidades implementadas
- Cadastro de veículo
- Cadastro de modelos de despesa
- Lançamento financeiro / contas a pagar
- Dashboard por período
- Registro de uso do Felipe
- Fechamento do uso do Felipe
- Inferência automática do uso do Everton
- Relatórios resumidos
- Configurações gerais

## Como configurar
1. Crie um projeto no Supabase.
2. No SQL Editor do Supabase, rode `supabase/schema.sql`.
3. Copie `.env.example` para `.env.local` e preencha as chaves.
4. Execute `npm install`.
5. Rode `npm run dev`.

## Regra principal
- Despesas fixas são atribuídas ao Felipe.
- Despesas variáveis são rateadas por km.
- Quando um novo uso do Felipe é iniciado com km inicial acima do último km final do Felipe, a diferença vira uso inferido do Everton.

## Próximas evoluções possíveis
- autenticação real por login
- edição e exclusão de registros
- exportação em PDF/Excel
- gráficos
- aviso automático de vencimento
- abastecimento com litros reais e preço por litro
