import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const sessionCookie = req.cookies.get("session")?.value;
  const { pathname } = req.nextUrl;

  // Not logged in → block everything except login page
  if (!sessionCookie && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Logged in but visiting login page → redirect to home
  if (sessionCookie && pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth|api).*)",
  ],
};
