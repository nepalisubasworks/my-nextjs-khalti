"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const EmptyCircle = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="#f5a623" strokeWidth="2" />
  </svg>
);

const CheckedCircle = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="#22c55e" strokeWidth="2" />
    <path
      d="M9 12l2 2 4-4"
      stroke="#22c55e"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function SignupForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    special: false,
    number: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const validatePassword = (pwd: string) => {
    setPasswordChecks({
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      special: /[@$!%*?&]/.test(pwd),
      number: /\d/.test(pwd),
    });
    setPassword(pwd);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName || !mobile || !password || !confirmPassword) {
      setError("Please fill in all required fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!termsAccepted) {
      setError("You must agree to the Terms & Conditions");
      return;
    }
    const isStrong = Object.values(passwordChecks).every((v) => v === true);
    if (!isStrong) {
      setError("Please meet all password requirements");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, mobile, email, dob, gender, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }
      setSuccess("Account created! Please login.");
      setTimeout(() => onSwitchToLogin(), 1500);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col font-sans">
      {/* ── Header: logo + "Go to Login" ── */}
      <div className="flex items-center justify-between">
        <div className="relative h-16 w-64 -ml-2">
          <Image
            src="/khalti.png"
            alt="Khalti"
            fill
            className="object-contain"
            priority
          />
        </div>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-[#c41e3a] font-medium text-sm flex items-center gap-1 hover:text-blue-600 transition-colors duration-200"
        >
          Go to Login <span className="text-lg">›</span>
        </button>
      </div>

      {/* ── Heading section ── */}
      <div className="mt-4">
        <h2 className="text-2xl font-bold text-gray-800">Join the cashless world.</h2>
        <p className="text-gray-500 text-xs mt-1 leading-relaxed font-bold whitespace-nowrap">
          By having a khalti account, you can pay, book and transfer cash easily.
        </p>
        <p className="text-gray-400 text-xs mt-0.5 font-bold">Sign up in just seconds.</p>
      </div>

      {/* ── Form fields ── */}
      <div className="space-y-4 mt-5">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Full name *</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a] focus:border-transparent text-sm placeholder:text-gray-400"
            placeholder="Full name"
            required
          />
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Mobile number *</label>
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a] focus:border-transparent text-sm placeholder:text-gray-400"
            placeholder="Mobile number"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email (Optional)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a] focus:border-transparent text-sm placeholder:text-gray-400"
            placeholder="Email (Optional)"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <div className="relative">
            <input
              type="text"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              placeholder="Date of Birth (YYYY-MM-DD) in AD"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a] focus:border-transparent text-sm placeholder:text-gray-400 pr-10"
            />
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <div className="flex gap-6 mt-1.5">
            {["Male", "Female", "Other"].map((g) => (
              <label key={g} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={gender === g}
                  onChange={() => setGender(g)}
                  className="accent-[#c41e3a] w-4 h-4"
                />
                {g}
              </label>
            ))}
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => validatePassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a] focus:border-transparent text-sm placeholder:text-gray-400 pr-12"
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5.5 0-9.5-4.5-10-8a13.13 13.13 0 0 1 1.67-3.06" />
                  <path d="M9.9 4.24A10.9 10.9 0 0 1 12 4c5.5 0 9.5 4.5 10 8a13.14 13.14 0 0 1-1.67 3.06" />
                  <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          <ul className="mt-2 space-y-1 text-xs text-gray-500">
            <li className="flex items-center gap-2">
              {passwordChecks.length ? <CheckedCircle /> : <EmptyCircle />}
              At least 8 characters long
            </li>
            <li className="flex items-center gap-2">
              {passwordChecks.uppercase ? <CheckedCircle /> : <EmptyCircle />}
              At least one uppercase letter
            </li>
            <li className="flex items-center gap-2">
              {passwordChecks.lowercase ? <CheckedCircle /> : <EmptyCircle />}
              At least one lowercase letter
            </li>
            <li className="flex items-center gap-2">
              {passwordChecks.special ? <CheckedCircle /> : <EmptyCircle />}
              At least one special character (@$!%*?&)
            </li>
            <li className="flex items-center gap-2">
              {passwordChecks.number ? <CheckedCircle /> : <EmptyCircle />}
              At least one number
            </li>
          </ul>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c41e3a] focus:border-transparent text-sm placeholder:text-gray-400 pr-12"
              placeholder="Confirm Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5.5 0-9.5-4.5-10-8a13.13 13.13 0 0 1 1.67-3.06" />
                  <path d="M9.9 4.24A10.9 10.9 0 0 1 12 4c5.5 0 9.5 4.5 10 8a13.14 13.14 0 0 1-1.67 3.06" />
                  <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Terms & Conditions – blue link */}
        <div className="flex items-start gap-2 mt-2">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-0.5 w-4 h-4 text-[#c41e3a] border-gray-300 rounded focus:ring-[#c41e3a]"
            required
          />
          <label className="text-xs text-gray-500">
            By signing up you agree to the Khalti&apos;s{" "}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms & Conditions
            </Link>
            .
          </label>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#c41e3a] hover:bg-[#b01832] text-white font-bold py-3 rounded-lg transition-all disabled:opacity-60 text-sm"
        >
          {loading ? "Creating account..." : "Join"}
        </button>
      </div>
    </form>
  );
}