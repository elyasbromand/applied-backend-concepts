import { hashPassword } from "../../../../lib/hash.js";
import { createUser, findUserByEmail } from "../../../../lib/users.js";
import { sign } from "../../../../lib/jwt.js";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        {
          status: 400,
          headers: { "content-type": "application/json" },
        },
      );
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return new Response(JSON.stringify({ error: "Email already in use" }), {
        status: 409,
        headers: { "content-type": "application/json" },
      });
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser({ email, passwordHash, name });

    const token = sign({ sub: String(user.id), email: user.email });

    return new Response(
      JSON.stringify({
        token,
        user: { id: user.id, email: user.email, name: user.name },
      }),
      {
        status: 201,
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
