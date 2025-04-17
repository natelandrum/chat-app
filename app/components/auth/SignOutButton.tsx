"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <div className="flex w-full justify-center md:justify-end items-center mt-2 md:mt-0">
      <button 
        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-1 px-3 md:py-2 md:px-6 rounded-md text-sm md:text-base transition-colors" 
        onClick={() => signOut()}
      >
        Sign Out
      </button>
    </div>
  );
}