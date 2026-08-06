import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import Link from "next/link";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

// Service icons configuration
const services = [
  { name: "Send Money", icon: "💸", href: "/user/send" },
  { name: "Pay Bills", icon: "📄", href: "/user/bills" },
  { name: "Mobile Recharge", icon: "📱", href: "/user/recharge" },
  { name: "Bank Transfer", icon: "🏦", href: "/user/bank" },
  { name: "Internet", icon: "🌐", href: "/user/internet" },
  { name: "TV", icon: "📺", href: "/user/tv" },
  { name: "Education", icon: "🎓", href: "/user/education" },
  { name: "Insurance", icon: "🛡️", href: "/user/insurance" },
];

export default async function UserDashboardPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token");
  const userRole = cookieStore.get("user_role");
  const userMobile = cookieStore.get("user_mobile")?.value;

  // Redirect to login if not authenticated
  if (!sessionToken) {
    redirect("/");
  }

  // If admin, redirect to admin dashboard
  if (userRole?.value === "admin") {
    redirect("/dashboard");
  }

  // Fetch the actual user from the database using the mobile from cookie
  const currentUser = userMobile
    ? await prisma.user.findUnique({
        where: { mobile: userMobile },
        select: {
          id: true,
          mobile: true,
          fullName: true,
        },
      })
    : null;

  // If user not found, redirect to login
  if (!currentUser) {
    redirect("/");
  }

  // Fetch user's recent transactions (login events for now)
  const recentActivity = await prisma.loginEvent.findMany({
    where: { mobile: currentUser.mobile },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  // Mock balance – replace with real data later
  const balance = 1250.75;

  // Display name: use fullName if available, otherwise fallback to mobile
  const displayName = currentUser.fullName || currentUser.mobile;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[#c41e3a]">Khalti</span>
              <span className="text-sm text-gray-400 hidden sm:inline">| User Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden md:block">
                Welcome, {displayName}
              </span>
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                🔔
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#c41e3a] rounded-full"></span>
              </button>
              <form action="/api/logout" method="POST">
                <button
                  type="submit"
                  className="text-sm text-gray-600 hover:text-[#c41e3a] transition-colors"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Balance Card */}
        <div className="bg-linear-to-r from-[#c41e3a] to-[#a0152e] rounded-2xl p-6 text-white shadow-lg mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Available Balance</p>
              <p className="text-3xl font-bold mt-1">रू {balance.toFixed(2)}</p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Load Funds
              </button>
              <button className="bg-white text-[#c41e3a] hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Send Money
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 mb-8">
          {services.slice(0, 8).map((service) => (
            <Link
              key={service.name}
              href={service.href}
              className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <span className="text-2xl">{service.icon}</span>
              <span className="text-xs text-gray-600 mt-1 text-center">{service.name}</span>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
            <Link href="/user/transactions" className="text-sm text-[#c41e3a] hover:underline">
              View All
            </Link>
          </div>
          {recentActivity.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">
              No recent activity. Start using Khalti today!
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="px-6 py-3 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className={`text-xl ${activity.success ? "text-green-500" : "text-red-500"}`}>
                      {activity.success ? "✅" : "❌"}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {activity.success ? "Login Successful" : "Login Failed"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(activity.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${activity.success ? "text-green-600" : "text-red-600"}`}>
                    {activity.success ? "Success" : "Failed"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* All Services Section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">All Services</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {services.map((service) => (
              <Link
                key={service.name}
                href={service.href}
                className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <span className="text-xl">{service.icon}</span>
                <span className="text-xs text-gray-600 mt-1 text-center">{service.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}