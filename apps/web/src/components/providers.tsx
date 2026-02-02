"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { User } from "@supabase/supabase-js";

export type ProfileRole = "merchant" | "manufacturer";

export interface Profile {
  id: string;
  role: ProfileRole | null;
  org_id: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

interface AppContextValue {
  user: User | null;
  profile: Profile | null;
  setUser: (u: User | null) => void;
  setProfile: (p: Profile | null) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within Providers");
  return ctx;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const value = useMemo(
    () => ({ user, profile, setUser, setProfile }),
    [user, profile]
  );
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
