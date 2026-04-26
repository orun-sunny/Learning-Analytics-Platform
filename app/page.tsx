"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserCircle, Briefcase } from "lucide-react";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans tracking-tight">
        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-1000">
          <div className="w-[120px] h-10 relative">
            <Image
              src="/assets/phlogo.svg"
              alt="Programming Hero"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <h1 className="text-2xl font-bold text-slate-800">
              Programming Hero
            </h1>
            <div className="w-12 h-1 bg-[#6633FF] rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-6 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col md:flex-row min-h-[480px] border border-gray-100">
        {/* Left Side: Branding */}
        <div className="md:w-1/2 p-12 bg-[#6633FF] flex flex-col justify-center items-center text-center">
          <div className="w-[120px] h-10 relative mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Image
              src="/assets/phlogo.svg"
              alt="Programming Hero"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Assignment & Learning Analytics Platform
          </h1>
          <p className="text-white/80 text-base leading-relaxed max-w-[280px]">
            Bridge the gap between instruction and evaluation.
          </p>
        </div>

        {/* Right Side: Selection */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center bg-white">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-2xl font-bold text-slate-800">
              Select your portal
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Access your respective dashboard below
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Link
              href="/instructor/login"
              className="group flex items-center p-5 border-2 border-gray-100 rounded-xl hover:border-[#6633FF] hover:bg-[#6633FF]/5 transition-all duration-200"
            >
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-[#6633FF] transition-colors">
                <Briefcase className="w-6 h-6 text-slate-400 group-hover:text-white" />
              </div>
              <div className="ml-4">
                <span className="block text-slate-700 font-bold text-base group-hover:text-[#6633FF]">
                  Instructor Login
                </span>
                <span className="block text-slate-400 text-xs">
                  Manage tests & candidates
                </span>
              </div>
            </Link>

            <Link
              href="/candidate/login" // Update the path to match your candidate login route
              className="group flex items-center p-5 border-2 border-gray-100 rounded-xl hover:border-[#6633FF] hover:bg-[#6633FF]/5 transition-all duration-200"
            >
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-[#6633FF] transition-colors">
                <UserCircle className="w-6 h-6 text-slate-400 group-hover:text-white" />
              </div>
              <div className="ml-4">
                <span className="block text-slate-700 font-bold text-base group-hover:text-[#6633FF]">
                  Candidate Login
                </span>
                <span className="block text-slate-400 text-xs">
                  Take assessment tests
                </span>
              </div>
            </Link>
          </div>

          {/* Professional Branding */}
          <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-center gap-3">
            <span className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">
              Powered By
            </span>
            <div className="w-16 h-4 relative opacity-60">
              <Image
                src="/assets/phlogo.svg"
                alt="Programming Hero Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
