"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  console.log("user");

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    console.log("User logged out");
    setUser(null);
    router.push("/"); // Redirect to login page
  };

  return (
    <nav className="bg-white dark:bg-gray-900 text-black dark:text-white border-b border-gray-300 dark:border-gray-700 p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* App Name */}
        <h1 className="text-2xl font-bold">ToDoList</h1>

        {/* Right Section - Dark Mode, User, Logout */}
        <div className="flex items-center gap-4">
          {/* Dark Mode Button */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {/* User Initials */}
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600 text-lg font-semibold">
            {user?.userName[0].toUpperCase()}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
