"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { SessionProvider, useSession } from "next-auth/react";

interface AuthContextType {
  showAuthModal: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType>({
  showAuthModal: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
});

function QuizResultSyncer() {
  const { data: session, status } = useSession();
  const hasSynced = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user || hasSynced.current) return;
    hasSynced.current = true;

    try {
      const stored = localStorage.getItem("dilisshious-quiz-result");
      if (!stored) return;

      const data = JSON.parse(stored);
      fetch("/api/quiz-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(() => {
        localStorage.removeItem("dilisshious-quiz-result");
      });
    } catch {}
  }, [status, session]);

  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <SessionProvider>
      <QuizResultSyncer />
      <AuthContext.Provider
        value={{
          showAuthModal,
          openAuthModal: () => setShowAuthModal(true),
          closeAuthModal: () => setShowAuthModal(false),
        }}
      >
        {children}
      </AuthContext.Provider>
    </SessionProvider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
