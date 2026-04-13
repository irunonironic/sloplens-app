import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { UsersScreen } from './src/screens/UsersScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
        <UsersScreen />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
