import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="text-center max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Signup — Coming Soon</h1>
        <p className="text-gray-500 mb-6">
          This is a practice clone project. Signup isn&apos;t implemented since the focus here is the login flow.
        </p>
        <Link href="/login" className="text-rose-700 font-medium hover:underline">
          Back to Login
        </Link>
      </div>
    </main>
  );
}