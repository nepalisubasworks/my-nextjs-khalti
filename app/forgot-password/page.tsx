"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRecovered, setIsRecovered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      setIsRecovered(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col md:flex-row h-screen overflow-hidden bg-white">
      {/* ── Left Panel: Image ── */}
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

      {/* ── Right Panel ── */}
      <div className="flex-1 h-full overflow-y-auto overflow-x-hidden flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* ── Header ── */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative h-14 w-48">
              <Image
                src="/khalti.png"
                alt="Khalti"
                fill
                className="object-contain"
                priority
              />
            </div>
            <Link
              href="/"
              className="text-[#c41e3a] font-medium flex items-center gap-1 hover:text-blue-600 transition-colors text-sm"
            >
              Go to Login <span className="text-lg">›</span>
            </Link>
          </div>

          {/* ── Account Recovery Form ── */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-800 text-left">
              Account Recovery
            </h1>
          </div>

          <p className="text-gray-500 text-xs text-left mb-6 leading-relaxed font-bold">
            Please check SMS and type received code below and do not refresh the page until the process is complete.
          </p>

          <div className="flex border-b border-gray-200 mb-6">
            <button
              type="button"
              className="flex-1 py-2 text-sm font-medium text-[#c41e3a] border-b-2 border-[#c41e3a]"
            >
              Reset Password
            </button>
            <button
              type="button"
              className="flex-1 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Scan QR Code
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-900 text-left">
                Mobile Number
              </label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full border rounded-md px-4 py-3.5 text-[15px] placeholder:text-gray-300 focus:outline-none disabled:bg-gray-100 transition-all border-gray-200 text-gray-900 focus:ring-[0.5px] focus:ring-blue-500 focus:border-transparent"
                placeholder="Mobile Number"
                required
              />
            </div>

            {error && <p className="text-sm text-red-600 text-left">{error}</p>}

            <div className="flex justify-start">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#f5a623] hover:bg-[#e09515] text-white font-bold py-2 px-8 rounded-lg transition-all disabled:opacity-60 text-sm"
              >
                {loading ? "Sending..." : "Recover"}
              </button>
            </div>
          </form>

          {/* ── Footer ── */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 font-medium leading-relaxed">
              60+ Bank &amp; Financial Institutions
              <br />
              Integrated with Khalti
            </p>
          </div>
        </div>
      </div>

      {/* ── Recovery Modal ── */}
      {isRecovered && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsRecovered(false);
          }}
        >
          <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-2xl overflow-hidden">
            <div className="bg-[#c41e3a] px-6 py-4">
              <h2 className="text-white text-lg font-bold">
                Forgot your password?
              </h2>
            </div>
            <div className="px-6 py-5">
              <p className="text-gray-800 text-sm leading-relaxed text-left">
                Please use the Khalti app to reset password for this account.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}