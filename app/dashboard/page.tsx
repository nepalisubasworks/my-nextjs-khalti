import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full flex flex-col md:flex-row bg-white overflow-y-scroll">
      {/* Left Banner Panel (Fixed position feel on desktop) */}
      <div className="hidden md:flex md:w-1/2 bg-[#1d1d1d] text-white flex-col justify-between p-12 min-h-screen relative overflow-hidden select-none">
        {/* Grid Container */}
        <div className="relative my-auto flex items-center justify-center">
          <div className="grid grid-cols-5 gap-3 sm:gap-4 z-10 p-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white flex items-center justify-center shadow-md overflow-hidden p-1"
              >
                <span className="text-[10px] sm:text-xs font-bold text-gray-700 text-center leading-tight">
                  Bank {i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Banner Text */}
        <div className="relative z-20 mt-auto">
          <p className="text-3xl sm:text-4xl font-extrabold text-[#f5a623] leading-tight">
            60+ Bank &amp; Financial
            <br />
            Institutions
          </p>
          <p className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            Integrated with Khalti
          </p>
        </div>
      </div>

      {/* Right Form Panel with Vertical Overflow */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 min-h-screen overflow-y-auto">
        <LoginForm />
      </div>
    </main>
  );
}