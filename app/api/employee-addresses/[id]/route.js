import { NextResponse } from "next/server.js";
import prisma from "../../../../lib/prisma.js";

// GET: Retrieve a single address by id.
export async function GET(request, { params }) {
  try {
    const p = await params;
    const id = parseInt(p.id);
    const rec = await prisma.employeeAddress.findUnique({ where: { id } });
    if (!rec)
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
      });
    return NextResponse.json(rec, { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

// PUT: Update an address.
export async function PUT(request, { params }) {
  try {
    const p = await params;
    const id = parseInt(p.id);
    const body = await request.json();
    const updated = await prisma.employeeAddress.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    const status = /Record to update not found/i.test(err.message) ? 404 : 500;
    return new Response(JSON.stringify({ error: err.message }), { status });
  }
}

// DELETE: Delete an address.
export async function DELETE(request, { params }) {
  try {
    const p = await params;
    const id = parseInt(p.id);
    await prisma.employeeAddress.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (err) {
    const status = /Record to delete does not exist/.test(err.message)
      ? 404
      : 500;
    return new Response(JSON.stringify({ error: err.message }), { status });
  }
}
