import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { verifyInstallation } from 'nativewind';
import type { FakeApiUser } from '../api/fakeUsers';
import { PhotoPickerCard, type PickedPhoto } from '../components/PhotoPickerCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { SearchBar } from '../components/SearchBar';
import { UserCard } from '../components/UserCard';
import { UserDetailsModal } from '../components/UserDetailsModal';
import { useFakeUsersQuery } from '../queries/useFakeUsersQuery';

export function UsersScreen() {
  React.useEffect(() => {
    // Helps surface setup issues when Tailwind styles aren't applying.
    if (__DEV__ && typeof jest === 'undefined') {
      verifyInstallation();
    }
  }, []);

  const [selectedUser, setSelectedUser] = React.useState<FakeApiUser | null>(
    null,
  );
  const [query, setQuery] = React.useState('');
  const [photo, setPhoto] = React.useState<PickedPhoto | null>(null);

  const usersQuery = useFakeUsersQuery({ quantity: 20, seed: 123 });

  const filteredUsers = React.useMemo(() => {
    const users = usersQuery.data ?? [];
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
  }, [query, usersQuery.data]);

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
      <PhotoPickerCard value={photo} onChange={setPhoto} />

      {usersQuery.isPending ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-base text-zinc-600">Loading…</Text>
        </View>
      ) : usersQuery.isError ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-base font-semibold text-zinc-900 mb-2">
            Something went wrong
          </Text>
          <Text className="text-sm text-zinc-600 text-center mb-4">
            {usersQuery.error instanceof Error
              ? usersQuery.error.message
              : String(usersQuery.error)}
          </Text>
          <Pressable
            className="bg-zinc-900 px-4 py-3 rounded-lg"
            onPress={() => usersQuery.refetch()}>
            <Text className="text-white font-semibold">Try again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={item => item.uuid}
          refreshing={usersQuery.isRefetching}
          onRefresh={() => usersQuery.refetch()}
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
