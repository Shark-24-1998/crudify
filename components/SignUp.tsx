"use client";

import { auth, createUserWithEmailAndPassword } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import * as z from "zod";

export default function SignUp() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "", confirm: "" });
    const [loading, setLoading] = useState(false);

    // Zod validation schema
    const schema = z
        .object({
            email: z.string().email("Invalid email address"),
            password: z.string().min(6, "Password must be at least 6 characters"),
            confirm: z.string(),
        })
        .refine((data) => data.password === data.confirm, {
            message: "Passwords do not match",
            path: ["confirm"],
        });

    const handleSignUp = async () => {
        try {
            setLoading(true);

            // Validate form
            const parsed = schema.safeParse(form);
            if (!parsed.success) {
                toast.error(parsed.error.issues[0].message);
                return;
            }

            // Create user with Firebase
            const result = await createUserWithEmailAndPassword(
                auth,
                form.email,
                form.password
            );
            const user = result.user;

            // Get ID token
            const idToken = await user.getIdToken();

            // Create secure session cookie on server
            const res = await fetch("/api/auth/session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken }),
            });




            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Session creation failed");
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


            toast.success("Account created successfully!");
            router.push("/");
        } catch (err: unknown) {
            let message = "Something went wrong";
            if (err instanceof Error) message = err.message;
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-center text-2xl">Create Account</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            placeholder="Your Email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <Label>Password</Label>
                        <Input
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                        />
                    </div>

                    <div>
                        <Label>Confirm Password</Label>
                        <Input
                            type="password"
                            placeholder="Confirm Password"
                            value={form.confirm}
                            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                        />
                    </div>

                    <Button
                        disabled={loading}
                        onClick={handleSignUp}
                        className="w-full"
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </Button>

                    <p className="text-center text-sm mt-2">
                        Already have an account?{" "}
                        <a href="/login" className="text-blue-600 hover:underline">
                            Login
                        </a>
                    </p>
                </CardContent>
            </Card>
        </main>
    );
}
