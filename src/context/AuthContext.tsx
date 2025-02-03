"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const router = useRouter();

  // Simulate login by setting `isAuthenticated` to `true`
  function login() {
    setIsAuthenticated(true);
    router.push("/"); // Redirect to `/dogs` after login
  }

  // Simulate logout by setting `isAuthenticated` to `false`
  function logout() {
    setIsAuthenticated(false);
    router.push("/login"); // Redirect to `/login` after logout
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
