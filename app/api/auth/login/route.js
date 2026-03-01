import { comparePassword } from "../../../../lib/hash.js";
import { findUserByEmail } from "../../../../lib/users.js";
import { sign } from "../../../../lib/jwt.js";

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
      user.passwordHash,
    );
    if (!ok) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }

    const token = sign({ sub: String(user.id), email: user.email });

    return new Response(
      JSON.stringify({
        token,
        user: { id: user.id, email: user.email, name: user.name },
      }),
      {
        status: 200,
        headers: { "content-type": "application/json" },
      },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
