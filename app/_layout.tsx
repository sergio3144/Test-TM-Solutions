import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, router } from 'expo-router';
import 'react-native-reanimated';
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { usePermissionStore } from '@/store/usePermissions';
import { PermissionStatus } from '@/infraestructure/interface/location';

import "../global.css";

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { checkLocalPermissionState, locationStatus } = usePermissionStore();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        checkLocalPermissionState();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    // Si nos quitan el permiso mientras la app está corriendo y volvemos (locationStatus cambia)
    if (locationStatus !== PermissionStatus.GRANTED && locationStatus !== PermissionStatus.CHECKING) {
      router.replace('/permissions');
    }
  }, [locationStatus]);

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