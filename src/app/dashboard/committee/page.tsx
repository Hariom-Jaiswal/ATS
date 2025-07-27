"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/components/AuthContext";
import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function CommitteeDashboard() {
  const { userData } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await logout();
    if (!error) {
      router.push("/verification");
    } else {
      alert("Logout failed: " + error);
    }
  };

  return (
    <ProtectedRoute requiredRole="committee">
      <div className="min-h-screen bg-black text-white">
        <nav className="bg-gray-900 p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">ATS Committee Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span>Welcome, {userData?.firstName} {userData?.lastName}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Committee Profile</h2>
              <div className="space-y-2">
                <p><strong>Name:</strong> {userData?.firstName} {userData?.lastName}</p>
                <p><strong>Email:</strong> {userData?.email}</p>
                <p><strong>Role:</strong> Committee Member</p>
                <p><strong>Department:</strong> Cultural Committee</p>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Event Management</h2>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 p-3 rounded hover:bg-blue-700">
                  Create Event
                </button>
                <button className="w-full bg-green-600 p-3 rounded hover:bg-green-700">
                  Manage Events
                </button>
                <button className="w-full bg-purple-600 p-3 rounded hover:bg-purple-700">
                  View Registrations
                </button>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
              <div className="space-y-2 text-sm">
                <p><strong>Total Events:</strong> 0</p>
                <p><strong>Active Registrations:</strong> 0</p>
                <p><strong>Pending Approvals:</strong> 0</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 