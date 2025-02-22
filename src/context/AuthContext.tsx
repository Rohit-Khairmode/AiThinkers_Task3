import { AuthContextType, User } from "@/types/type";
import { createContext, useContext, useState } from "react";

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

export function useAuth(): AuthContextType | null {
  const data: AuthContextType | null = useContext(AuthContext);
  if (!data?.setUser)
    throw new Error("Auth context is used outside of provider");
  return data;
}
