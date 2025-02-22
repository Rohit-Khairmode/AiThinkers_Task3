"use client";
import Navbar from "@/components/NavBar";
import TodoList from "@/components/ToDoList";
import { useAuth } from "@/context/AuthContext";
import { AuthContextType, Todo } from "@/types/type";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function page() {
  const authContextRespone: AuthContextType | null = useAuth();
  if (!authContextRespone) throw new Error("Problem in context");
  const { user }: AuthContextType = authContextRespone;
  const [todos, setTodos] = useState<Todo[]>(user?.todos || []);
  const router: AppRouterInstance = useRouter();
  useEffect(() => {
    if (!user) {
      router.replace("/");
      return;
    }
    setTodos(user?.todos);
  }, [user]);

  if (!user) {
    return null;
  }
  return (
    <>
      <Navbar />
      <TodoList todos={todos} setTodos={setTodos} userName={user.userName} />
    </>
  );
}

export default page;
