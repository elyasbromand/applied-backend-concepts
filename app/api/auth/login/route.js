import { comparePassword } from "../../../../lib/hash.js";
import { findUserByEmail, setRefreshToken } from "../../../../lib/users.js";
import { sign } from "../../../../lib/jwt.js";
import crypto from "crypto";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        {
          status: 400,
          headers: { "content-type": "application/json" },
        },
      );
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }

    const ok = await comparePassword(
      password,
      user.password_hash || user.passwordHash || user.password,
    );
    if (!ok) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }

    const token = sign({ sub: String(user.id), email: user.email });

    // generate refresh token: format <userId>.<random>
    const random = crypto.randomBytes(48).toString("hex");
    const refreshRaw = `${user.id.toString()}.${random}`;
    await setRefreshToken(user.id, refreshRaw);

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
