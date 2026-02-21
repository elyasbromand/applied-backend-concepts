import { verify } from "./jwt.js";
import { findUserById } from "./users.js";

function unauthorizedResponse() {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "content-type": "application/json" },
  });
}

export async function getUserFromRequest(request) {
  const auth = request.headers.get("authorization") || "";
  const m = auth.match(/^Bearer\s+(.+)$/i);
  if (!m) return null;
  const token = m[1];
  try {
    const payload = verify(token);
    if (!payload || !payload.sub) return null;
    const user = await findUserById(payload.sub);
    return user || null;
  } catch (err) {
    return null;
  }
}

// Returns a `Response` to return directly when unauthorized, otherwise returns the user object
export async function requireAuth(request) {
  const user = await getUserFromRequest(request);
  if (!user) return unauthorizedResponse();
  return user;
}
