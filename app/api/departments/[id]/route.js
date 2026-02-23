import { NextResponse } from "next/server.js";
import prisma from "../../../../lib/prisma.js";

// GET: Retrieve a department by id.
export async function GET(request, { params }) {
  try {
    const id = Number(params.id);
    const dep = await prisma.department.findUnique({ where: { id } });
    if (!dep)
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
      });
    return NextResponse.json(dep, { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

// PUT: Update a department.
export async function PUT(request, { params }) {
  try {
    const id = Number(params.id);
    const body = await request.json();
    const updated = await prisma.department.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    const status = /Record to update not found/i.test(err.message) ? 404 : 500;
    return new Response(JSON.stringify({ error: err.message }), { status });
  }
}

// DELETE: Delete a department only if it has no (non-deleted) employees.
export async function DELETE(request, { params }) {
  try {
    const id = Number(params.id);
    const count = await prisma.employee.count({
      where: { departmentId: id, isDeleted: false },
    });
    if (count > 0) {
      return new Response(
        JSON.stringify({
          error: "Cannot delete department with active employees",
        }),
        { status: 400 },
      );
    }
    await prisma.department.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
