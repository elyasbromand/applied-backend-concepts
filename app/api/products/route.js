import {
  getProductsForVersion,
  normalizeVersion,
} from "../../../lib/products.js";
import { requireAuth } from "../../../lib/auth.js";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const qVersion = url.searchParams.get("version");
    const headerVersion = request.headers.get("versioning-version");

    let strategy;
    let normalized;

    if (qVersion !== null) {
      strategy = "Query";
      normalized = normalizeVersion(qVersion);
    } else if (headerVersion !== null) {
      strategy = "Header";
      normalized = normalizeVersion(headerVersion);
    } else {
      // default behavior: Query strategy defaulting to v1
      strategy = "Query";
      normalized = normalizeVersion("1");
    }

    // protect route
    const auth = await requireAuth(request);
    if (auth instanceof Response) return auth;

    // normalizeVersion returns 'v1' or 'v2'
    const data = getProductsForVersion(normalized);

    const body = {
      version: normalized,
      strategy,
      message: `Products API version ${normalized} (resolved via ${strategy})`,
      data,
    };

    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    // Invalid version values should return HTTP 400
    const status = /invalid version/i.test(err.message) ? 400 : 500;
    return new Response(JSON.stringify({ error: err.message }), {
      status,
      headers: { "content-type": "application/json" },
    });
  }
}
