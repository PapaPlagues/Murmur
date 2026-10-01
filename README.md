# Murmur

Murmur is a private, one-to-one messaging app built with React, Vite, Express, and PostgreSQL.

## Local setup

1. Install dependencies in `client` and `server` with `npm install`.
2. Configure `server/.env` with `DATABASE_URL`, `TEST_DATABASE_URL`, `JWT_SECRET`, `DEV_FRONTEND_URL`, and Cloudinary credentials. Set `PROD_FRONTEND_URL` to the deployed frontend origin for production.
3. Configure `client/.env` with `VITE_API_URL` set to the API origin. See `client/.env.example` for the local development value.
4. Run `npm run dev` from `server`, then run `npm run dev` from `client`.

## Production setup

Set `VITE_API_URL` in the frontend build environment to the deployed API origin. Configure `PROD_FRONTEND_URL` in the server environment to the deployed frontend URL (for example, `https://murmur.example`); the server normalizes it to its origin for CORS checks. Also configure `DATABASE_URL`, `JWT_SECRET`, and Cloudinary credentials in the server environment. Do not commit `.env` files or put secrets in `VITE_*` variables. `TEST_DATABASE_URL` is only needed for server tests.

Build the frontend with `npm run build` from `client`. Apply Prisma migrations to the production database with `npm run prisma:migrate:deploy` from `server` before starting the server. This runs `prisma migrate deploy`; do not use the development-only `prisma:migrate` command against production.
