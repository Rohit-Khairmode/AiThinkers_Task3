export type Priority = "less important" | "important" | "very important";

export type Todo = {
  id: string;
  title: string;
  createdAt: string;
  description: string;
  priority: Priority;
  isCompleted: boolean;
};

export type User = {
  userName: string;
  password: string;
  todos: Todo[];
};

export type AuthError = {
  userName?: string;
  password?: string;
  type?: string;
  credentials?: string;
  method?: string;
};

export type AuthResponse = AuthError | { userName: string; todos: Todo[] };
