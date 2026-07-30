"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
 const [mobileError, setMobileError] = useState("");
const [passwordError, setPasswordError] = useState("");
const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setMobileError("");
  setPasswordError("");
  setFormError("");

  let hasError = false;
  if (!mobile.trim()) {
    setMobileError("This field is required");
    hasError = true;
  }
  if (!password.trim()) {
    setPasswordError("This field is required");
    hasError = true;
  } else if (password.length < 6) {
    setPasswordError("Password must be at least 6 characters");
    hasError = true;
  }
  if (hasError) return;

  setLoading(true);
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setFormError(data.message || "Login failed. Please try again.");
    } else {
      router.push("/dashboard");
    }
  } catch {
    setFormError("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[420px] flex flex-col font-sans">
      {/* ── Header row ── */}
      <div className="flex items-center justify-between">
        <div className="relative h-12 w-40">
          <Image
            src="/khalti.png"
            alt="Khalti"
            fill
            className="object-contain"
            priority
          />
        </div>

        <Link
          href="/subuser-login"
          className="text-[15px] text-[#c41e3a] font-medium flex items-center gap-1 hover:text-blue-600 transition-colors"
        >
          Login as SubUser
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      </div>

      {/* ── Title block ── */}
      <div className="mt-12">
        <h1 className="text-[32px] font-bold text-gray-900 leading-tight">
          Login to Khalti
        </h1>
        <p className="text-[15px] text-gray-500 mt-2 font-medium">
          Enter your credentials to login
        </p>
      </div>

      {/* ── Mobile or Email ── */}
<div className="flex flex-col gap-2 mt-4">
  <label htmlFor="mobile" className="text-sm font-bold text-gray-900">
    Mobile or Email
  </label>
  <div className="relative group">
    <input
  id="mobile"
  type="text"
  placeholder="Mobile or Email"
  value={mobile}
  onChange={(e) => setMobile(e.target.value)}
  disabled={loading}
className={`peer w-full border rounded-md px-3.5 py-3 pr-10 text-[15px] placeholder:text-gray-300 focus:outline-none disabled:bg-gray-100 transition-all ${
  mobileError
    ? "border-[#c41e3a] bg-[#fdf1f1] text-[#c41e3a] focus:ring-[0.5px] focus:ring-[#c41e3a]"
    : "border-gray-300 text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
}`}
/>
    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
     <svg
  className={`w-5 h-5 transition-colors ${
    mobileError ? "text-[#c41e3a]" : "text-gray-900 peer-focus:text-blue-500"
  }`}
  viewBox="0 0 24 24"
  fill="currentColor"
>
        <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
      </svg>
    </div>
  </div>
  {mobileError && (
    <p className="text-sm text-[#c41e3a] italic -mt-1">{mobileError}</p>
  )}
</div>

      {/* ── Password ── */}
<div className="flex flex-col gap-2">
  <label htmlFor="password" className="text-sm font-bold text-gray-900">
    Password
  </label>
  <div className="relative">
    <input
      id="password"
      type={showPassword ? "text" : "password"}
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      disabled={loading}
      className={`peer w-full border rounded-md px-3.5 py-3 pr-10 text-[15px] placeholder:text-gray-300 focus:outline-none disabled:bg-gray-100 transition-all ${
        passwordError
          ? "border-[#c41e3a] bg-[#fdf1f1] text-[#c41e3a] focus:ring-1 focus:ring-[#c41e3a]"
          : "border-gray-300 text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
      }`}
    />
    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      disabled={loading}
      className={`absolute right-3.5 top-1/2 -translate-y-1/2 hover:text-gray-600 transition-colors p-0.5 ${
        passwordError ? "text-[#c41e3a]" : "text-gray-400 peer-focus:text-blue-500"
      }`}
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-[20px] w-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5.5 0-9.5-4.5-10-8a13.13 13.13 0 0 1 3.06-4.94M9.9 4.24A10.9 10.9 0 0 1 12 4c5.5 0 9.5 4.5 10 8a13.14 13.14 0 0 1-1.67 3.06" />
          <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-[20px] w-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  </div>
  {passwordError && (
    <p className="text-sm text-[#c41e3a] italic -mt-1">{passwordError}</p>
  )}
</div>
{formError && (
        <p className="text-sm text-red-600 -mt-2 mb-2 font-medium">{formError}</p>
      )}

      {/* ── Forgot Password ── */}
      <div className="flex justify-end mt-4">
        <Link
          href="/forgot-password"
          className="text-[15px] text-[#c41e3a] font-bold hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#c41e3a] hover:bg-[#b01832] active:scale-[0.99] disabled:opacity-60 text-white font-bold rounded-md py-3.5 text-base transition-all flex items-center justify-center gap-2 shadow-sm mt-6"
      >
        {loading && (
          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        {loading ? "Logging in..." : "Login"}
      </button>

      <p className="text-[15px] text-gray-600 text-center font-medium mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-[#c41e3a] font-bold hover:underline">
          Signup
        </Link>
      </p>
    </form>
  );
}