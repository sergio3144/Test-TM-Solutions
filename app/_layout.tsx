import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import 'react-native-reanimated';

import "../global.css";

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="index" options={{ animation: 'fade' }}/>
        <Stack.Screen name="map" options={{ animation: 'fade' }} />
        <Stack.Screen name='permissions' options={{ animation: 'fade' }}/>
      </Stack>
    </ThemeProvider>
  );
}