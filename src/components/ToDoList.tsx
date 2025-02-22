"use client";

import { priorityColors, priorityOrder } from "@/constants";
import { Priority, Todo } from "@/types/type";
import { useState } from "react";
import toast from "react-hot-toast";

export default function TodoList({
  todos,
  setTodos,
  userName,
}: {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  userName: string;
}) {
  console.log(todos);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<"date" | "priority">("date");

  const sortedTodos = [...todos!].sort((a, b) => {
    if (filter === "date")
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); //this will sort array in descending order

    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTodo: Todo = {
      id: selectedTodo ? selectedTodo.id : Math.random().toString(),
      title: formData.get("title") as string,
      createdAt: selectedTodo
        ? selectedTodo.createdAt
        : new Date().toISOString(),
      description: formData.get("description") as string,
      priority: formData.get("priority") as Priority,
      isCompleted: selectedTodo ? selectedTodo.isCompleted : false,
    };
    const res = await fetch("api/todos", {
      method: "POST",
      body: JSON.stringify({ newTodo, userName }),
    });
    if (res.status !== 200) {
      toast.error("Error While Updating todo");
      return;
    }
    if (selectedTodo) {
      setTodos(
        todos.map((todo) => (todo.id === selectedTodo.id ? newTodo : todo))
      );
    } else {
      setTodos([...todos, newTodo]);
    }

    setIsModalOpen(false);
  };

  const handleToggleComplete = async (id: string): Promise<void> => {
    let todo = todos.find((todo) => todo.id === id);
    if (!todo) {
      toast.error("something went wrong. Todo Cannot be found");
      return;
    }
    console.log("todo", todo);

    todo.isCompleted = !todo?.isCompleted;
    const res = await fetch("api/todos", {
      method: "POST",
      body: JSON.stringify({ newTodo: todo, userName }),
    });
    if (res.status !== 200) {
      toast.error("Error While Updating todo");
      return;
    }

    setTodos(todos.map((todo) => todo));
  };
  const handleDelete = async (id: string): Promise<void> => {
    const res = await fetch("api/todos", {
      method: "DELETE",
      body: JSON.stringify({ id, userName }),
    });
    console.log("asdswdvsdfdf", res);
    if (res.status !== 200) {
      toast.error("Error While Deleting todo");
      return;
    }
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Filter and Add Button */}
      <div className="flex justify-between items-center mb-4">
        <select
          className="p-2 border rounded-md"
          value={filter}
          onChange={(e) => setFilter(e.target.value as "date" | "priority")}
        >
          <option value="date">Sort by Date</option>
          <option value="priority">Sort by Priority</option>
        </select>
        <button
          onClick={() => {
            setSelectedTodo(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Add Todo
        </button>
      </div>

      {/* Todo List */}
      <ul className="space-y-4">
        {sortedTodos.map((todo) => (
          <li
            key={todo.id}
            className="border p-3 rounded-md bg-white shadow-md dark:bg-gray-800"
          >
            <div className="flex items-center gap-2">
              {/* Priority Indicator */}
              <span
                className={`w-3 h-3 rounded-full ${
                  priorityColors[todo.priority]
                } `}
              />

              {/* Checkbox */}
              <input
                type="checkbox"
                checked={todo.isCompleted}
                onChange={() => handleToggleComplete(todo.id)}
                className="mr-2"
              />

              {/* Title & Date */}
              <div
                className="flex-1 cursor-pointer"
                onClick={() =>
                  setSelectedTodo(selectedTodo === todo ? null : todo)
                }
              >
                <h3
                  className={`text-lg text-text font-semibold ${
                    todo.isCompleted ? "line-through" : ""
                  }`}
                >
                  {todo.title}
                </h3>
                <p className="text-text opacity-50 text-sm">
                  {new Date(todo.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Edit & Delete Buttons */}
              <button
                onClick={() => {
                  setSelectedTodo(todo);
                  setIsModalOpen(true);
                }}
                className="text-primary mr-2"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDelete(todo.id)}
                className="text-error"
              >
                🗑
              </button>
            </div>

            {/* Expanded Details */}
            {selectedTodo?.id === todo.id && (
              <div className="mt-2 px-4 py-2 border-t">
                <p className="text-base text-text">
                  Description: {todo.description}
                </p>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md w-96">
            <h2 className="text-lg font-semibold mb-4">
              {selectedTodo ? "Edit Todo" : "Add Todo"}
            </h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                defaultValue={selectedTodo?.title || ""}
                required
                placeholder="Title"
                className="w-full p-2 border mb-2 rounded-md"
              />

              <textarea
                name="description"
                defaultValue={selectedTodo?.description || ""}
                required
                placeholder="Description"
                className="w-full p-2 border mb-2 rounded-md"
              />

              <label className="block text-sm">Priority:</label>
              <select
                name="priority"
                defaultValue={selectedTodo?.priority || "important"}
                className="w-full p-2 border rounded-md mb-4"
              >
                <option value="lessImportant">Less Important</option>
                <option value="important">Important</option>
                <option value="veryImportant">Very Important</option>
              </select>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  {selectedTodo ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
