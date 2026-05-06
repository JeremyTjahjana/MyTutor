"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/app/types/user";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isApprovedTutor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In production, fetch user from session/API
    // For now, mock logged-in user
    const mockUser: User = {
      id: "user-001",
      name: "Jeremy Tjahjana",
      email: "jeremy@apps.ipb.ac.id",
      role: "tutor",
      tutorStatus: "approved",
      avatar: "/avatar.jpg",
      phone: "+62123456789",
      createdAt: new Date("2023-01-15"),
      updatedAt: new Date(),
    };

    setUser(mockUser);
    setIsLoading(false);
  }, []);

  const isApprovedTutor =
    user?.role === "tutor" && user?.tutorStatus === "approved";

  return (
    <AuthContext.Provider value={{ user, isLoading, isApprovedTutor }}>
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
