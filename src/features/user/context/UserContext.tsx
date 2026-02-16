import { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  getCurrentUser,
  logout as apiLogout,
  type User,
} from '@/utils/session';

type UserContextType = {
  user: User;
  setUser: (u: User) => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<boolean>;
  loading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = (props: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const u = await getCurrentUser();
    setUser(u);
  };

  const logout = async () => {
    const ok = await apiLogout();
    if (ok) setUser(null);
    return ok;
  };

  useEffect(() => {
    const load = async () => {
      try {
        await refreshUser();
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, refreshUser, logout, loading }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export { UserContext };
