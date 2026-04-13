import React from 'react';
import { Text, View } from 'react-native';

export function ScreenHeader(props: {
  title: string;
  subtitle?: string;
  meta?: string;
}) {
  return (
    <View className="px-5 pt-6 pb-4 bg-white border-b border-zinc-200/70">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <View className="h-1.5 w-10 rounded-full bg-indigo-600 mb-3" />
          <Text className="text-3xl font-semibold text-zinc-900">
            {props.title}
          </Text>
          {props.subtitle ? (
            <Text className="text-sm text-zinc-500 mt-1">{props.subtitle}</Text>
          ) : null}
        </View>
        {props.meta ? (
          <View className="rounded-full bg-zinc-100 border border-zinc-200 px-3 py-1.5">
            <Text className="text-xs font-semibold text-zinc-700">
              {props.meta}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
