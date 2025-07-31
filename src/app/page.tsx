import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <Image 
          src="/ats.webp" 
          alt="ATS Logo" 
          width={300}
          height={300}
          className="mx-auto mb-6"
        />
        <h1 className="text-4xl font-bold text-white mb-4">
          Annual Talent Search
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Mithibai Cultural Committee
        </p>
        <Link 
          href="/verification"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
