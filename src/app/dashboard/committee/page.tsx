"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/components/AuthContext";
import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function CommitteeDashboard() {
  const { userData } = useAuth();
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [sapId, setSapId] = useState("");
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const handleLogout = async () => {
    const { error } = await logout();
    if (!error) {
      router.push("/verification");
    } else {
      alert("Logout failed: " + error);
    }
  };

  const handleSearch = () => {
    if (!sapId.trim()) {
      alert("Please enter a SAP ID");
      return;
    }
    // TODO: Implement search functionality
    console.log("Searching for SAP ID:", sapId);
    // Here you would typically search for the user in your database
    alert(`Searching for SAP ID: ${sapId}`);
  };

  const handleScanQR = () => {
    setShowQRScanner(true);
  };

  const handleQRScanSuccess = (decodedText: string) => {
    console.log("QR Code scanned:", decodedText);
    
    // Try to extract SAP ID from the QR code
    // Assuming the QR code contains the SAP ID directly or in a JSON format
    try {
      // First, try to parse as JSON
      const parsed = JSON.parse(decodedText);
      if (parsed.sapId || parsed.sapNumber) {
        setSapId(parsed.sapId || parsed.sapNumber);
      } else {
        setSapId(decodedText);
      }
    } catch {
      // If not JSON, assume it's the SAP ID directly
      setSapId(decodedText);
    }
    
    // Stop scanning and close modal
    stopScanner();
    setShowQRScanner(false);
    
    // Automatically trigger search with the scanned SAP ID
    setTimeout(() => {
      handleSearch();
    }, 500);
  };

  const handleQRScanError = (error: any) => {
    // Ignore errors during scanning, they're normal
    console.log("QR Scan error:", error);
  };

  const startScanner = () => {
    if (scannerRef.current) return;
    
    setScanning(true);
    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      false
    );
    
    scannerRef.current.render(handleQRScanSuccess, handleQRScanError);
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setScanning(false);
  };

  const closeQRScanner = () => {
    stopScanner();
    setShowQRScanner(false);
  };

  // Cleanup scanner on component unmount
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  // Start scanner when modal opens
  useEffect(() => {
    if (showQRScanner) {
      setTimeout(() => {
        startScanner();
      }, 100);
    }
  }, [showQRScanner]);

  // Initials Of Profile Photo
  const getInitials = () => {
    if (!userData?.firstName || !userData?.lastName) return "C";
    return `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <ProtectedRoute requiredRole="committee">

      <div className="min-h-screen bg-white">
        {/* Header */}
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
          
          <h1 className="text-lg font-bold text-black w-full text-center py-2">Committee</h1>

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
        <main className="px-4 py-6 space-y-30">
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

          {/* SAP ID Search Input */}
          <div className="space-y-6">
            <div className="w-full flex items-center justify-center">
              
              <div className="relative w-50">
                <input
                  type="number"
                  placeholder="SAP Number"
                  value={sapId}
                  onChange={(e) => setSapId(e.target.value)}
                  className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-black focus:border-transparent"
                />
                
                <button 
                  onClick={handleSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>


            {/* Buttons */}
            <div className="w-full flex items-center justify-center">
              <div className="space-y-3">
                <button
                  onClick={handleSearch}
                  className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  Search
                </button>
                
                <button
                  onClick={handleScanQR}
                  className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                >
                  Scan QR
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* QR Scanner Modal */}
        {showQRScanner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 mx-4 max-w-md w-full">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-bold text-black">Scan QR Code</h3>
                <p className="text-sm text-gray-600">
                  Point your camera at the QR code to scan
                </p>
                
                {/* QR Scanner Container */}
                <div id="qr-reader" className="w-full"></div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={closeQRScanner}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 