import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { FakeApiUser } from '../api/fakeUsers';

function DetailCard(props: { label: string; value: string }) {
  return (
    <View className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 mb-3">
      <Text className="text-xs font-semibold text-zinc-500">{props.label}</Text>
      <Text className="text-base text-zinc-900 mt-1">{props.value}</Text>
    </View>
  );
}

export function UserDetailsModal(props: {
  user: FakeApiUser | null;
  visible: boolean;
  onClose: () => void;
}) {
  if (!props.user) return null;

  const fullName = `${props.user.firstname} ${props.user.lastname}`;

  return (
    <Modal
      visible={props.visible}
      transparent
      animationType="slide"
      onRequestClose={props.onClose}>
      <Pressable style={styles.backdrop} onPress={props.onClose} />
      <View style={styles.sheet}>
        <View className="items-center pt-3">
          <View className="h-1.5 w-12 rounded-full bg-zinc-300" />
        </View>

        <View className="px-5 pt-4 pb-3 border-b border-zinc-200/70">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-xl font-semibold text-zinc-900">
                {fullName}
              </Text>
              <Text className="text-sm text-zinc-500 mt-1">
                @{props.user.username} • id {props.user.id}
              </Text>
            </View>
            <Pressable
              className="bg-zinc-900 px-3 py-2 rounded-lg"
              onPress={props.onClose}
              accessibilityRole="button"
              accessibilityLabel="Close details">
              <Text className="text-white font-semibold text-sm">Close</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView contentContainerClassName="px-5 py-4 bg-zinc-50">
          <DetailCard label="Email" value={props.user.email} />
          <DetailCard label="Phone" value={props.user.phone} />
          <DetailCard label="Website" value={props.user.website} />
          <DetailCard label="UUID" value={props.user.uuid} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: '80%',
  },
});
