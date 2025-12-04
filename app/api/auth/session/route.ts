import admin from "firebase-admin";

import { NextResponse, type NextRequest } from "next/server";


const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON

if (!admin.apps?.length) {
    if (!serviceAccountJson) {
        throw new Error(
            "FIREBASE_SERVICE_ACCOUNT_JSON env required (service account JSON string)"
        );
    }
    const serviceAccount = JSON.parse(serviceAccountJson)
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    })
}


export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const idToken = body.idToken as string | undefined
        if (!idToken) {
            return new NextResponse("Missing idToken", { status: 400 })
        }

        // Verify the ID token using Firebase Admin
        const decoded = await admin.auth().verifyIdToken(idToken)

        // Create a session cookie from the ID token (expires in e.g. 7 days)
        const expiresIn = 7 * 24 * 60 * 60 * 1000 // 7 days in ms
        const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn })

        // Set httpOnly secure cookie
        const res = NextResponse.json(
            { ok: true, uid: decoded.uid, email: decoded.email },
            { status: 200 }
        )

        // cookie attributes: HttpOnly, Secure, SameSite=Lax, Path=/
        res.headers.append(
            "Set-Cookie",
            `session=${sessionCookie}; HttpOnly; Path=/; Max-Age=${expiresIn / 1000}; SameSite=Lax; Secure`
        );

        return res

    } catch (err: any ) {
        console.error("session route error:", err);
        return new NextResponse(err?.message || "Internal error", { status: 500 });

    }

}