"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, auth } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // Zod schema for login
  const schema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const handleLogin = async () => {
    try {
      setLoading(true);

      // Validate form
      const parsed = schema.safeParse(form);
      if (!parsed.success) {
        toast.error(parsed.error.issues[0].message);
        return;
      }

      // Firebase login
      const result = await signInWithEmailAndPassword(auth, form.email, form.password);
      const user = result.user;
      const idToken = await user.getIdToken();

      // Create session cookie on server
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

       

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Session creation failed");
      }

      toast.success("Logged in successfully!");
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
    <main >
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Login</CardTitle>
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

          <Button disabled={loading} onClick={handleLogin} className="w-full">
            {loading ? "Logging in..." : "Login"}
          </Button>

          <p className="text-center text-sm mt-2">
            Don’t have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Sign Up
            </a>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
