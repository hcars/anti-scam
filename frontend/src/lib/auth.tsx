import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { api, backendUrl } from "./api";

export interface User {
  id: string;
  email: string;
  name: string;
  plan: "free" | "pro";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get<{ user?: User }>("/auth/session")
      .then(res => {
        if (res.data?.user) {
          setUser(res.data.user);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const login = () => {
    window.location.href = `${backendUrl}/auth/signin`;
  };

  const logout = async () => {
    await api.post("/auth/signout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
