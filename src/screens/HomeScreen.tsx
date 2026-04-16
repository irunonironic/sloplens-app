import React from 'react';
import {
  ScrollView,
  Text,
  Pressable,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useMyProfileQuery } from '../queries/useMyProfileQuery';

export function HomeScreen() {
  const { session, signOut } = useAuth();
  const profileQuery = useMyProfileQuery(!!session);
  const profile = profileQuery.data ?? session?.profile ?? null;

  const statusLabel = session?.profile?.uuid ?? profile?.uuid ?? 'no active user';

  return (
    <SafeAreaView className="flex-1 bg-[#e8ede9]" edges={['top', 'bottom']}>
      <ScrollView
        contentContainerClassName="px-4 pt-4 pb-10"
        keyboardShouldPersistTaps="handled">
        {/* Hero */}
        <View className="mb-4">
          <Text className="text-[#2d6a4f] text-xs font-bold tracking-widest uppercase mb-2">
            Supabase Sample Frontend
          </Text>
          <Text className="text-4xl font-extrabold text-zinc-900">Sloplens</Text>
          <Text className="text-sm text-zinc-600 mt-2 leading-6">
            A minimal starter for the login-token flow. Log in with the custom function, inspect
            the current profile, and use it as the base for the real auth step later.
          </Text>

          <View className="mt-3 flex-row items-center">
            <Text className="text-sm font-medium text-zinc-700">
              Authenticated
            </Text>
            <Text className="text-sm text-zinc-500 mx-2">·</Text>
            <Text className="text-sm font-medium text-zinc-700" numberOfLines={1}>
              {statusLabel}
            </Text>
          </View>
        </View>

        {/* Auth panel */}
        <View className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-[#2d6a4f] text-xs font-bold tracking-widest uppercase mb-1">
                Authentication
              </Text>
              <Text className="text-2xl font-bold text-zinc-900">
                Signed In
              </Text>
            </View>
            <Pressable
              onPress={signOut}
              className="px-3 py-2 rounded-xl bg-[#2d6a4f]">
              <Text className="text-white text-sm font-semibold">Logout</Text>
            </Pressable>
          </View>
        </View>

        {/* Profile panel */}
        <View className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <View>
              <Text className="text-[#2d6a4f] text-xs font-bold tracking-widest uppercase mb-1">
                Current Profile
              </Text>
              <Text className="text-2xl font-bold text-zinc-900">
                {profileQuery.isPending
                  ? 'Loading'
                  : profileQuery.isError
                    ? 'Not Found'
                    : profile
                      ? 'User Snapshot'
                      : 'Not Found'}
              </Text>
            </View>
            <Pressable
              onPress={() => profileQuery.refetch()}
              className="px-3 py-2 rounded-xl bg-zinc-100 border border-zinc-200">
              <Text className="text-zinc-900 text-sm font-semibold">
                Refresh
              </Text>
            </Pressable>
          </View>

          {profileQuery.isPending ? (
            <View className="py-4 items-center">
              <ActivityIndicator />
              <Text className="text-sm text-zinc-500 mt-2">
                Fetching the current user row…
              </Text>
            </View>
          ) : profileQuery.isError ? (
            <Text className="text-sm text-zinc-600 leading-6">
              The session is present, but no matching profile row was returned (or the RPC/table
              isn’t set up yet).
            </Text>
          ) : !profile ? (
            <Text className="text-sm text-zinc-600 leading-6">
              No profile data yet.
            </Text>
          ) : (
            <View className="gap-3">
              <DetailCard label="User ID" value={String(profile.uuid ?? '—')} wide />
              <View className="flex-row gap-3">
                <DetailCard
                  label="Credits Balance"
                  value={String((profile as any).credits_balance ?? '—')}
                />
                <DetailCard label="Kind" value={String((profile as any).kind ?? '—')} />
              </View>
              <View className="flex-row gap-3">
                <DetailCard
                  label="Created"
                  value={formatDate((profile as any).created_at)}
                />
                <DetailCard
                  label="Updated"
                  value={formatDate((profile as any).updated_at)}
                />
              </View>
            </View>
          )}
        </View>

        {/* Starter creds */}
        <View className="bg-white rounded-2xl p-5 shadow-sm">
          <Text className="text-[#2d6a4f] text-xs font-bold tracking-widest uppercase mb-1">
            Local Dev User
          </Text>
          <Text className="text-xl font-bold text-zinc-900 mb-3">
            Starter Credentials
          </Text>
          <View className="flex-row gap-3">
            <View className="flex-1 bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3">
              <Text className="text-xs text-zinc-500 mb-0.5">login_token</Text>
              <Text className="text-base font-bold text-zinc-900">1234</Text>
            </View>
            <View className="flex-1 bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3">
              <Text className="text-xs text-zinc-500 mb-0.5">kind</Text>
              <Text className="text-base font-bold text-zinc-900">dev</Text>
            </View>
          </View>
          <Text className="text-xs text-zinc-500 leading-5 mt-3">
            This is seeded automatically when the local database is reset.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function formatDate(value: unknown) {
  const s = typeof value === 'string' ? value : '';
  if (!s) return 'Unknown';
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return 'Unknown';
  return d.toLocaleString();
}

function DetailCard(props: { label: string; value: string; wide?: boolean }) {
  return (
    <View
      className={`bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 ${
        props.wide ? '' : 'flex-1'
      }`}>
      <Text className="text-xs text-zinc-500 mb-1">{props.label}</Text>
      <Text className="text-sm font-semibold text-zinc-900" numberOfLines={1}>
        {props.value}
      </Text>
    </View>
  );
}
