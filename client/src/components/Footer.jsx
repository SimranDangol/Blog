/* eslint-disable no-unused-vars */
import React from "react";
import { PiCopyrightThin } from "react-icons/pi";

export default function Footer() {
  return (
    <footer className="text-white dark:bg-gray-950 dark:text-gray-100 ">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="pt-6 mt-8 text-sm text-center text-gray-400 border-t dark:text-gray-500 border-t-slate-200 dark:border-t-slate-800">
          <p className="flex items-center justify-center space-x-2 ">
            <PiCopyrightThin />
            <span>All rights reserved.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
