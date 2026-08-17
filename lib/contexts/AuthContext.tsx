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

// Renders the auth provider reusable UI component.
// Features: renders child component slots dynamically.
// Returns the styled JSX element.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);  // Initialize loading flag as active on first render

  // Helper function executing fetch user.
  // Processes input parameters and returns the calculated result.
  const fetchUser = useCallback(async () => {
    try {
      const me = await getMe(); // Call /auth/me endpoint to retrieve current authenticated user profile
      setUser(me); // Update user state — triggers re-render of all components consuming AuthContext
      return me;
    } catch {
      setUser(null); // Clear user state on any auth failure (e.g., expired token, 401)
      return null;
    } finally {
      setIsLoading(false); // Always clear loading flag after fetch attempt completes
    }
  }, []);

  // Synchronize this effect by builds resolve whenever its dependencies change.
  useEffect(() => {
    void Promise.resolve().then(fetchUser); // Kick off non-blocking user profile fetch on initial mount
  }, [fetchUser]);

  // Validate the login payload and client version, authenticate the account, issue access and refresh tokens, persist the correct session slot, and return the authenticated account data.
  const login = async (emailOrUsername: string, password: string): Promise<MeResponse> => {
    await apiLogin(emailOrUsername, password); // POST credentials to /auth/login — sets JWT cookies on success
    setIsLoading(true); // Show loading state while fetching user profile after login
    const me = await fetchUser(); // Load fresh user profile now that cookies are set
    if (!me) {
      throw new Error("Failed to load user profile after login."); // Auth cookies set but /me failed — propagate error
    }
    return me;
  };

  // Validate the registration payload, create the account and initial profile, issue session tokens, and return the authenticated registration result.
  const register = async (data: RegisterRequest): Promise<MeResponse> => {
    await apiRegister(data); // POST registration data to /auth/register — creates account and sets JWT cookies
    setIsLoading(true); // Show loading state while fetching user profile after registration
    const me = await fetchUser(); // Load fresh user profile now that cookies are set
    if (!me) {
      throw new Error("Failed to load user profile after registration."); // Cookies set but /me failed — propagate error
    }
    return me;
  };

  // Helper function executing logout.
  const logout = async () => {
    try {
      await apiLogout(); // POST to /auth/logout — server revokes refresh token and clears JWT cookies
    } catch {
      // Silently ignore logout errors — clear local state regardless of server response
    }
    setUser(null); // Clear user from context immediately to trigger UI transition to unauthenticated state
  };

  // Helper function executing refresh user.
  // Processes input parameters and returns the calculated result.
  const refreshUser = async () => {
    await fetchUser(); // Re-fetch authenticated user profile and update context state
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom React hook providing use auth state and utility functions.
// Returns state values and operational callbacks to consuming components.
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an <AuthProvider>.");
  }
  return context;
}
