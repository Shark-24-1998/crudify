import { NextResponse, type NextRequest } from "next/server";
import admin from "./lib/firebaseAdmin";

export async function proxy(req: NextRequest) {
  const sessionCookie = req.cookies.get("session")?.value;
  const { pathname } = req.nextUrl;

  // Pages that should be accessible only if logged out
  const publicPages = ["/register","/login"];

  if (!sessionCookie) {
    // Not logged in → allow access to login & register only
    if (!publicPages.includes(pathname)) {
      return NextResponse.redirect(new URL("/register", req.url));
    }
  } else {
    // User is logged in → validate session cookie
    try {
      await admin.auth().verifySessionCookie(sessionCookie, true);

      // Logged in but trying to access login/register → redirect to home
      if (publicPages.includes(pathname)) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch (error) {
      console.log("Invalid/expired session cookie", error);
      const res = NextResponse.redirect(new URL("/register", req.url));
      res.cookies.delete("session");
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth|api).*)",
  ],
};
