import path from "path";
import fs from "fs";
import { ServerUser } from "@/types/type";

export const dataFile: string = path.join(process.cwd(), "data.json");

export const readUsers = (): ServerUser[] =>
  JSON.parse(fs.readFileSync(dataFile, "utf-8"));

export const writeUsers = (users: ServerUser[]): void =>
  fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));
