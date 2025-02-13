import path from "path";
import fs from "fs";
import { User } from "@/types";

export const dataFile = path.join(process.cwd(), "data.json");
export const readUsers = () => JSON.parse(fs.readFileSync(dataFile, "utf-8"));
export const writeUsers = (users: User[]) =>
  fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));
