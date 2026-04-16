import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

const SESSION_KEY = 'sloplens-custom-session';

async function getCustomAccessToken(): Promise<string | null> {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { access_token?: unknown; expires_at?: unknown };
    const accessToken = typeof parsed.access_token === 'string' ? parsed.access_token : '';
    if (!accessToken) return null;

    const expiresAt = typeof parsed.expires_at === 'number' ? parsed.expires_at : Number(parsed.expires_at);
    if (Number.isFinite(expiresAt) && expiresAt <= Math.floor(Date.now() / 1000)) {
      return null;
    }
    return accessToken;
  } catch {
    return null;
  }
}

// NOTE: This app currently uses a custom Edge Function login (`dev-login`) that returns an access token.
// We wire that token into Supabase requests via the `accessToken` option (mirrors the staging web mock).
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  accessToken: getCustomAccessToken,
});
