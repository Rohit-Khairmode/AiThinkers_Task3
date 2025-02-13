import { User } from "@/types";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type AuthContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const data: AuthContextType | null = useContext(AuthContext);
  if (!data?.setUser)
    throw new Error("Auth context is used outside of provider");
  return data;
}
