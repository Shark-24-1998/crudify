"use client"

import { auth, googleProvider } from "@/lib/firebase"
import { signInWithPopup } from "firebase/auth"
// import { useRouter } from "next/navigation"
import { Button } from "./ui/button"

export default function GoogleLoginButton() {
    // const router = useRouter()

    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider)
            const user = result.user
            const idToken = await user.getIdToken()


            // send the idToken to server to create secure httpOnly cookie
            const res = await fetch("/api/auth/session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken }),
            })


            if (!res.ok) {
                const text = await res.text()
                console.error("session creation failed", text)
                return;
            }

            // Now insert user into Neon DB
            await fetch("/api/usersinfo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: user.displayName || "", // fallback for email-only signup
                    email: user.email,
                    photoURL: user.photoURL || "",
                }),
            });

            // server created session cookie — redirect to /main

            // router.push("/")
            window.location.href = "/";


        } catch (error) {
            console.error("Google Login Failde", error)

        }
    }
    return (
        <Button variant="default" onClick={loginWithGoogle}>
            Sign in With Google
        </Button>
    )
}