# Next.js API Versioning and JWT Demo (App Router)

This repository demonstrates three API versioning strategies using Next.js App Router route handlers (JavaScript):

- URL Versioning
- Query-string Versioning
- Header Versioning

Folder structure

- app/api/v1/products/route.js — URL versioning (v1)
- app/api/v2/products/route.js — URL versioning (v2)
- app/api/products/route.js — Query + Header versioning example
- lib/products.js — Shared product service (business logic)

Notes & usage

- Start dev server:

```bash
npm install
npm run dev
```

- URL versioning examples:
  - GET /api/v1/products
  - GET /api/v2/products

- Query versioning examples:
  - GET /api/products?version=1
  - GET /api/products?version=2
  - If `version` missing, defaults to `v1` (Query strategy)

- Header versioning examples:
  - GET /api/products with header `x-api-version: 2`
  - If header missing and no query param, defaults to `v1` (Query default)

Design notes

- Business logic (product shaping) lives in `lib/products.js` and is reused by all route handlers.
- URL versioning exposes entirely separate routes and is appropriate when different versions are large and backward-incompatible.
- Query and Header strategies are demonstrated on the same endpoint; the code shows a simple precedence: query param wins over header.
- Invalid version values return HTTP 400 with a JSON error.

When to use each strategy (brief):

- URL Versioning: Use when major, breaking changes require clear separation and you want explicit documentation and routing (e.g., v1 and v2 evolve separately). It's clear for caching, routing, and public docs.

- Query String Versioning: Useful for lightweight, ad-hoc version negotiation and for clients that cannot set headers easily (e.g., certain browsers or simple links). Less explicit than URL versioning and can complicate caching.

- Header Versioning: Good for keeping clean URLs and for supporting clients that can set headers. Best suited for API consumers (not browsers) and when you want to keep the resource namespace stable. It can be harder to test directly from browsers and to cache in CDNs unless configured.

Extending to v3

- Add `app/api/v3/products/route.js` and update `lib/products.js` to support `v3` shaping.

Authentication (JWT)

This project now includes simple JWT-based authentication for the API routes.

- Environment: set `DATABASE_URL`, `JWT_SECRET`, and `JWT_EXPIRES_IN` in the project root `.env` (a placeholder `.env` is included).
- Database: create a `users` table in your MySQL database (example SQL below).
- Endpoints:
  - `POST /api/auth/register` — register a new user. Returns JSON `{ token, user }`.
  - `POST /api/auth/login` — login with email/password. Returns JSON `{ token, user }`.
  - Protected routes: `GET /api/products`, `GET /api/v1/products`, and `GET /api/v2/products` require the header `Authorization: Bearer <token>`.

Example SQL to create the `users` table (run in your MySQL/XAMPP DB):

```sql
CREATE TABLE users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) DEFAULT NULL,
  refresh_token VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

Install runtime dependencies:

```bash
npm install jsonwebtoken bcryptjs mysql2
```

Quick usage examples (curl):

Register a user and receive a token:

```bash
curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"secret","name":"Alice"}'
```

Login and receive a token:

```bash
curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"secret"}'
```

Call a protected endpoint using the returned token:

```bash
curl -s -H "Authorization: Bearer <token>" http://localhost:3000/api/v1/products
```

Notes & next steps

- Current behavior: tokens are returned in JSON for simplicity. In a production-ready setup we recommend issuing tokens as Secure, HttpOnly cookies and adding refresh-token rotation.
- You can also add an `app/middleware.js` to protect route patterns globally instead of calling the auth helper in each route.
- Consider using an ORM (Prisma) or adding stricter validation and rate-limiting for production.
