"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

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

export default function EventsPage() {
  const router = useRouter();
  const { userData } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
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

  const handleBack = () => {
    router.push("/dashboard/user");
  };

  const handleRegister = (event: Event) => {
    // If already registered, don't show confirmation
    if (registeredEvents.includes(event.id)) {
      return;
    }
    setSelectedEvent(event);
    setShowConfirmation(true);
  };

  const handleConfirmRegistration = () => {
    if (selectedEvent && userData?.uid) {
      // Add to registered events
      const newRegisteredEvents = [...registeredEvents, selectedEvent.id];
      setRegisteredEvents(newRegisteredEvents);
      
      // Save to localStorage
      localStorage.setItem(`registeredEvents_${userData.uid}`, JSON.stringify(newRegisteredEvents));
      
      alert(`Successfully registered for ${selectedEvent.name}!`);
    }
    setShowConfirmation(false);
    setSelectedEvent(null);
  };

  const handleCancelRegistration = () => {
    setShowConfirmation(false);
    setSelectedEvent(null);
  };

  const getEventsByCategory = () => {
    const categories = ["Dance", "Drama", "Website"];
    return categories.map(category => ({
      category,
      events: events.filter(event => event.category === category)
    }));
  };

  const isEventRegistered = (eventId: string) => {
    return registeredEvents.includes(eventId);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button 
          onClick={handleBack}
          className="p-2"
        >
          <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h1 className="text-lg font-bold text-black">Events 2025-26</h1>
        
        <div className="w-10"></div> {/* Spacer for centering */}
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        <div className="space-y-6">
          {getEventsByCategory().map(({ category, events: categoryEvents }) => (
            <div key={category} className="space-y-3">
              {/* Category Header */}
              <button className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium">
                {category}
              </button>
              
              {/* Events in Category */}
              <div className="space-y-2">
                {categoryEvents.map((event) => {
                  const isRegistered = isEventRegistered(event.id);
                  return (
                    <div 
                      key={event.id} 
                      className="bg-gray-100 rounded-lg p-4 flex items-center justify-between"
                    >
                      <span className="text-black font-medium">{event.name}</span>
                      <button
                        onClick={() => handleRegister(event)}
                        disabled={isRegistered}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          isRegistered 
                            ? 'bg-gray-400 text-white cursor-not-allowed' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isRegistered ? 'Selected' : 'Register'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Confirmation Popup */}
      {showConfirmation && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 mx-4 max-w-sm w-full">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-bold text-black">"Confirm"</h3>
              <p className="text-black">
                You are registering
              </p>
              <p className="text-black font-medium">
                for {selectedEvent.name}?
              </p>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleConfirmRegistration}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={handleCancelRegistration}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 