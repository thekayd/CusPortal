import { createContext, useContext, useState } from "react";
import { toast } from "sonner";

interface AuthContextType {
  logout: () => void;
  currentUser: string | null;
  login: (user: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => {},
  logout: () => {},
});

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);

  function login(username: string) {
    setUser(username);
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ currentUser: user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
