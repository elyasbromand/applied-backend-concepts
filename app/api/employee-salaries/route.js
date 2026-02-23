import { NextResponse } from "next/server.js";
import prisma from "../../../lib/prisma.js";

// GET: List salaries. Optional `employeeId` query param to filter.
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const employeeId = url.searchParams.get("employeeId");
    const where = {};
    if (employeeId !== null) where.employeeId = Number(employeeId);
    const list = await prisma.employeeSalary.findMany({ where });
    return NextResponse.json(list, { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

// POST: Create a salary record. Requires `employeeId`, `basicSalary`, `allowance`, `effectiveFrom`.
export async function POST(request) {
  try {
    const body = await request.json();
    const created = await prisma.employeeSalary.create({ data: body });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
