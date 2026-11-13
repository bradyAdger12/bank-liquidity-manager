# Bank Liquidity Manager

Monorepo skeleton: Vue 3 + Vite + Tailwind/DaisyUI frontend, Express + Drizzle backend, Postgres + Redis via Docker Compose.

## Stack

- `client/` — Vue 3, Vite, TypeScript, Tailwind CSS, DaisyUI, Plotly
- `server/` — Express, TypeScript, Drizzle ORM, postgres (postgres-js), ioredis
- Postgres + Redis — `docker-compose.yml`

## Getting started

```bash
npm install

cp server/.env.example server/.env

npm run db:up        # starts postgres + redis containers
npm run db:generate   # generate drizzle migrations from server/src/db/schema.ts
npm run db:migrate    # apply migrations

npm run dev           # runs server (3001) and client (5173) together
```
