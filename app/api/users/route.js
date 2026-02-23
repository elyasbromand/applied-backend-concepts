import { NextResponse } from "next/server.js";
import prisma from "../../../lib/prisma.js";

// GET: Returns a list of users.
export async function GET(request) {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users, { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

// POST: Create a new user. Accepts `email`, `passwordHash`, `name` and optional `refreshToken`.
export async function POST(request) {
  try {
    const body = await request.json();
    const created = await prisma.user.create({ data: body });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    const status = /unique constraint/i.test(err.message) ? 409 : 500;
    return new Response(JSON.stringify({ error: err.message }), {
      status,
      headers: { "content-type": "application/json" },
    });
  }
}
