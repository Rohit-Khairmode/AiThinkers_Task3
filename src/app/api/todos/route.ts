import { Todo, User } from "@/types/type";
import { deleteTodoSchema, todoSchema } from "@/types/zod";
import { readUsers, writeUsers } from "@/utils/fileHandler";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: NextResponse) {
  const { newTodo, userName } = await req.json();
  console.log(newTodo, userName);

  if (!newTodo)
    return NextResponse.json(
      { empty: "todo object is empty" },
      { status: 400 }
    );
  const validationResult = todoSchema.safeParse(newTodo);
  if (!validationResult.success) {
    const errorObj = validationResult.error.format();
    console.log(errorObj);
    return NextResponse.json(
      {
        title: errorObj.title?._errors[0],
        description: errorObj.description?._errors[0],
        isCompleted: errorObj.isCompleted?._errors[0],
        id: errorObj.id?._errors[0],
        priority: errorObj.priority?._errors[0],
      },
      { status: 400 }
    );
  }
  try {
    const users = readUsers();
    console.log(users);
    for (let i = 0; i < users.length; i++) {
      if (users[i].userName === userName) {
        let j = users[i].todos.findIndex(
          (todo: Todo) => todo.id === newTodo.id
        );
        if (j != -1) {
          users[i].todos[j] = { ...newTodo };
        } else users[i].todos.push(newTodo);
        break;
      }
    }
    writeUsers(users);
    return NextResponse.json(
      { message: "todo updated succesfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "error while updating todo" },
      { status: 200 }
    );
  }
}

export async function DELETE(req: Request, res: NextResponse) {
  const { id, userName } = await req.json();
  console.log(id, userName);
  const validationResult = deleteTodoSchema.safeParse({ id, userName });
  if (!validationResult.success) {
    const errorObj = validationResult.error.format();

    return NextResponse.json(
      {
        userName: errorObj.userName?._errors[0],
        id: errorObj.id?._errors[0],
      },
      { status: 400 }
    );
  }
  try {
    const users = readUsers();
    console.log(users);
    let user = users.find((cur: User) => cur.userName === userName);
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    console.log("user", user);

    let todos = user.todos.filter((todo: Todo) => todo.id !== id);
    console.log("todo", todos);

    user.todos = todos;

    writeUsers(users);
    return NextResponse.json(
      { message: "todo Deleted succesfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "error while deleting todo" },
      { status: 400 }
    );
  }
}
