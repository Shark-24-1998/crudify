import { NextResponse } from "next/server";


export async function POST() {
  const res = NextResponse.json({ message: "Logged out" });

  // Delete the session cookie
  res.headers.append(
    "Set-Cookie",
    `session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; Secure`
  );

  return res;
}
