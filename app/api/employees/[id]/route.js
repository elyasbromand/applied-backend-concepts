import { NextResponse } from "next/server.js";
import prisma from "../../../../lib/prisma.js";

// GET: Retrieve an employee by id (includes department, position and related records).
export async function GET(request, { params }) {
  try {
    const id = Number(params.id);
    const rec = await prisma.employee.findUnique({
      where: { id },
      include: {
        department: true,
        position: true,
        addresses: true,
        salaries: true,
        documents: true,
        attendances: true,
      },
    });
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

// PUT: Update employee fields.
export async function PUT(request, { params }) {
  try {
    const id = Number(params.id);
    const body = await request.json();
    const updated = await prisma.employee.update({ where: { id }, data: body });
    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    const status = /Record to update not found/i.test(err.message) ? 404 : 500;
    return new Response(JSON.stringify({ error: err.message }), { status });
  }
}

// DELETE: Soft-delete an employee by setting `isDeleted` to true.
export async function DELETE(request, { params }) {
  try {
    const id = Number(params.id);
    await prisma.employee.update({ where: { id }, data: { isDeleted: true } });
    return new Response(null, { status: 204 });
  } catch (err) {
    const status = /Record to update not found/i.test(err.message) ? 404 : 500;
    return new Response(JSON.stringify({ error: err.message }), { status });
  }
}
