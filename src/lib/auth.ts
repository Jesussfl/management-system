import { auth } from '@/auth'

export const currentUser = async () => {
  const session = await auth()

  return session?.user
}

export const currentRole = async () => {
  const session = await auth()

  return session?.user?.rol_nombre
}

export const getUserPermissions = async () => {
  const session = await auth()
  return session?.user.rol.permisos
}
