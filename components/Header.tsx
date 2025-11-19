"use client";

import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { CircleDollarSign } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { usePathname } from "next/navigation";

function Header() {

    const pathname = usePathname()
    const isHomePage = pathname === "/"



  return (
    <div className={`p-4 flex justify-between items-center ${
        isHomePage ? "bg-blue-50" : "bg-white border-b border-blue-50"
    }`}>
      <Link href={"/"} className="flex items-center">
        <h1 className="text-xl font-semibold">ReciptIT</h1>
        <CircleDollarSign className="w-6 h-6 text-primary" />
      </Link>

      <div className="flex items-center space-x-4">
        <SignedIn>

            <Link href='/receipts'>
                <Button variant={"outline"}>My Recipts</Button>
            </Link>
            <Link href='/manage-plans'>
                <Button >Manage Plans</Button>
            </Link>



            <UserButton />
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
            <Button>Login</Button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  );
}

export default Header;
