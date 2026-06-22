// MedUZ AI — Global app state (auth, role, language) using React context + storage
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { storage } from "@/src/utils/storage";

import type { LanguageCode } from "@/src/i18n";

export type Role = "patient" | "doctor" | "admin" | "service" | null;

export type AppState = {
  language: LanguageCode;
  role: Role;
  isAuthenticated: boolean;
  user: { name: string; method: string; userId?: string } | null;
  hydrated: boolean;
  setLanguage: (lang: LanguageCode) => Promise<void>;
  setRole: (role: Role) => Promise<void>;
  signIn: (user: { name: string; method: string; userId?: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

const AppContext = createContext<AppState | null>(null);

const KEYS = {
  language: "meduz.language",
  role: "meduz.role",
  user: "meduz.user",
};

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");
  const [role, setRoleState] = useState<Role>(null);
  const [user, setUserState] = useState<AppState["user"]>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      const lang = await storage.getItem(KEYS.language, "");
      const savedRole = await storage.getItem(KEYS.role, "");
      const savedUser = await storage.getItem(KEYS.user, "");
      if (lang === "uz" || lang === "ru" || lang === "en") setLanguageState(lang);
      if (savedRole === "patient" || savedRole === "doctor" || savedRole === "admin" || savedRole === "service") {
        setRoleState(savedRole);
      }
      if (savedUser && typeof savedUser === "string") {
        try {
          setUserState(JSON.parse(savedUser));
        } catch {
          // ignore
        }
      }
      setHydrated(true);
    })();
  }, []);

  const setLanguage = useCallback(async (lang: LanguageCode) => {
    setLanguageState(lang);
    await storage.setItem(KEYS.language, lang);
  }, []);

  const setRole = useCallback(async (newRole: Role) => {
    setRoleState(newRole);
    if (newRole) await storage.setItem(KEYS.role, newRole);
    else await storage.removeItem(KEYS.role);
  }, []);

  const signIn = useCallback(async (u: NonNullable<AppState["user"]>) => {
    setUserState(u);
    await storage.setItem(KEYS.user, JSON.stringify(u));
  }, []);

  const signOut = useCallback(async () => {
    setUserState(null);
    setRoleState(null);
    await storage.removeItem(KEYS.user);
    await storage.removeItem(KEYS.role);
  }, []);

  const value = useMemo<AppState>(
    () => ({
      language,
      role,
      user,
      isAuthenticated: !!user,
      hydrated,
      setLanguage,
      setRole,
      signIn,
      signOut,
    }),
    [language, role, user, hydrated, setLanguage, setRole, signIn, signOut],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}

export function useT() {
  const { language } = useAppState();
  return language;
}
