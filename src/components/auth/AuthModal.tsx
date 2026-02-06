"use client";

import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineUser } from "react-icons/ai";
import Image from "next/image";
import { loginUser, registerUser, guestLogin } from "@/lib/auth";

export default function AuthModal() {
  const isModalOpen = useAuthStore((state) => state.isModalOpen);
  const closeModal = useAuthStore((state) => state.closeModal);
  const setUser = useAuthStore((state) => state.setUser);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      let userCredential;

      if (isLogin) {
        userCredential = await loginUser(email, password);
      } else {
        userCredential = await registerUser(email, password);
      }

      setUser(userCredential.user);
      closeModal();
      router.push("/for-you");
    } catch (err: unknown) {
      // Firebase error handling
      const firebaseError = err as { code?: string };
      const errorCode = firebaseError.code;

      if (errorCode === "auth/invalid-email") {
        setError("Invalid email address");
      } else if (errorCode === "auth/weak-password") {
        setError("Password should be at least 6 characters");
      } else if (errorCode === "auth/user-not-found") {
        setError("User not found");
      } else if (errorCode === "auth/wrong-password") {
        setError("Incorrect password");
      } else if (errorCode === "auth/invalid-credential") {
        setError("Invalid email or password");
      } else if (errorCode === "auth/email-already-in-use") {
        setError("Email already in use");
      } else if (errorCode === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else if (errorCode === "auth/network-request-failed") {
        setError("Network error. Check your connection.");
      } else if (errorCode === "auth/missing-password") {
        setError("Please enter a password");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError("");
    setIsLoading(true);

    try {
      const userCredential = await guestLogin();
      setUser(userCredential.user);
      closeModal();
      router.push("/for-you");
    } catch {
      setError("Guest login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isModalOpen) return null;

  return (
    <div
      className="auth__wrapper fixed inset-0 bg-black/75 flex justify-center items-center flex-col z-9999"
      onClick={closeModal}
    >
      <div
        className="auth relative w-full max-w-100 bg-white rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.2)] z-9999"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="auth__content pt-12 px-8 pb-6">
          <div className="text-center text-xl font-bold text-[#032b41] mb-6">
            {isLogin ? "Log in to Summarist" : "Sign up for Summarist"}
          </div>

          {isLogin && (
            <>
              <button
                onClick={handleGuestLogin}
                disabled={isLoading}
                className="relative flex bg-[#3a579d] text-white justify-center w-full h-10 rounded text-base transition-colors duration-200 items-center min-w-45 cursor-pointer hover:bg-[#25396b]"
              >
                <figure className="flex items-center justify-center w-9 h-9 rounded bg-white absolute left-0.5">
                  <AiOutlineUser size={24} color="#3a579d" />
                </figure>
                {isLoading ? "Loading..." : "Login as a Guest"}
              </button>

              <div className="flex items-center gap-4 my-4">
                <span className="h-px bg-gray-300 flex-1"></span>
                <span className="mx-6 text-sm text-[#394547] font-medium">
                  or
                </span>
                <span className="h-px bg-gray-300 flex-1"></span>
              </div>
            </>
          )}

          <button className="relative flex bg-[#4285f4] text-white justify-center w-full h-10 rounded text-base transition-colors duration-200 items-center min-w-45 cursor-pointer hover:bg-[#3367d6]">
            <figure className="flex items-center justify-center w-9 h-9 rounded bg-white absolute left-0.5">
              <Image src="/google.png" alt="Google" width={24} height={24} />
            </figure>
            <div>{isLogin ? "Login with Google" : "Sign up with Google"}</div>
          </button>

          <div className="flex items-center gap-4 my-4">
            <span className="h-px bg-gray-300 flex-1"></span>
            <span className="mx-6 text-sm text-[#394547] font-medium">or</span>
            <span className="h-px bg-gray-300 flex-1"></span>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 border-2 border-[#bac8ce] rounded text-[#394547] px-3 outline-none focus:border-[#2bd97c]"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 border-2 border-[#bac8ce] rounded text-[#394547] px-3 outline-none focus:border-[#2bd97c]"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#2bd97c] text-[#032b41] w-full h-10 rounded text-base transition-colors duration-200 flex items-center justify-center min-w-45 cursor-pointer hover:bg-[#20ba68]"
            >
              {isLoading ? "Loading..." : isLogin ? "Login" : "Sign up"}
            </button>
          </form>
        </div>

        {isLogin && (
          <div className="text-center text-[#116be9] font-light text-sm w-fit mx-auto mb-4 cursor-pointer hover:text-[#124a98]">
            Forgot your password?
          </div>
        )}

        <button
          className="h-10 text-center bg-[#f1f6f4] text-[#116be9] w-full rounded-b font-light text-base hover:bg-[#e1e9e8]"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Don't have an account?" : "Already have an account?"}
        </button>

        <div
          className="absolute top-4 right-4 text-2xl cursor-pointer"
          onClick={closeModal}
        >
          ×
        </div>
      </div>
    </div>
  );
}
