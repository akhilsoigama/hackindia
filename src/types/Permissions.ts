// types/permission.ts
export interface Permission {
  id: number
  permissionName: string
  permissionKey: string
  createdAt: string
  updatedAt: string
}

export interface PermissionsResponse {
  success: boolean
  data: Permission[]
}

export interface ErrorResponse {
  success: false
  message: string
  error: any
}