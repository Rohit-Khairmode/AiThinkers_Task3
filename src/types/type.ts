import { Dispatch, SetStateAction } from "react";

export type Priority = "lessImportant" | "important" | "veryImportant";

export type Todo = {
  id: string;
  title: string;
  createdAt: string;
  description: string;
  priority: Priority;
  isCompleted: boolean;
};

export interface User {
  userName: string;
  todos: Todo[];
}

export interface ServerUser extends User {
  password: string;
}

export type AuthError = {
  userName?: string;
  password?: string;
  type?: string;
  credentials?: string;
  method?: string;
};
export type AuthInputs = {
  userName: string;
  password: string;
  type: string;
};
export type AuthContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
};
