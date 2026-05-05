import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Redirect deprecated legacy portals to their Nemesis destinations.
 * Also provides the /driver shortcut for driver login.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /driver → /depin/driver/login (easy entry point for drivers)
  if (pathname === "/driver" || pathname === "/driver/") {
    return NextResponse.redirect(new URL("/depin/driver/login", request.url), { status: 307 });
  }

  if (pathname.startsWith("/dapp")) {
    return NextResponse.redirect(new URL("/", request.url), { status: 308 });
  }

  if (pathname.startsWith("/enterprise")) {
    const suffix = pathname.replace(/^\/enterprise/, "");
    return NextResponse.redirect(new URL(`/rwa/operator${suffix}`, request.url), { status: 308 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dapp/:path*", "/enterprise/:path*", "/driver"],
};
