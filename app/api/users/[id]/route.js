import { NextResponse } from "next/server.js";
import prisma from "../../../../lib/prisma.js";

// GET: Retrieve a single user by `id`.
export async function GET(request, { params }) {
  try {
    const id = BigInt(params.id);
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user)
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
      });
    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

// PUT: Update an existing user (by `id`).
export async function PUT(request, { params }) {
  try {
    const id = BigInt(params.id);
    const body = await request.json();
    const updated = await prisma.user.update({ where: { id }, data: body });
    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    const status = /Record to update not found/i.test(err.message) ? 404 : 500;
    return new Response(JSON.stringify({ error: err.message }), { status });
  }
}

// DELETE: Permanently delete a user by `id`.
export async function DELETE(request, { params }) {
  try {
    const id = BigInt(params.id);
    await prisma.user.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (err) {
    const status = /Record to delete does not exist/.test(err.message)
      ? 404
      : 500;
    return new Response(JSON.stringify({ error: err.message }), { status });
  }
}
