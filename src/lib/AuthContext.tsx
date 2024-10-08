// Used to store the current user in the app.

import { createContext, useContext, useState } from "react";

interface AuthContextType {
  logout: () => void;
  currentUser: string | null;
  login: (user: string) => void;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => {},
  logout: () => {},
});

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

// Provides the handlers for updating the current user state.
// This is simple implementation to mic a proper Authentication layer
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
