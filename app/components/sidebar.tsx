import { FileClock, LayoutDashboard, LogOut, User, Users } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import React from "react";
usePathname;
const Sidebar = () => {
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false, callbackUrl: "/" });
      router.push("/");
    } catch (error) {
      console.error("Error occurred during sign-out:", error);
    }
  };
  const currentpath = usePathname();
  return (
    <div className="w-72 bg-gray-200 sm:w-52 ">
      <nav className="flex flex-col gap-7 mx-8 mt-16 text-lg text-gray-500">
        <li
          className={
            currentpath === "/dashboard"
              ? "text-white p-2 border-none rounded-md bg-indigo-400 list-none"
              : "list-none"
          }
        >
          <Link
            href="/dashboard"
            className="transition-all duration-700 flex items-center gap-3 border-none "
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </li>
        <li
          className={
            currentpath === "/clientTable"
              ? "text-white p-2 border-none rounded-md bg-indigo-400 list-none"
              : "list-none"
          }
        >
          <Link
            href="/clientTable"
            className="transition-all duration-700 flex items-center gap-3 border-none "
          >
            <Users className="h-4 w-4" />
            Clients
          </Link>
        </li>
        <li
          className={
            currentpath === "/employeeTable"
              ? "text-white p-2 border-none rounded-md bg-indigo-400 list-none"
              : "list-none"
          }
        >
          <Link
            href="/employeeTable"
            className="transition-all duration-700 flex items-center gap-3 border-none"
          >
            <User className="h-4 w-4" />
            Employee
          </Link>
        </li>
        <li
          className={
            currentpath === "/activeTable"
              ? "text-white p-2 border-none rounded-md bg-indigo-400 list-none"
              : "list-none"
          }
        >
          <Link
            href="/activeTable"
            className="transition-all duration-700 flex items-center gap-3 border-none"
          >
            <FileClock className="h-4 w-4" />
            History
          </Link>
        </li>
        <li className={"text-gray-500 border-none rounded-md  list-none"}>
          <Link
            href="/"
            onClick={handleSignOut}
            className="transition-all duration-700 flex items-center gap-3 border-none"
          >
            <LogOut className="h-4 w-4" />
            logout
          </Link>
        </li>
      </nav>
    </div>
  );
};

export default Sidebar;
