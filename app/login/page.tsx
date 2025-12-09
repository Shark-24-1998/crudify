


import GoogleLoginButton from "@/components/GoogleLoginButton";
import Login from "@/components/Login";


export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl space-y-6">
      

        <Login />

        <div className="relative flex items-center justify-center">
          <span className="px-4 bg-white text-gray-500 text-sm">OR</span>
          <div className="absolute w-full border-t border-gray-300"></div>
        </div>

        <GoogleLoginButton /> 

      
      
      </div>
    </main>
  );
}
