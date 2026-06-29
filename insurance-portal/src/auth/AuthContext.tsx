import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { InstitutionProfile } from '../institution-types';
import { fetchProfile, institutionLogin, institutionPasswordLogin, institutionSmsLogin, institutionWechatLogin, setAuthToken } from '../api';

const STORAGE_KEY = 'ssb_institution_token';

interface AuthContextValue {
  token: string | null;
  profile: InstitutionProfile | null;
  loading: boolean;
  loginViaPassword: (payload: {
    phone: string;
    password: string;
    mode: 'login' | 'register';
    institution_category?: 'insurance' | 'bank' | 'guarantee';
  }) => Promise<{ isNew: boolean }>;
  loginViaSms: (payload: {
    phone: string;
    code: string;
    mode: 'login' | 'register';
    institution_category?: 'insurance' | 'bank' | 'guarantee';
  }) => Promise<{ isNew: boolean }>;
  loginViaWechat: (payload: {
    code: string;
    mode: 'login' | 'register';
    institution_category?: 'insurance' | 'bank' | 'guarantee';
  }) => Promise<{ isNew: boolean }>;
  login: (payload: {
    phone: string;
    mode: 'login' | 'register';
    institution_category?: 'insurance' | 'bank' | 'guarantee';
  }) => Promise<{ isNew: boolean }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY));
  const [profile, setProfile] = useState<InstitutionProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!token) {
      setProfile(null);
      return;
    }
    const p = await fetchProfile();
    setProfile(p);
  }, [token]);

  useEffect(() => {
    setAuthToken(token);
    if (!token) {
      setProfile(null);
      setLoading(false);
      return;
    }
    refreshProfile()
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
        setToken(null);
        setProfile(null);
      })
      .finally(() => setLoading(false));
  }, [token, refreshProfile]);

  const loginViaPassword = useCallback(
    async (payload: {
      phone: string;
      password: string;
      mode: 'login' | 'register';
      institution_category?: 'insurance' | 'bank' | 'guarantee';
    }) => {
      const res = await institutionPasswordLogin(payload);
      localStorage.setItem(STORAGE_KEY, res.token);
      setAuthToken(res.token);
      setToken(res.token);
      setProfile(res.profile);
      return { isNew: res.is_new };
    },
    []
  );

  const loginViaSms = useCallback(
    async (payload: {
      phone: string;
      code: string;
      mode: 'login' | 'register';
      institution_category?: 'insurance' | 'bank' | 'guarantee';
    }) => {
      const res = await institutionSmsLogin(payload);
      localStorage.setItem(STORAGE_KEY, res.token);
      setAuthToken(res.token);
      setToken(res.token);
      setProfile(res.profile);
      return { isNew: res.is_new };
    },
    []
  );

  const loginViaWechat = useCallback(
    async (payload: {
      code: string;
      mode: 'login' | 'register';
      institution_category?: 'insurance' | 'bank' | 'guarantee';
    }) => {
      const res = await institutionWechatLogin(payload);
      localStorage.setItem(STORAGE_KEY, res.token);
      setAuthToken(res.token);
      setToken(res.token);
      setProfile(res.profile);
      return { isNew: res.is_new };
    },
    []
  );

  const login = useCallback(
    async (payload: {
      phone: string;
      mode: 'login' | 'register';
      institution_category?: 'insurance' | 'bank' | 'guarantee';
    }) => {
      const res = await institutionLogin(payload);
      localStorage.setItem(STORAGE_KEY, res.token);
      setAuthToken(res.token);
      setToken(res.token);
      setProfile(res.profile);
      return { isNew: res.is_new };
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthToken(null);
    setToken(null);
    setProfile(null);
  }, []);

  const value = useMemo(
    () => ({ token, profile, loading, login, loginViaWechat, loginViaSms, loginViaPassword, logout, refreshProfile }),
    [token, profile, loading, login, loginViaWechat, loginViaSms, loginViaPassword, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
