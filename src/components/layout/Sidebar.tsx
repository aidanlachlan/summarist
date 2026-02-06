"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { logoutUser } from "@/lib/auth";
import { AiOutlineHome, AiOutlineSearch } from "react-icons/ai";
import { BsBookmark } from "react-icons/bs";
import { RiPencilLine } from "react-icons/ri";
import { FiSettings, FiHelpCircle, FiLogIn, FiLogOut } from "react-icons/fi";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const openModal = useAuthStore((state) => state.openModal);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
  };

  const handleLoginClick = () => {
    openModal();
    onClose();
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-[#3a4649] transition-opacity duration-400 z-10 ${
          isOpen ? "opacity-65 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`bg-[#f7faf9] w-50 min-w-50 fixed top-0 left-0 h-screen z-1000 transition-all duration-300 max-md:-translate-x-full ${
          isOpen ? "max-md:translate-x-0 max-md:w-4/5" : ""
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-15 pt-4 max-w-40 mx-auto">
          <Image src="/logo.png" alt="Logo" width={160} height={40} />
        </div>

        {/* Wrapper */}
        <div className="flex flex-col justify-between h-[calc(100vh-60px)] pb-5 overflow-y-auto">
          {/* Top Links */}
          <div className="flex-1 mt-10">
            <Link
              href="/for-you"
              className="flex items-center h-14 text-[#032b41] mb-2 cursor-pointer hover:bg-[#f0efef]"
            >
              <div
                className={`w-1.25 h-full mr-4 ${
                  isActive("/for-you") ? "bg-[#2bd97c]" : "bg-transparent"
                }`}
              />
              <div className="flex items-center justify-center mr-2">
                <AiOutlineHome className="w-6 h-6" />
              </div>
              <div className="text-sm">For you</div>
            </Link>

            <Link
              href="/library"
              className="flex items-center h-14 text-[#032b41] mb-2 cursor-pointer hover:bg-[#f0efef]"
            >
              <div
                className={`w-1.25 h-full mr-4 ${
                  isActive("/library") ? "bg-[#2bd97c]" : "bg-transparent"
                }`}
              />
              <div className="flex items-center justify-center mr-2">
                <BsBookmark className="w-6 h-6" />
              </div>
              <div className="text-sm">My Library</div>
            </Link>

            <div className="flex items-center h-14 text-[#032b41] mb-2 cursor-not-allowed">
              <div className="w-1.25 h-full mr-4 bg-transparent" />
              <div className="flex items-center justify-center mr-2">
                <RiPencilLine className="w-6 h-6" />
              </div>
              <div className="text-sm">Highlights</div>
            </div>

            <div className="flex items-center h-14 text-[#032b41] mb-2 cursor-not-allowed">
              <div className="w-1.25 h-full mr-4 bg-transparent" />
              <div className="flex items-center justify-center mr-2">
                <AiOutlineSearch className="w-6 h-6" />
              </div>
              <div className="text-sm">Search</div>
            </div>
          </div>

          {/* Bottom Links */}
          <div>
            <Link
              href="/settings"
              className="flex items-center h-14 text-[#032b41] mb-2 cursor-pointer hover:bg-[#f0efef]"
            >
              <div
                className={`w-1.25 h-full mr-4 ${
                  isActive("/settings") ? "bg-[#2bd97c]" : "bg-transparent"
                }`}
              />
              <div className="flex items-center justify-center mr-2">
                <FiSettings className="w-6 h-6" />
              </div>
              <div className="text-sm">Settings</div>
            </Link>

            <div className="flex items-center h-14 text-[#032b41] mb-2 cursor-not-allowed">
              <div className="w-1.25 h-full mr-4 bg-transparent" />
              <div className="flex items-center justify-center mr-2">
                <FiHelpCircle className="w-6 h-6" />
              </div>
              <div className="text-sm">Help & Support</div>
            </div>

            {user ? (
              <div
                onClick={handleLogout}
                className="flex items-center h-14 text-[#032b41] cursor-pointer hover:bg-[#f0efef]"
              >
                <div className="w-1.25 h-full mr-4 bg-transparent" />
                <div className="flex items-center justify-center mr-2">
                  <FiLogOut className="w-6 h-6" />
                </div>
                <div className="text-sm">Logout</div>
              </div>
            ) : (
              <div
                onClick={handleLoginClick}
                className="flex items-center h-14 text-[#032b41] cursor-pointer hover:bg-[#f0efef]"
              >
                <div className="w-1.25 h-full mr-4 bg-transparent" />
                <div className="flex items-center justify-center mr-2">
                  <FiLogIn className="w-6 h-6" />
                </div>
                <div className="text-sm">Login</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}