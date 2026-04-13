import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { FakeApiUser } from '../api/fakeUsers';
import { fetchFakeUsers } from '../api/fakeUsers';
import { ScreenHeader } from '../components/ScreenHeader';
import { SearchBar } from '../components/SearchBar';
import { UserCard } from '../components/UserCard';
import { UserDetailsModal } from '../components/UserDetailsModal';

export function UsersScreen() {
  const [users, setUsers] = React.useState<FakeApiUser[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [selectedUser, setSelectedUser] = React.useState<FakeApiUser | null>(
    null,
  );
  const [query, setQuery] = React.useState('');

  const load = React.useCallback(async () => {
    setErrorMessage(null);
    const nextUsers = await fetchFakeUsers();
    setUsers(nextUsers);
  }, []);

  React.useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        await load();
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : String(error));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [load]);

  const onRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    try {
      await load();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setIsRefreshing(false);
    }
  }, [load]);

  const filteredUsers = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(u => {
      const fullName = `${u.firstname} ${u.lastname}`.toLowerCase();
      return (
        fullName.includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    });
  }, [query, users]);

  const meta = React.useMemo(() => {
    const count = filteredUsers.length;
    return `${count} ${count === 1 ? 'user' : 'users'}`;
  }, [filteredUsers.length]);

  return (
    <SafeAreaView className="flex-1 bg-zinc-50" edges={['top', 'bottom']}>
      <ScreenHeader
        title="Fake API Users"
        subtitle="Tap a card for details"
        meta={meta}
      />
      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Search name, username, email"
      />

      {isLoading ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-base text-zinc-600">Loading…</Text>
        </View>
      ) : errorMessage ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-base font-semibold text-zinc-900 mb-2">
            Something went wrong
          </Text>
          <Text className="text-sm text-zinc-600 text-center mb-4">
            {errorMessage}
          </Text>
          <Pressable
            className="bg-zinc-900 px-4 py-3 rounded-lg"
            onPress={onRefresh}>
            <Text className="text-white font-semibold">Try again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={item => item.uuid}
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          contentContainerClassName="py-3"
          renderItem={({ item }) => (
            <UserCard user={item} onPress={() => setSelectedUser(item)} />
          )}
          ListEmptyComponent={
            <View className="px-5 py-8">
              <Text className="text-base text-zinc-600">
                No users found.
              </Text>
            </View>
          }
        />
      )}

      <UserDetailsModal
        user={selectedUser}
        visible={selectedUser !== null}
        onClose={() => setSelectedUser(null)}
      />
    </SafeAreaView>
  );
}
