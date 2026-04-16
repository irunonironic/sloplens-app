import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const STARTER_TOKEN = '1234';

export function LoginScreen() {
  const { signInWithLoginToken } = useAuth();
  const [token, setToken] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const login = async () => {
    const t = token.trim();
    if (!t) {
      setError('Please enter a login token.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await signInWithLoginToken(t);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#e8ede9]">
      <ScrollView
        contentContainerClassName="flex-grow px-4 pt-4 pb-10"
        keyboardShouldPersistTaps="handled">

        {/* Logged out status bar */}
        <View className="rounded-xl bg-[#d4e6d5] px-4 py-3 mb-4">
          <Text className="text-[#2d6a4f] text-sm font-medium">Logged out</Text>
        </View>

        <View className="flex-row gap-3">
          {/* Auth card */}
          <View className="flex-1 bg-white rounded-2xl p-5 shadow-sm">
            <Text className="text-[#2d6a4f] text-xs font-bold tracking-widest uppercase mb-1">
              Authentication
            </Text>
            <Text className="text-2xl font-bold text-zinc-900 mb-4">Log In</Text>

            <Text className="text-sm text-zinc-600 mb-1.5">Login token</Text>
            <TextInput
              value={token}
              onChangeText={setToken}
              placeholder={STARTER_TOKEN}
              placeholderTextColor="#a1a1aa"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={login}
              className="rounded-xl border-2 border-pink-300 bg-white px-4 py-3 text-base text-zinc-900 mb-4"
            />

            <Pressable
              onPress={login}
              disabled={loading}
              className="rounded-xl bg-[#2d6a4f] py-3.5 items-center mb-3">
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-base">Login</Text>
              )}
            </Pressable>

            {error ? (
              <View className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-2">
                <Text className="text-red-600 text-xs leading-5">{error}</Text>
              </View>
            ) : null}

            <Text className="text-xs text-zinc-500 leading-5">
              Sample flow only. The token must match an existing user row exactly.
            </Text>
          </View>

          {/* Current Profile placeholder card */}
          <View className="flex-1 bg-white rounded-2xl p-5 shadow-sm">
            <Text className="text-[#2d6a4f] text-xs font-bold tracking-widest uppercase mb-1">
              Current Profile
            </Text>
            <Text className="text-2xl font-bold text-zinc-900 mb-2">No Session</Text>
            <Text className="text-sm text-zinc-500">Log in to load the current user.</Text>
          </View>
        </View>

        {/* Starter credentials card */}
        <View className="mt-4 bg-white rounded-2xl p-5 shadow-sm">
          <Text className="text-[#2d6a4f] text-xs font-bold tracking-widest uppercase mb-1">
            Local Dev User
          </Text>
          <Text className="text-xl font-bold text-zinc-900 mb-3">Starter Credentials</Text>

          <View className="bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3">
            <Text className="text-xs text-zinc-500 mb-0.5">login_token</Text>
            <Text className="text-base font-bold text-zinc-900">{STARTER_TOKEN}</Text>
          </View>

          <Pressable
            onPress={() => setToken(STARTER_TOKEN)}
            className="mt-3 rounded-xl bg-[#e8ede9] py-2.5 items-center">
            <Text className="text-sm font-semibold text-[#2d6a4f]">Use starter credentials</Text>
          </Pressable>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
