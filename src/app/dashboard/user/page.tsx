"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/components/AuthContext";
import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Event {
  id: string;
  name: string;
  category: string;
}

const events: Event[] = [
  { id: "1", name: "Khatak", category: "Dance" },
  { id: "2", name: "Bharatnatyam", category: "Dance" },
  { id: "3", name: "Bollywood", category: "Dance" },
  { id: "4", name: "One Act", category: "Drama" },
  { id: "5", name: "Mono", category: "Drama" },
  { id: "6", name: "UI/UX", category: "Website" },
];

export default function UserDashboard() {
  const { userData } = useAuth();
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);

  // Load registered events from localStorage on component mount
  useEffect(() => {
    if (userData?.uid) {
      const stored = localStorage.getItem(`registeredEvents_${userData.uid}`);
      if (stored) {
        setRegisteredEvents(JSON.parse(stored));
      }
    }
  }, [userData?.uid]);

  // Get registered events with their details
  const getRegisteredEventsDetails = () => {
    return events.filter(event => registeredEvents.includes(event.id));
  };

  // Logout
  const handleLogout = async () => {
    const { error } = await logout();
    if (!error) {
      router.push("/verification");
    } else {
      alert("Logout failed: " + error);
    }
  };


  // Register Button
  const handleRegisterEvents = () => {
    router.push("/events");
  };

  // Initials Of Profile Photo
  const getInitials = () => {
    if (!userData?.firstName || !userData?.lastName) return "U";
    return `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
        
        {/* NavBar */}
        <header className="bg-white border-b border-gray-200 flex px-2 py-2">
          
          {/*Settings Icon*/}
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="py-2"
          >
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          
          <h1 className="text-lg font-bold text-black w-full text-center py-2">Participant</h1>

        </header>

        {/* Logout Button */}
        {showSettings && (
          <div className="absolute top-16 left-4 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-48  hover:bg-red-100">
            <div className="py-2">
              <button
                onClick={handleLogout}
                className="w-full text-center font-bold  text-lg text-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="px-4 py-6 space-y-6">
          
          {/* Profile Section */}
          <div className="text-center space-y-4">
            
            {/* Avatar */}
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {getInitials()}
              </span>
            </div>
            
            {/* User Info */}
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-black">
                {userData?.firstName} {userData?.lastName}
              </h2>
              <p className="text-gray-600 text-sm">
                {userData?.email}
              </p>
              <p className="text-gray-600 text-sm">
                {userData?.sapNumber}
              </p>
            </div>
          </div>

          {/* Enrolled Events */}
          <div className="w-full flex items-center justify-center">
            <div className="w-50 bg-black text-white py-3 px-4 rounded-lg font-medium">
              <p className="text-center">Enrolled Events</p>
            </div>
          </div>

          {/* Events Display Area */}
          <div className="w-full flex items-center justify-center">
            <div className="bg-[#a2a2a25e] border border-black rounded-lg p-4 w-95">
              {getRegisteredEventsDetails().length > 0 ? (
                <div className="space-y-3">
                  {getRegisteredEventsDetails().map((event) => (
                    <div 
                      key={event.id}
                      className="bg-white text-black shadow-xl/30 rounded-lg p-3 flex items-center justify-between"
                    >
                      <span className="font-medium">{event.name}</span>
                      <span className="text-sm bg-black text-white px-2 py-1 rounded">
                        {event.category}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-25">
                  <p className="text-black text-sm">
                    No Events Registered Yet...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Register Button */}
          <div className="w-full flex justify-center">
          <button
            onClick={handleRegisterEvents}
            className="w-50 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-800"
          >
            Register For Events
          </button>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 