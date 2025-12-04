import GoogleLoginButton from "@/components/GoogleLoginButton";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-sm p-10 bg-white rounded-2xl shadow-xl flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Welcome Back</h1>
        <p className="text-gray-500 text-center mb-6">
          Sign in to continue to your dashboard
        </p>
        <GoogleLoginButton />
      </div>
    </main>
  );
}
