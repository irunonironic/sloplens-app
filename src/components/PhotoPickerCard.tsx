import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  type Asset,
  type CameraOptions,
  type ImageLibraryOptions,
} from 'react-native-image-picker';

export type PickedPhoto = Pick<
  Asset,
  'uri' | 'width' | 'height' | 'fileName' | 'type' | 'fileSize'
>;

function Button(props: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}) {
  const variant = props.variant ?? 'secondary';
  const className =
    variant === 'primary'
      ? 'bg-zinc-900 border-zinc-900'
      : 'bg-white border-zinc-200';
  const textClassName =
    variant === 'primary' ? 'text-white' : 'text-zinc-900';

  return (
    <Pressable
      className={`flex-1 rounded-xl border px-4 py-3 ${className} ${
        props.disabled ? 'opacity-60' : ''
      }`}
      disabled={props.disabled}
      onPress={props.onPress}
      android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: false }}
      accessibilityRole="button"
      accessibilityLabel={props.label}>
      <Text className={`text-sm font-semibold text-center ${textClassName}`}>
        {props.label}
      </Text>
    </Pressable>
  );
}

export function PhotoPickerCard(props: {
  value: PickedPhoto | null;
  onChange: (photo: PickedPhoto | null) => void;
}) {
  const [isBusy, setIsBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleResult = React.useCallback(
    (result: { didCancel?: boolean; errorMessage?: string; assets?: Asset[] }) => {
      if (result.didCancel) return;
      if (result.errorMessage) {
        setError(result.errorMessage);
        return;
      }
      const asset = result.assets?.[0];
      const uri = asset?.uri;
      if (!uri) {
        setError('No photo returned from picker.');
        return;
      }
      setError(null);
      props.onChange({
        uri,
        width: asset.width,
        height: asset.height,
        fileName: asset.fileName,
        type: asset.type,
        fileSize: asset.fileSize,
      });
    },
    [props],
  );

  const browsePhoto = React.useCallback(async () => {
    if (isBusy) return;
    setIsBusy(true);
    try {
      const options: ImageLibraryOptions = {
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.9,
        includeBase64: false,
      };
      const result = await launchImageLibrary(options);
      handleResult(result);
    } finally {
      setIsBusy(false);
    }
  }, [handleResult, isBusy]);

  const takePhoto = React.useCallback(async () => {
    if (isBusy) return;
    setIsBusy(true);
    try {
      const options: CameraOptions = {
        mediaType: 'photo',
        quality: 0.9,
        saveToPhotos: true,
        includeBase64: false,
      };
      const result = await launchCamera(options);
      handleResult(result);
    } finally {
      setIsBusy(false);
    }
  }, [handleResult, isBusy]);

  return (
    <View className="px-5 py-4 bg-white border-b border-zinc-200/70">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-base font-semibold text-zinc-900">
            Photo
          </Text>
          <Text className="text-sm text-zinc-500 mt-0.5">
            Choose from gallery or take a new one
          </Text>
        </View>
        {props.value?.uri ? (
          <Image
            source={{ uri: props.value.uri }}
            className="h-14 w-14 rounded-2xl bg-zinc-100 border border-zinc-200"
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
        ) : (
          <View className="h-14 w-14 rounded-2xl bg-zinc-50 border border-zinc-200 items-center justify-center">
            <Text className="text-zinc-400 text-lg">+</Text>
          </View>
        )}
      </View>

      <View className="flex-row mt-4">
        <Button
          label={isBusy ? 'Working…' : 'Browse'}
          onPress={browsePhoto}
          disabled={isBusy}
          variant="secondary"
        />
        <View className="w-3" />
        <Button
          label={isBusy ? 'Working…' : 'Camera'}
          onPress={takePhoto}
          disabled={isBusy}
          variant="primary"
        />
      </View>

      {props.value?.uri ? (
        <View className="flex-row items-center justify-between mt-4">
          <View className="flex-1 pr-3">
            <Text className="text-xs font-semibold text-zinc-500">
              Selected
            </Text>
            <Text
              className="text-sm text-zinc-700 mt-0.5"
              numberOfLines={1}>
              {props.value.fileName ?? props.value.uri}
            </Text>
          </View>
          <Pressable
            className="px-3 py-2 rounded-lg bg-zinc-100 border border-zinc-200"
            onPress={() => props.onChange(null)}
            accessibilityRole="button"
            accessibilityLabel="Remove selected photo">
            <Text className="text-sm font-semibold text-zinc-800">
              Remove
            </Text>
          </Pressable>
        </View>
      ) : null}

      {error ? (
        <View className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
          <Text className="text-sm font-semibold text-rose-900">
            Photo error
          </Text>
          <Text className="text-sm text-rose-700 mt-1">{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

