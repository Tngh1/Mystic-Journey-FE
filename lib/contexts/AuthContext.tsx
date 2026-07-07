"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  getMe,
  logout as apiLogout,
} from "@/lib/api/auth";
import {
  login as apiLogin,
  register as apiRegister,
} from "@/lib/api/auth";
import type { MeResponse, RegisterRequest } from "@/lib/types";

interface AuthContextType {
  user: MeResponse | null;
  isLoading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<MeResponse>;
  register: (data: RegisterRequest) => Promise<MeResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const me = await getMe();
      setUser(me);
      return me;
    } catch {
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(fetchUser);
  }, [fetchUser]);

  const login = async (emailOrUsername: string, password: string): Promise<MeResponse> => {
    await apiLogin(emailOrUsername, password);
    setIsLoading(true);
    const me = await fetchUser();
    if (!me) {
      throw new Error("Failed to load user profile after login.");
    }
    return me;
  };

  const register = async (data: RegisterRequest): Promise<MeResponse> => {
    await apiRegister(data);
    setIsLoading(true);
    const me = await fetchUser();
    if (!me) {
      throw new Error("Failed to load user profile after registration.");
    }
    return me;
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch {
      /* proceed regardless */
    }
    setUser(null);
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an <AuthProvider>.");
  }
  return context;
}
