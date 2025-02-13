"use client";
import Navbar from "@/components/NavBar";
import TodoList from "@/components/ToDoList";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function page() {
  const { user } = useAuth();
  const [todos, setTodos] = useState(user?.todos || []);
  const router = useRouter();
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
