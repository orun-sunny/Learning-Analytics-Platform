"use client";
import React, { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { ChevronDown, Phone, Mail } from "lucide-react";
import { useUIStore } from "@/store/uiStore";

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { showModal } = useUIStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated && pathname !== "/candidate/login") {
      router.push("/");
    } else if (
      isAuthenticated &&
      user?.role !== "student" &&
      pathname !== "/candidate/login"
    ) {
      router.push("/");
    }
  }, [isAuthenticated, user, router, pathname]);

  if (pathname === "/candidate/login") {
    return <>{children}</>;
  }

  if (pathname.includes("/exam/")) {
    if (!isAuthenticated || user?.role !== "student") return null;
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  if (!isAuthenticated || user?.role !== "student") {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-52 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center self-stretch bg-white py-6 px-6 md:px-20 shadow-[0px_2.7135651111602783px_4px_#C0C0C005]">
        <div className="flex shrink-0 items-center">
          <div
            className="w-[90px] h-6 relative mr-4 md:mr-[100px] cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() =>
              router.push(isAuthenticated ? "/candidate/dashboard" : "/")
            }
          >
            <Image
              src="/assets/phlogo.svg"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col shrink-0 items-start py-[6px]">
            <span className="text-[#130B2C] text-base">Dashboard</span>
          </div>
        </div>
        <div
          className="flex shrink-0 items-center gap-2 cursor-pointer"
          onClick={() => {
            showModal({
              title: "Logout",
              message:
                "Are you sure you want to log out of your student portal?",
              type: "confirm",
              confirmText: "Logout",
              onConfirm: () => {
                logout();
                router.push("/");
              },
            });
          }}
        >
          <div className="flex shrink-0 items-center gap-2">
            <div className="w-10 h-10 relative">
              <Image
                src="/assets/profileicon.png"
                alt="User Profile"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex flex-col shrink-0 items-start hidden md:flex">
              <div className="flex flex-col items-start pb-[1px] mr-[17px]">
                <span className="text-slate-700 text-sm font-bold">
                  {user?.name || "Arif Hossain"}
                </span>
              </div>
              <span className="text-slate-500 text-xs">
                Ref. ID - {user?.id?.substring(0, 8) || "16101121"}
              </span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Dynamic Page Content */}
      <div className="flex-1 w-full mx-auto py-14">{children}</div>

      {/* Footer */}
      <div className="flex flex-col md:flex-row justify-between items-center self-stretch bg-[#130B2C] py-6 px-4 md:px-20 shadow-[0px_2.7135651111602783px_4px_#C0C0C005] mt-auto">
        <div className="flex shrink-0 items-center gap-4">
          <span className="text-white text-base md:text-xl">Powered by</span>
          <div className="w-[116px] h-8 relative">
            <Image
              src="/assets/phlogo.svg"
              alt="Powered by logo"
              fill
              className="object-contain"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row shrink-0 items-center gap-4 md:gap-[18px]">
          <span className="text-white text-base hidden md:block">Helpline</span>
          <div className="flex flex-col md:flex-row shrink-0 items-center gap-4">
            <div className="flex shrink-0 items-center gap-2">
              <Phone className="w-5 h-5 text-white" />
              <span className="text-white text-sm md:text-base">
                +88 0187848555888
              </span>
            </div>
            <div className="flex shrink-0 items-center">
              <Mail className="w-5 h-5 text-white mr-2" />
              <span className="text-white text-sm md:text-base mr-0 md:mr-[35px]">
                support@phero.work
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
