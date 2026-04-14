import { cssInterop } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';

// Enable `className` on 3rd-party components that aren't interop'd by default.
cssInterop(SafeAreaView, { className: 'style' });

