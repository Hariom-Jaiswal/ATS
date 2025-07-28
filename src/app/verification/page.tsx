"use client";

import { useState, FormEvent } from "react";
import { auth, db } from "@/firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";

export default function LoginPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [sapNumber, setSapNumber] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validateSAP = (sap: string) => {
    return sap.length >= 8 && /^[0-9]+$/.test(sap);
  };

  const redirectUserByRole = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role || "user";
        
        if (role === "admin") {
          window.location.href = "/dashboard/admin";
        } else if (role === "committee") {
          window.location.href = "/dashboard/committee";
        } else {
          window.location.href = "/dashboard/user";
        }
      } else {
        window.location.href = "/dashboard/user";
      }
    } catch (error) {
      console.error("Error getting user data:", error);
      window.location.href = "/dashboard/user";
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!validateEmail(email)) {
        throw new Error("Please enter a valid email address");
      }

      if (!validatePassword(password)) {
        throw new Error("Password must be at least 6 characters long");
      }

      if (tab === "signup") {
        if (!firstName.trim() || !lastName.trim()) {
          throw new Error("First name and last name are required");
        }

        if (!birthDate) {
          throw new Error("Birth date is required");
        }

        if (!validatePhone(phone)) {
          throw new Error("Please enter a valid 10-digit phone number");
        }

        if (!validateSAP(sapNumber)) {
          throw new Error("Please enter a valid SAP number (at least 8 digits)");
        }
      }

      if (tab === "login") {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Logged in:", userCredential.user);
        
        await redirectUserByRole(userCredential.user.uid);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          birthDate,
          phone,
          sapNumber,
          email: email.toLowerCase(),
          uid: user.uid,
          createdAt: new Date().toISOString(),
          role: "user", 
        });

        alert("Signup successful! Please log in.");
        setTab("login");
        
        setEmail("");
        setPassword("");
        setFirstName("");
        setLastName("");
        setBirthDate("");
        setPhone("");
        setSapNumber("");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      
      
      if (error.code === "auth/user-not-found") {
        setError("No account found with this email. Please sign up.");
        setTab("signup");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (error.code === "auth/email-already-in-use") {
        setError("An account with this email already exists. Please log in.");
        setTab("login");
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak. Please choose a stronger password.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError(error.message || "An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center bg-black">
      <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-lg w-full max-w-sm p-6 z-10 relative text-black">
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-black">Annual Talent Search</h1>
          <p className="text-sm text-gray-600">Mithibai Cultural Committee</p>
        </div>

        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        
        <div className="flex mb-4">
          {["login", "signup"].map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t as "login" | "signup");
                setError("");
              }}
              className={`flex-1 py-2 ${
                tab === t
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === "signup" && (
            <>
              <input
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <input
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <input
                type="tel"
                placeholder="Phone (10 digits)"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                required
                maxLength={10}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <input
                type="text"
                placeholder="SAP Number"
                value={sapNumber}
                onChange={(e) => setSapNumber(e.target.value.replace(/\D/g, ''))}
                required
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />

          {tab === "login" && (
            <div className="text-right">
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </a>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : (tab === "login" ? "Log In" : "Sign Up")}
          </button>
        </form>
      </div>
    </div>
  );
}
