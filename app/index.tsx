import React, { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { router } from 'expo-router'
import { usePermissionStore } from '@/store/usePermissions'
import { PermissionStatus } from '@/infraestructure/interface/location'

const MapsApp = () => {
  const { locationStatus, checkLocalPermissionState } = usePermissionStore()

  useEffect(() => {
    checkLocalPermissionState()
  }, [])

  useEffect(() => {
    if (locationStatus === PermissionStatus.CHECKING) return

    if (locationStatus !== PermissionStatus.GRANTED) {
      router.replace('/permissions')
    } else {
      router.replace('/map')
    }
  }, [locationStatus])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  )
}

export default MapsApp