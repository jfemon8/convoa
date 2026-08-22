import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getCurrentUser, loginUser } from "../services/auth.service";
import { STORAGE_KEYS } from "../constants/storage";
import { UNAUTHORIZED_EVENT } from "../lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() =>
    localStorage.getItem(STORAGE_KEYS.TOKEN),
  );
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = Boolean(token && user);

  const login = useCallback(async ({ phone, name }) => {
    const data = await loginUser({ phone, name });

    localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);

    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);

    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    window.addEventListener(UNAUTHORIZED_EVENT, logout);

    return () => {
      window.removeEventListener(UNAUTHORIZED_EVENT, logout);
    };
  }, [logout]);

  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();

        setToken(storedToken);
        setUser(currentUser);

        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      } catch (error) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);

        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      isLoading,
      login,
      logout,
    }),
    [user, token, isAuthenticated, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
