import { clearRefreshToken } from "../../../../lib/users.js";

function parseCookies(cookieHeader) {
  const map = {};
  if (!cookieHeader) return map;
  cookieHeader.split(";").forEach((part) => {
    const [k, ...v] = part.split("=");
    if (!k) return;
    map[k.trim()] = v.join("=").trim();
  });
  return map;
}

export async function POST(request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = parseCookies(cookieHeader);
    const refresh = cookies.refreshToken;
    if (refresh) {
      const parts = String(refresh).split(".");
      const userId = parts[0];
      if (userId && /^[0-9]+$/.test(userId)) {
        await clearRefreshToken(BigInt(userId));
      }
    }

    // Clear cookie
    const cookie = `refreshToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`;
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json", "Set-Cookie": cookie },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
