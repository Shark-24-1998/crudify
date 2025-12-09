import GoogleLoginButton from "@/components/GoogleLoginButton";
import SignUp from "@/components/SignUp";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-2">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl space-y-3">
      

        {/* Email/Password Signup Form */}
        <SignUp />

        {/* Separator */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <span className="relative px-4 bg-white text-gray-500 text-sm">OR</span>
        </div>

        {/* Google Login Button */}
        <div className="flex justify-center">
          <GoogleLoginButton />
        </div>

       
        
      </div>
    </main>
  );
}