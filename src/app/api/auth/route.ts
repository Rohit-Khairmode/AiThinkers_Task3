import { AuthInputs, ServerUser } from "@/types/type";
import { authSchema } from "@/types/zod";
import { readUsers, writeUsers } from "@/utils/fileHandler";
import { NextResponse } from "next/server";

export async function POST(req: Request, _: NextResponse) {
  const { userName, password, type }: AuthInputs = await req.json();
  const validationResult = authSchema.safeParse({
    userName,
    password,
    type,
  });

  if (!validationResult.success) {
    const errorObj = validationResult.error.format();

    return NextResponse.json(
      {
        userName: errorObj.userName?._errors[0],
        password: errorObj.password?._errors[0],
        type: errorObj.type?._errors[0],
      },
      { status: 400 }
    );
  }

  const users: ServerUser[] = readUsers();
  console.log(users);

  if (type === "register") {
    if (users?.find((u: any) => u.userName === userName)) {
      return NextResponse.json(
        {
          userName: "User name already exists",
        },
        { status: 400 }
      );
    }
    users.push({ userName, password, todos: [] });
    writeUsers(users);
    return NextResponse.json({ userName, todos: [] }, { status: 201 });
  }

  if (type === "login") {
    const user = users.find(
      (u: any) => u.userName === userName && u.password === password
    );
    if (!user)
      return NextResponse.json(
        { credentials: "Invalid credentials" },
        { status: 401 }
      );

    return NextResponse.json(
      { userName: user.userName, todos: user.todos },
      { status: 200 }
    );
  }

  return NextResponse.json({ method: "Method Not Allowed" }, { status: 405 });
}
