import { NextResponse } from "next/server.js";
import prisma from "../../../../lib/prisma.js";

// GET: Retrieve a position by id.
export async function GET(request, { params }) {
  try {
    const id = Number(params.id);
    const rec = await prisma.position.findUnique({ where: { id } });
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

// PUT: Update a position.
export async function PUT(request, { params }) {
  try {
    const id = Number(params.id);
    const body = await request.json();
    const updated = await prisma.position.update({ where: { id }, data: body });
    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    const status = /Record to update not found/i.test(err.message) ? 404 : 500;
    return new Response(JSON.stringify({ error: err.message }), { status });
  }
}

// DELETE: Delete a position only if it has no (non-deleted) employees.
export async function DELETE(request, { params }) {
  try {
    const id = Number(params.id);
    const count = await prisma.employee.count({
      where: { positionId: id, isDeleted: false },
    });
    if (count > 0) {
      return new Response(
        JSON.stringify({
          error: "Cannot delete position with active employees",
        }),
        { status: 400 },
      );
    }
    await prisma.position.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
