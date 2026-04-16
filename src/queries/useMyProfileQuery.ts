import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export type MyProfile = {
  uuid: string;
  credits_balance?: number;
  kind?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: unknown;
};

function coerceSingle<T>(value: unknown): T | null {
  if (Array.isArray(value)) return (value[0] as T | undefined) ?? null;
  return (value as T | null) ?? null;
}

async function fetchMyProfile(): Promise<MyProfile | null> {
  const { data, error } = await supabase.rpc('get_my_profile');
  if (error) throw error;
  return coerceSingle<MyProfile>(data);
}

export function useMyProfileQuery(enabled: boolean) {
  return useQuery({
    queryKey: ['myProfile'],
    queryFn: fetchMyProfile,
    enabled,
    staleTime: 30_000,
  });
}

