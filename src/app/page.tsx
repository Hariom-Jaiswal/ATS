"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  const handlelogin = () => {
    if (!loading && user && userData) {
      // User is logged in, redirect to appropriate dashboard
      if (userData.role === "admin") {
        router.push("/dashboard/admin");
      } else if (userData.role === "committee") {
        router.push("/dashboard/committee");
      } else {
        router.push("/dashboard/user");
      }
    }
    else{
      router.push("/verification");
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <Image 
          src="/ats.webp" 
          alt="ATS Logo" 
          width={300}
          height={300}
          className="mx-auto mb-6"
          priority
        />
        <h1 className="text-4xl font-bold text-white mb-4">
          Annual Talent Search
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Mithibai Cultural Committee
        </p>
        <button 
          onClick={handlelogin}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Welcome {userData?.firstName}
        </button>
      </div>
    </div>
  );
}
