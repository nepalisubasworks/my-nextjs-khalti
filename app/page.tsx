import Image from "next/image";
import LoginForm from "@/components/LoginForm";

export default function HomePage() {
  return (
    <main className="flex flex-col md:flex-row h-screen overflow-hidden bg-white">
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
      <div className="flex-1 h-full overflow-y-auto overflow-x-hidden flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}