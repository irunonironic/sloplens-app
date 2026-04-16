import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

const SESSION_KEY = 'sloplens-custom-session';

export type Profile = {
  uuid: string;
  credits_balance?: number;
  kind?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: unknown; // allow extra fields
};

export type CustomSession = {
  access_token: string;
  expires_at?: number; // unix seconds (optional)
  token_type?: string;
  profile: Profile | null;
};

function isExpired(session: Pick<CustomSession, 'access_token' | 'expires_at'> | null) {
  if (!session?.access_token) return true;
  if (!Number.isFinite(session.expires_at)) return false;
  return (session.expires_at ?? 0) <= Math.floor(Date.now() / 1000);
}

type AuthContextType = {
  session: CustomSession | null;
  loading: boolean;
  signInWithLoginToken: (loginToken: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextType>({
  session: null,
  loading: true,
  signInWithLoginToken: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<CustomSession | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Restore session from storage on mount.
  React.useEffect(() => {
    AsyncStorage.getItem(SESSION_KEY)
      .then(raw => {
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as CustomSession;
            setSession(isExpired(parsed) ? null : parsed);
          } catch {
            // corrupted — ignore
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const signInWithLoginToken = async (loginToken: string) => {
    const token = loginToken.trim();
    if (!token) throw new Error('Please enter a login token.');

    const { data, error } = await supabase.functions.invoke('dev-login', {
      body: { login_token: token },
    });

    if (error) {
      throw new Error(error.message);
    }

    const accessToken = String(data?.access_token ?? '');
    const profile = (data?.profile ?? null) as Profile | null;
    const tokenType = data?.token_type ? String(data.token_type) : undefined;
    const expiresAtRaw = Number(data?.expires_at);
    const expiresAt = Number.isFinite(expiresAtRaw) ? expiresAtRaw : undefined;

    const nextSession: CustomSession = {
      access_token: accessToken,
      expires_at: expiresAt,
      token_type: tokenType,
      profile,
    };

    if (!nextSession.access_token) throw new Error('Login failed: missing access token.');

    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, loading, signInWithLoginToken, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => React.useContext(AuthContext);
