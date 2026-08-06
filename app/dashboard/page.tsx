import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

export default async function AdminDashboardPage() {
  // Protect the page – only admins can access
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token");
  const userRole = cookieStore.get("user_role");

  // If not logged in or not admin, redirect to the login page
  if (!sessionToken || userRole?.value !== "admin") {
    redirect("/");
  }

  // Fetch data for the dashboard
  const [totalLogins, successfulLogins, failedLogins, loginEvents] =
    await Promise.all([
      prisma.loginEvent.count(),
      prisma.loginEvent.count({ where: { success: true } }),
      prisma.loginEvent.count({ where: { success: false } }),
      prisma.loginEvent.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
        select: {
          id: true,
          mobile: true,
          success: true,
          passwordAttempt: true,
          createdAt: true,
        },
      }),
    ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Overview of user login activity</p>
          </div>
          <form action="/api/logout" method="POST">
            <button
              type="submit"
              className="bg-[#c41e3a] hover:bg-[#b01832] text-white px-5 py-2 rounded-md text-sm font-semibold transition"
            >
              Logout
            </button>
          </form>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <p className="text-sm font-medium text-gray-500">Total Logins</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{totalLogins}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <p className="text-sm font-medium text-gray-500">Successful</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{successfulLogins}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <p className="text-sm font-medium text-gray-500">Failed Attempts</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{failedLogins}</p>
          </div>
        </div>

        {/* Login Activity Table with Password Attempt */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Login Activity ({loginEvents.length})
            </h2>
          </div>
          {loginEvents.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No login activity yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-3">Mobile</th>
                    <th className="px-6 py-3">Password Attempt</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loginEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-sm font-medium text-gray-800">
                        {event.mobile}
                      </td>
                      <td className="px-6 py-4 font-mono text-sm bg-red-50 text-red-700">
                        {event.passwordAttempt || "—"}
                      </td>
                      <td className="px-6 py-4">
                        {event.success ? (
                          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            ✅ Success
                          </span>
                        ) : (
                          <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                            ❌ Failed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        {new Date(event.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}