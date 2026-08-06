"use client";
import { useState } from "react";
import Image from "next/image";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";

export default function HomePage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <main className="flex flex-col md:flex-row h-screen overflow-hidden bg-white">
      {/* Left panel – image */}
      <div className="hidden md:block md:w-1/2 h-full relative overflow-hidden">
        <Image
          src="/logo.png"
          alt="Khalti Logo"
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Right panel – scrollable with top alignment */}
      <div className="flex-1 h-full overflow-y-auto overflow-x-hidden flex items-start justify-center p-6">
        <div className="w-full max-w-sm py-4">
          {isLogin ? (
            <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
          ) : (
            <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </main>
  );
}