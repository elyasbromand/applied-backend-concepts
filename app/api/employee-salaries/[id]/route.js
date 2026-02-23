import { NextResponse } from "next/server.js";
import prisma from "../../../../lib/prisma.js";

// GET: Retrieve a salary record by id.
export async function GET(request, { params }) {
  try {
    const id = Number(params.id);
    const rec = await prisma.employeeSalary.findUnique({ where: { id } });
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

// PUT: Update a salary record.
export async function PUT(request, { params }) {
  try {
    const id = Number(params.id);
    const body = await request.json();
    const updated = await prisma.employeeSalary.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    const status = /Record to update not found/i.test(err.message) ? 404 : 500;
    return new Response(JSON.stringify({ error: err.message }), { status });
  }
}

// DELETE: Deactivate the salary (set `isActive` to false).
export async function DELETE(request, { params }) {
  try {
    const id = Number(params.id);
    const updated = await prisma.employeeSalary.update({
      where: { id },
      data: { isActive: false },
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    const status = /Record to update not found/i.test(err.message) ? 404 : 500;
    return new Response(JSON.stringify({ error: err.message }), { status });
  }
}
