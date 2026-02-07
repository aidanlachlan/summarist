import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import AuthModal from "@/components/auth/AuthModal";
import AuthProvider from "@/components/auth/AuthProvider";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Summarist",
  description: "Gain more knowledge in less time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <AuthProvider>
          {children}
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
