
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useEffect } from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native'

import { ThemedText } from '@/components/shared/themed-text'
import ThemedPressable from '@/components/shared/ThemedPressable'
import { PermissionStatus } from '@/infraestructure/interface/location'
import { usePermissionStore } from '@/store/usePermissions'

const PermissionsScreen = () => {
  const { locationStatus, requestLocationPermissionState } = usePermissionStore()

  // Redirección automática cuando se conceden los permisos
  useEffect(() => {
    if (locationStatus === PermissionStatus.GRANTED) {
      router.replace('/map')
    }
  }, [locationStatus])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="location-outline" size={80} color="#007AFF" />
        </View>

        <ThemedText type="title" style={styles.title}>
          Ubicación Necesaria
        </ThemedText>
        
        <ThemedText style={styles.description}>
          Para mostrarte los mejores mapas y rutas, necesitamos conocer tu ubicación actual. 
          Tus datos se usan únicamente para mejorar tu experiencia en la app.
        </ThemedText>

        <View style={styles.spacer} />

        <ThemedPressable 
          onPress={requestLocationPermissionState}
          style={styles.button}
        >
          Habilitar Ubicación
        </ThemedPressable>

      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  iconContainer: {
    width: 150,
    height: 150,
    backgroundColor: '#E3F2FD',
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    // Sombra suave
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
    color: '#1A1A1A',
  },
  description: {
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
    marginBottom: 30,
  },
  spacer: {
    height: 20,
  },
  button: {
    width: '100%',
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  footerText: {
    marginTop: 30,
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
  }
})

export default PermissionsScreen