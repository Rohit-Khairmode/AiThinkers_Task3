"use client";

import { useAuth } from "@/context/AuthContext";
import { AuthError, AuthResponse, User } from "@/types";
import { authSchema } from "@/types/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
export default function AuthForm() {
  const { setUser } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    type: "register",
  });

  const [error, setError] = useState<AuthError | null>(null);
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationResult = authSchema.safeParse(formData);
    if (!validationResult.success) {
      const errorObj = validationResult.error.format();

      setError({
        userName: errorObj.userName?._errors[0],
        password: errorObj.password?._errors[0],
      });
      return;
    }

    let res = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    const data: AuthResponse = await res.json();

    if (res.status === 400 || res.status === 401 || res.status === 405) {
      setError({ ...data });
      return;
    }

    setError(null);
    toast.success(
      `${
        formData.type === "register" ? "Registered" : "Logged in"
      } successfully!`
    );
    setUser(data as User);
    router.replace("/dashboard");
  };

  return (
    <div className="bg-background text-text p-6 max-w-md mx-auto mt-10 border border-border rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center">
        {formData.type === "register" ? "Register" : "Login"}
      </h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-lg font-medium">Username</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            className="w-full p-2 border border-border bg-background text-text rounded"
            placeholder="Enter userName"
          />
        </div>
        {error?.userName && (
          <p className="text-error text-base">{error.userName}</p>
        )}

        <div className="mb-4">
          <label className="block text-lg font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-border bg-background text-text rounded"
            placeholder="Enter password"
          />
        </div>

        {(error?.credentials || error?.password) && (
          <p className="text-error text-base">
            {error.credentials || error.password}
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded mt-4"
        >
          {formData.type === "register" ? "Register" : "Login"}
        </button>

        <p
          onClick={() => {
            setFormData((prev) => ({
              ...prev,
              type: prev.type === "register" ? "login" : "register",
            }));
            setError(null);
          }}
          className="text-base text-primary mt-3 text-center cursor-pointer"
        >
          {formData.type === "register"
            ? "Already have an account? Login"
            : "New user? Register"}
        </p>
      </form>
    </div>
  );
}
