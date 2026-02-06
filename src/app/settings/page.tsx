"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import SearchBar from "@/components/layout/SearchBar";
import { useAuthStore } from "@/store/authStore";

export default function SettingsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const openModal = useAuthStore((state) => state.openModal);
  const subscriptionStatus = useAuthStore((state) => state.subscriptionStatus);
  const subscriptionLoading = useAuthStore((state) => state.subscriptionLoading);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogin = () => {
    openModal();
  };

  const handleUpgrade = () => {
    router.push("/choose-plan");
  };

  // Not logged in state
  if (!user) {
    return (
      <>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="relative flex flex-col ml-[200px] w-[calc(100%-200px)] transition-all duration-300 max-md:ml-0 max-md:w-full min-h-screen">
          <SearchBar onMenuClick={() => setSidebarOpen(true)} />

          {/* Container */}
          <div className="w-full px-10">
            {/* Row */}
            <div className="max-w-[1070px] w-full mx-auto py-10 px-6">
              <h1 className="text-3xl font-bold text-[#032b41] mb-4 pb-4 border-b border-[#e1e7ea]">
                Settings
              </h1>

              <div className="flex flex-col items-center justify-center py-12">
                <figure className="max-w-[400px] mb-6">
                  <Image
                    src="/login.png"
                    alt="Login"
                    width={400}
                    height={300}
                    className="w-full"
                  />
                </figure>
                <p className="text-[#032b41] text-lg font-bold mb-6">
                  Log in to your account to see your details.
                </p>
                <button
                  onClick={handleLogin}
                  className="bg-[#2bd97c] text-[#032b41] font-semibold px-12 py-3 rounded cursor-pointer hover:bg-[#20ba68] transition-colors min-w-[180px]"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Loading state
  if (subscriptionLoading) {
    return (
      <>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="relative flex flex-col ml-[200px] w-[calc(100%-200px)] transition-all duration-300 max-md:ml-0 max-md:w-full min-h-screen">
          <SearchBar onMenuClick={() => setSidebarOpen(true)} />
          <div className="flex-1 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#032b41] border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </>
    );
  }

  // Logged in state
  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="relative flex flex-col ml-[200px] w-[calc(100%-200px)] transition-all duration-300 max-md:ml-0 max-md:w-full min-h-screen">
        <SearchBar onMenuClick={() => setSidebarOpen(true)} />

        {/* Container */}
        <div className="w-full px-10">
          {/* Row */}
          <div className="max-w-[1070px] w-full mx-auto py-10 px-6">
            <h1 className="text-3xl font-bold text-[#032b41] mb-4 pb-4 border-b border-[#e1e7ea]">
              Settings
            </h1>

            {/* Subscription Plan */}
            <div className="py-6 border-b border-[#e1e7ea]">
              <h2 className="font-bold text-[#032b41] mb-1">
                Your Subscription plan
              </h2>
              <p className="text-[#394547]">{subscriptionStatus}</p>

              {subscriptionStatus === "basic" && (
                <button
                  onClick={handleUpgrade}
                  className="mt-4 bg-[#2bd97c] text-[#032b41] font-semibold px-6 py-2 rounded cursor-pointer hover:bg-[#20ba68] transition-colors"
                >
                  Upgrade to Premium
                </button>
              )}
            </div>

            {/* Email */}
            <div className="py-6">
              <h2 className="font-bold text-[#032b41] mb-1">Email</h2>
              <p className="text-[#394547]">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}