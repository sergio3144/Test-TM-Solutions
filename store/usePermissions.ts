
import { checkLocationPermission, requestLocationPermission } from '@/actions/permissions/location'
import { PermissionStatus } from '@/infraestructure/interface/location'

import { create } from 'zustand'

type PermissionsState = {
  locationStatus: PermissionStatus
  requestLocationPermissionState: () => Promise<PermissionStatus>
  checkLocalPermissionState: () => Promise<PermissionStatus>
}

export const usePermissionStore = create<PermissionsState>()((set) => ({
  locationStatus: PermissionStatus.CHECKING,

  requestLocationPermissionState: async () => {

    const status = await requestLocationPermission()
    set({ locationStatus: status })
    return status

  },

  checkLocalPermissionState: async () => {
    const status = await checkLocationPermission()
    set({ locationStatus: status })
    return status
  },

}))