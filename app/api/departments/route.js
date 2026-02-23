import { NextResponse } from "next/server.js";
import prisma from "../../../lib/prisma.js";

// GET: List all departments.
export async function GET() {
  try {
    const deps = await prisma.department.findMany();
    return NextResponse.json(deps, { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

// POST: Create a department. Accepts `name` and optional `description`.
export async function POST(request) {
  try {
    const body = await request.json();
    const created = await prisma.department.create({ data: body });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
