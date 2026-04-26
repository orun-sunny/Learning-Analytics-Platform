"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Eye, EyeOff, Phone, Mail } from "lucide-react";
import Image from "next/image";
const loginSchema = z.object({
  email: z.string().min(1, "Please enter your email/User ID"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function CandidateLogin() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    //  API call
    setTimeout(() => {
      login({
        id: "stu_" + Math.random().toString(36).substr(2, 9),
        name: "Student",
        email: data.email,
        role: "student",
      });
      setIsLoading(false);
      router.push("/candidate/dashboard");
    }, 800);
  };

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen font-sans">
      <div className="flex flex-col items-center flex-1 w-full">
        {/* Top Header */}
        <div className="flex w-full justify-between items-center bg-white py-6 px-4 md:px-20 mb-8 md:mb-24 shadow-[0px_2.7135651111602783px_4px_#C0C0C005]">
          <div
            className="w-[116px] h-8 relative cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => router.push("/")}
          >
            <Image
              src="/assets/phlogo.svg"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-slate-700 text-xl md:text-2xl font-bold">
            programming Hero
          </span>
          <div className="w-[116px] h-8">
            {/* Empty div for flex balance as in original HTML */}
          </div>
        </div>

        {/* Login Form Container */}
        <div className="flex flex-col flex-1 w-full items-center mb-16 md:mb-[161px] gap-6 px-4">
          <span className="text-slate-700 text-2xl font-bold">
            Student Sign In
          </span>
          <p className="text-slate-500 text-sm text-center max-w-[500px]">
            Access your assignments, track submission progress, and receive
            instructor feedback in real-time.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col w-full max-w-[500px] bg-white py-9 px-6 md:px-8 gap-10 rounded-2xl border border-gray-200"
          >
            <div className="flex flex-col items-start gap-6 w-full">
              <div className="flex flex-col items-start gap-3 w-full">
                <label className="text-slate-700 text-sm font-medium">
                  Email/ User ID
                </label>
                <div
                  className={`flex flex-col w-full bg-white py-3 px-3 rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300"} focus-within:border-[#6633FF]`}
                >
                  <input
                    type="text"
                    placeholder="Enter your email/User ID"
                    className="w-full text-slate-700 text-sm outline-none bg-transparent"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <span className="text-red-500 text-xs">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col items-start gap-2 w-full">
                <div className="flex flex-col items-start gap-3 w-full">
                  <label className="text-slate-700 text-sm font-medium">
                    Password
                  </label>
                  <div
                    className={`flex items-center w-full bg-white p-3 rounded-lg border ${errors.password ? "border-red-500" : "border-gray-300"} focus-within:border-[#6633FF]`}
                  >
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full text-slate-700 text-sm outline-none bg-transparent"
                      {...register("password")}
                    />
                    <div
                      className="relative shrink-0 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                  {errors.password && (
                    <span className="text-red-500 text-xs">
                      {errors.password.message}
                    </span>
                  )}
                </div>
                <div className="w-full flex justify-end">
                  <button
                    type="button"
                    className="text-slate-700 text-sm hover:text-[#6633FF] transition-colors"
                  >
                    Forget Password?
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center w-full bg-[#6633FF] hover:bg-[#5229CC] transition-colors py-3 rounded-xl border-0 disabled:opacity-70"
            >
              <span className="text-white text-base font-bold">
                {isLoading ? "Signing In..." : "Sign In"}
              </span>
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="flex w-full flex-col md:flex-row justify-between items-center bg-[#130B2C] py-6 px-4 md:px-20 shadow-[0px_2.7135651111602783px_4px_#C0C0C005] gap-4 md:gap-0 mt-auto">
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
          <div className="flex flex-col md:flex-row shrink-0 items-center gap-4 md:gap-[19px]">
            <span className="text-white text-base font-medium hidden md:block">
              Helpline
            </span>
            <div className="flex flex-col md:flex-row shrink-0 items-center gap-4 relative">
              <div className="flex shrink-0 items-center gap-2">
                <div className="relative flex items-center justify-center text-white/90">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="text-white text-sm md:text-base">
                  +88 011020202508
                </span>
              </div>
              <div className="flex shrink-0 items-center">
                <div className="mr-2 relative flex items-center justify-center text-white/90">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-white text-sm md:text-base md:mr-[35px]">
                  support@phero.work
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
