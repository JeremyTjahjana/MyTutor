"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import type { User } from "@/types/user";
import { supabase } from "@/lib/supabase/client";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isApprovedTutor: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  /** Re-fetch `public.users` for the current session (e.g. after avatar upload). */
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function loadUserProfile(authId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select(
      "id, full_name, email, phone, avatar_url, role, tutor_status, created_at, updated_at",
    )
    .eq("id", authId)
    .maybeSingle(); // Returns null (not 406) when no row found

  if (error || !data) return null;

  return {
    id: data.id,
    fullName: data.full_name,
    email: data.email,
    phone: data.phone ?? null,
    avatarUrl: data.avatar_url ?? null,
    role: data.role,
    tutorStatus: data.tutor_status ?? null,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const syncVersionRef = useRef(0);

  useEffect(() => {
    let isMounted = true;

    const syncUserFromAuthId = async (authId: string | null) => {
      const syncVersion = ++syncVersionRef.current;
      if (isMounted) {
        setIsAuthenticated(Boolean(authId));
        setIsLoading(true);
      }

      if (!authId) {
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      const profile = await loadUserProfile(authId);

      if (isMounted && syncVersion === syncVersionRef.current) {
        setUser(profile);
        setIsLoading(false);
      }
    };

    // Check existing session on mount
    void supabase.auth
      .getSession()
      .then(({ data: { session } }) =>
        syncUserFromAuthId(session?.user?.id ?? null),
      )
      .catch(() => syncUserFromAuthId(null));

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") return;

      setTimeout(() => {
        void syncUserFromAuthId(session?.user?.id ?? null);
      }, 0);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<{ error?: string }> => {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) return { error: error.message };
      return {};
    },
    [],
  );

  const loginWithGoogle = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }, []);

  const logout = useCallback(async () => {
    syncVersionRef.current += 1;
    setIsAuthenticated(false);
    setUser(null);
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.user) {
      setIsAuthenticated(true);
      const profile = await loadUserProfile(session.user.id);
      setUser(profile);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  const isApprovedTutor =
    user?.role === "tutor" && user?.tutorStatus === "approved";

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        isApprovedTutor,
        login,
        loginWithGoogle,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
