
import { db } from "@/db/drizzle";
import { usersInfo } from "@/db/schema";
import admin from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req : NextRequest) {
    try{
        const body = await req.json()
        const sessionCookie = req.cookies.get("session")?.value;
       

        if(!sessionCookie) return NextResponse.json({error: "Not Authenticated"}, {status : 401})

        // Verify Firebase session cookie
        const decoded = await admin.auth().verifySessionCookie(sessionCookie , true)

        const {name , email, photoURL} = body

         // Insert user
         const result = await db.insert(usersInfo).values({
            uid : decoded.uid,
            email : email || decoded.email!,
            name : name || "",
            photoURL : photoURL || ""
         }).returning()

          return NextResponse.json({ ok: true, user: result[0] });

    }catch(err: unknown){
         let message = "Something went wrong";
      if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 })
    }}
