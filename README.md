# Bank Liquidity Manager

Monorepo skeleton: Vue 3 + Vite + Tailwind/DaisyUI frontend, Express + Drizzle backend, Postgres + Redis via Docker Compose.

## Project scope

Take Home Prompt: You are working with a bank that needs to manage its liquidity. Build a simple full stack application that:
- Pulls data on treasury yields
- Plots the yield curve back to the user
- Allows the user to submit an order for a specific term and amount
- Displays the user's historical order submissions

## Out of scope

1. Token revocation - We are using JWT with no mechanism for revoking tokens
2. Multitenancy - There is just a single user with no associated team
3. Secret management - `JWT_SECRET` is a hardcoded dev placeholder (`server/.env.example`); a real deployment needs a securely generated secret pulled from a proper secret store, not committed to the repo
4. Refresh tokens - the JWT is issued once at login with a fixed 24h expiry; there's no refresh token flow to extend a session without re-authenticating

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
