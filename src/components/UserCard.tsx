import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { FakeApiUser } from '../api/fakeUsers';

function initials(firstname: string, lastname: string) {
  const a = firstname?.trim()?.[0] ?? '';
  const b = lastname?.trim()?.[0] ?? '';
  return `${a}${b}`.toUpperCase();
}

function Avatar(props: { uri?: string; firstname: string; lastname: string }) {
  const [failed, setFailed] = React.useState(false);
  const label = initials(props.firstname, props.lastname);

  if (!props.uri || failed) {
    return (
      <View className="h-11 w-11 rounded-full bg-indigo-50 items-center justify-center border border-indigo-100">
        <Text className="text-indigo-700 font-semibold">{label}</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: props.uri }}
      onError={() => setFailed(true)}
      style={styles.avatar}
      accessibilityIgnoresInvertColors
    />
  );
}

export function UserCard(props: {
  user: FakeApiUser;
  onPress: () => void;
}) {
  const fullName = `${props.user.firstname} ${props.user.lastname}`;

  return (
    <Pressable
      className="mx-5 my-2 rounded-2xl border border-zinc-200 bg-white px-4 py-4"
      onPress={props.onPress}
      android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: false }}
      style={({ pressed }) => [
        styles.card,
        { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.99 : 1 }] },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Open details for ${fullName}`}>
      <View className="flex-row items-center">
        <Avatar
          uri={props.user.image}
          firstname={props.user.firstname}
          lastname={props.user.lastname}
        />

        <View className="flex-1 pl-3 pr-2">
          <Text className="text-base font-semibold text-zinc-900">{fullName}</Text>
          <View className="flex-row items-center mt-1">
            <View className="rounded-full bg-zinc-100 border border-zinc-200 px-2 py-0.5">
              <Text className="text-xs font-semibold text-zinc-700">
                @{props.user.username}
              </Text>
            </View>
            <View className="w-2" />
            <Text className="text-xs text-zinc-500" numberOfLines={1}>
              {props.user.website}
            </Text>
          </View>
          <Text className="text-sm text-zinc-700 mt-2" numberOfLines={1}>
            {props.user.email}
          </Text>
        </View>

        <View className="rounded-full bg-zinc-900 px-3 py-1.5">
          <Text className="text-xs font-semibold text-white">Open</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  avatar: {
    height: 44,
    width: 44,
    borderRadius: 22,
    backgroundColor: '#f4f4f5',
    borderWidth: 1,
    borderColor: 'rgba(24,24,27,0.08)',
  },
});
