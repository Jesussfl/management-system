'use server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { validateUserSession } from '@/utils/helpers/validate-user-session'
import { validateUserPermissions } from '@/utils/helpers/validate-user-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { registerAuditAction } from '@/lib/actions/audit'

export type GuardiasForm = {
  guardias: {
    ubicacion: string
    fecha: Date
    estado: string
  }[]
}
export const updateGuard = async (data: GuardiasForm, id: string) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.RECURSOS_HUMANOS,
    actionName: 'CREAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  await prisma.personal.update({
    where: {
      cedula: id,
    },
    data: {
      guardias: {
        deleteMany: {},
        createMany: {
          data: data.guardias.map((guardia) => {
            return {
              fecha: guardia.fecha,
              estado: guardia.estado,
              ubicacion: guardia.ubicacion,
            }
          }),
        },
      },
    },
  })

  await registerAuditAction('ACTUALIZAR', 'Se asignaron guardias a ' + id)
  revalidatePath('/dashboard/recursos-humanos/guardias')

  return {
    success: 'las guardias han sido creadas con exito',
    error: false,
  }
}

export const getAllGuards = async () => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const guards = await prisma.guardia.findMany({
    include: {
      personal: true,
    },

    orderBy: {
      fecha: 'asc',
    },
  })
  return guards
}

export const deletePersonnel = async (cedula: string) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.RECURSOS_HUMANOS,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const exists = await prisma.personal.findUnique({
    where: {
      cedula,
    },
  })

  if (!exists) {
    return {
      error: 'El personal no existe',
      field: 'cedula',
      success: false,
    }
  }

  await prisma.destinatario.delete({
    where: {
      cedula,
    },
  })

  await registerAuditAction(
    'ELIMINAR',
    'Se elimino el personal con la cedula ' + cedula
  )
  revalidatePath('/dashboard/recursos-humanos/personal')

  return {
    success: 'El personal ha sido eliminado con exito',
    error: false,
  }
}
export const recoverPersonnel = async (cedula: string) => {
  const sessionResponse = await validateUserSession()

  if (sessionResponse.error || !sessionResponse.session) {
    return sessionResponse
  }

  const permissionsResponse = validateUserPermissions({
    sectionName: SECTION_NAMES.RECURSOS_HUMANOS,
    actionName: 'ELIMINAR',
    userPermissions: sessionResponse.session?.user.rol.permisos,
  })

  if (!permissionsResponse.success) {
    return permissionsResponse
  }

  const exists = await prisma.personal.findUnique({
    where: {
      cedula,
    },
  })

  if (!exists) {
    return {
      error: 'El personal no existe',
      field: 'cedula',
      success: false,
    }
  }

  await prisma.destinatario.update({
    where: {
      cedula,
    },
    data: {
      fecha_eliminacion: null,
    },
  })

  await registerAuditAction(
    'RECUPERAR',
    'Se recuperó el personal con la cedula ' + cedula
  )
  revalidatePath('/dashboard/recursos-humanos/personal')

  return {
    success: 'El personal ha sido recuperado con exito',
    error: false,
  }
}
export const updatePersonnel = async (
  data: Prisma.PersonalUpdateInput,
  id: number
) => {
  const session = await auth()

  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const exists = await prisma.personal.findUnique({
    where: {
      id,
    },
  })

  if (!exists) {
    return {
      error: 'el personal no existe',
      success: false,
    }
  }

  await prisma.personal.update({
    where: {
      id,
    },
    data,
  })

  await registerAuditAction(
    'ACTUALIZAR',
    'Se actualizó el personal con la cedula ' + exists.cedula
  )

  revalidatePath('/dashboard/recursos-humanos/personal')

  return {
    success: 'El personal ha sido actualizado con exito',
    error: false,
  }
}

export const getPersonnelById = async (id: number) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const personnel = await prisma.personal.findUnique({
    where: {
      id,
    },
    include: {
      usuario: true,
      grado: true,
      categoria: true,
      componente: true,
      unidad: true,
      guardias: true,
    },
  })

  if (!personnel) {
    throw new Error('Receiver not found')
  }
  return personnel
}

export const getPersonnelByCedula = async (id: string) => {
  const session = await auth()
  if (!session?.user) {
    throw new Error('You must be signed in to perform this action')
  }
  const personnel = await prisma.personal.findUnique({
    where: {
      cedula: id,
    },
    include: {
      usuario: true,
      grado: true,
      categoria: true,
      componente: true,
      unidad: true,
      guardias: true,
    },
  })

  if (!personnel) {
    throw new Error('Receiver not found')
  }
  return personnel
}
