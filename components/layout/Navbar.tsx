"use client";
import React from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div
        className="w-[90px] h-6 relative cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() =>
          router.push(
            isAuthenticated
              ? user?.role === "instructor"
                ? "/employer/dashboard"
                : "/candidate/dashboard"
              : "/",
          )
        }
      >
        <Image
          src="/assets/phlogo.svg"
          alt="Phero Logo"
          fill
          className="object-contain"
        />
      </div>

      {isAuthenticated && user && (
        <div className="flex items-center gap-4">
          <div className="flex flex-col text-right">
            <span className="text-sm font-semibold text-gray-900">
              {user.name}
            </span>
            <span className="text-xs text-gray-500 capitalize">
              {user.role} Panel
            </span>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#6633FF]/10 flex items-center justify-center text-[#6633FF]">
            <UserIcon size={20} />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-600"
          >
            <LogOut size={20} />
          </Button>
        </div>
      )}
    </nav>
  );
};
