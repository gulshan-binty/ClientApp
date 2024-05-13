"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Sidebar from "./components/sidebar";
import { ReactQueryProvider } from "./react-query-provider";
import { redirect, usePathname, useRouter } from "next/navigation";
const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  // Check if the current route is the login page
  const isLoginPage = pathname === "/login";
  const isSignupPage = pathname === "/signup";
  const ismainpage = pathname === "/";

  return (
    <html lang="en">
      <body className={cn("bg-gray-50 flex w-full", inter.className)}>
        <ReactQueryProvider>
          {!isLoginPage && !isSignupPage && !ismainpage && <Sidebar />}
          <div
            className={
              isLoginPage || isSignupPage || ismainpage ? "flex-1" : "flex-1"
            }
          >
            {children}
          </div>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
