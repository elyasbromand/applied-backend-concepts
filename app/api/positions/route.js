import { NextResponse } from "next/server.js";
import prisma from "../../../lib/prisma.js";

// GET: List all positions.
export async function GET() {
  try {
    const items = await prisma.position.findMany();
    return NextResponse.json(items, { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

// POST: Create a position. Accepts `title` and optional `description`.
export async function POST(request) {
  try {
    const body = await request.json();
    const created = await prisma.position.create({ data: body });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
