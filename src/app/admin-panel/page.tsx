"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import { auth, db } from "@/firebase/config";
import { doc, updateDoc, collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AdminPanel() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    
    if (userData?.role !== "admin") {
      router.push("/verification");
      return;
    }

    
    loadUsers();
  }, [userData, router]);

  const loadUsers = async () => {
    try {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    setUpdating(userId);
    try {
      await updateDoc(doc(db, "users", userId), {
        role: newRole,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.uid
      });
      
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
      
      alert("User role updated successfully!");
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Failed to update user role");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (userData?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Panel - User Management</h1>
          <div className="flex items-center space-x-4">
            <span>Welcome, {userData?.firstName} {userData?.lastName}</span>
            <button
              onClick={() => router.push("/dashboard/admin")}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">Manage User Roles</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">SAP Number</th>
                  <th className="text-left p-3">Current Role</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-700">
                    <td className="p-3">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.sapNumber}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.role === 'admin' ? 'bg-red-600' :
                        user.role === 'committee' ? 'bg-yellow-600' :
                        'bg-green-600'
                      }`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={user.role || 'user'}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        disabled={updating === user.id}
                        className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                      >
                        <option value="user">User</option>
                        <option value="committee">Committee</option>
                        <option value="admin">Admin</option>
                      </select>
                      {updating === user.id && (
                        <span className="ml-2 text-xs text-gray-400">Updating...</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
} 