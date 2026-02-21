import { getProductsForVersion } from "../../../../lib/products.js";
import { requireAuth } from "../../../../lib/auth.js";

export async function GET(request) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof Response) return auth;

    const data = getProductsForVersion("v2");
    const body = {
      version: "v2",
      strategy: "URL",
      message: "Products API version v2",
      data,
    };
    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
