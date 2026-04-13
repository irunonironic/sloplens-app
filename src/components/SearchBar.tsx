import React from 'react';
import { Text, TextInput, View } from 'react-native';

export function SearchBar(props: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}) {
  return (
    <View className="px-5 pt-3 pb-4 bg-white border-b border-zinc-200/70">
      <View className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 flex-row items-center">
        <Text className="text-zinc-400 mr-2">⌕</Text>
        <TextInput
          value={props.value}
          onChangeText={props.onChangeText}
          placeholder={props.placeholder ?? 'Search'}
          placeholderTextColor="#71717a"
          autoCorrect={false}
          autoCapitalize="none"
          className="text-base text-zinc-900 flex-1"
        />
      </View>
    </View>
  );
}
