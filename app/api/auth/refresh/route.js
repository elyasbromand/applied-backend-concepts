import {
  findUserByRefreshToken,
  setRefreshToken,
} from "../../../../lib/users.js";
import { sign } from "../../../../lib/jwt.js";
import crypto from "crypto";

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
    if (!refresh) {
      return new Response(JSON.stringify({ error: "No refresh token" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }

    const user = await findUserByRefreshToken(refresh);
    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid refresh token" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }

    // rotate refresh token
    const random = crypto.randomBytes(48).toString("hex");
    const refreshRaw = `${user.id.toString()}.${random}`;
    await setRefreshToken(user.id, refreshRaw);

    const token = sign({ sub: String(user.id), email: user.email });

    const refreshTtl = parseInt(
      process.env.REFRESH_TOKEN_TTL_SECONDS || String(60 * 60 * 24 * 7),
      10,
    );
    const secureFlag = process.env.NODE_ENV === "production" ? "; Secure" : "";
    const cookie = `refreshToken=${refreshRaw}; HttpOnly; Path=/; Max-Age=${refreshTtl}; SameSite=Strict${secureFlag}`;

    return new Response(
      JSON.stringify({
        token,
        user: { id: user.id.toString(), email: user.email, name: user.name },
      }),
      {
        status: 200,
        headers: { "content-type": "application/json", "Set-Cookie": cookie },
      },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
