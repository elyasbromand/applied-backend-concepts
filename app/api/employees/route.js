import { NextResponse } from "next/server.js";
import prisma from "../../../lib/prisma.js";

// GET: List employees (excludes soft-deleted). Supports `departmentId` and `positionId` query filters.
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const departmentId = url.searchParams.get("departmentId");
    const positionId = url.searchParams.get("positionId");

    const where = { isDeleted: false };
    if (departmentId !== null) where.departmentId = Number(departmentId);
    if (positionId !== null) where.positionId = Number(positionId);

    const list = await prisma.employee.findMany({
      where,
      include: { department: true, position: true },
    });
    return NextResponse.json(list, { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

// POST: Create a new employee. Required: `fullName`, `email`, `dateOfBirth`, `hireDate`, `departmentId`, `positionId`.
export async function POST(request) {
  try {
    const body = await request.json();
    const created = await prisma.employee.create({ data: body });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    const status = /unique constraint/i.test(err.message) ? 409 : 500;
    return new Response(JSON.stringify({ error: err.message }), { status });
  }
}
