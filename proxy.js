//  this proxy file acts as middleware, since it will protect all api routes except the login and register routes.
import { NextResponse } from "next/server";
import { verify } from "./lib/jwt.js";

export async function proxy(request) {

    const { pathname } = request.nextUrl;

    if (
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/auth/register")
    ) {
    return NextResponse.next();
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    try {
    verify(token);
    return NextResponse.next();
    } catch (err) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}

// apply to all API routes
export const config = {
    matcher: "/api/:path*",
};
