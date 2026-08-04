import Image from "next/image";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex flex-col md:flex-row h-screen overflow-hidden bg-white">
      {/* Left panel — fixed, never scrolls */}
      <div className="hidden md:block md:w-1/2 h-full relative">
        <Image
          src="/logo.png"
          alt="Khalti Logo"
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Right panel — scrollable vertically, no horizontal scroll */}
      <div className="flex-1 h-full overflow-y-auto overflow-x-hidden flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}