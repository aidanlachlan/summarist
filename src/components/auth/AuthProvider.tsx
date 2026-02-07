"use client";

import { useEffect } from "react";
import { initAuth } from "@/lib/auth";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initAuth();
  }, []);

  return <>{children}</>;
}