# Next.js API Versioning Demo (App Router)

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
