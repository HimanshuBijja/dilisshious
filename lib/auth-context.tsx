"use client";

import React, { createContext, useContext, useState } from "react";
import { SessionProvider } from "next-auth/react";

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <SessionProvider>
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
