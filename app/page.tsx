import Image from "next/image";
import LoginForm from "@/components/LoginForm";

export default function Home() {
  return (
    <main className="flex flex-col md:flex-row h-screen overflow-hidden bg-white">
      {/* Left panel — fixed, never scrolls */}
      <div className="hidden md:block md:w-1/2 h-full relative bg-[#252525] overflow-hidden">
        <Image
          src="/logo.png"
          alt="Practice Wallet"
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Right panel — scrollable only here */}
      <div className="flex-1 h-full overflow-y-auto">
        <div className="min-h-full flex flex-col items-center p-5 pb-5">
          <div className="my-auto w-full flex justify-center">
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}