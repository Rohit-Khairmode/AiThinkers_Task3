"use client";

import { useAuth } from "@/context/AuthContext";
import { AuthContextType } from "@/types/type";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const authContextRespone: AuthContextType | null = useAuth();
  if (!authContextRespone) throw new Error("Problem in context");
  const { user, setUser }: AuthContextType = authContextRespone;
  const [darkMode, setDarkMode] = useState<boolean>(false);

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
    <nav className="bg-background text-text border-b border-border p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">ToDoList</h1>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200  hover:bg-gray-300 "
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-background text-lg font-semibold">
            {user?.userName[0].toUpperCase()}
          </div>

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
