'use server'

import {
  createAttendance,
  getLastAttendanceByUserId,
  updateAttendance,
} from '@/app/(main)/dashboard/recursos-humanos/asistencias/lib/actions'
import { Usuario } from '@prisma/client'
import { isSameDay } from 'date-fns'
import { revalidatePath } from 'next/cache'

export const checkInTime = async (user: Usuario) => {
  console.log('checkAttendance')

  if (!user || !user.id) {
    return {
      error: 'No se pudo encontrar el usuario',
      success: false,
    }
  }

  // Obtener las asistencias del usuario para el día de hoy
  const today = new Date()
  const lastAttendance = await getLastAttendanceByUserId(user.id)
  console.log('lastAttendance', lastAttendance)
  const todayAttendance = lastAttendance?.hora_entrada
    ? isSameDay(new Date(lastAttendance.hora_entrada), today)
    : false

  // Si no hay asistencia para hoy, crear un nuevo registro
  if (!todayAttendance) {
    console.log('No hay asistencia para hoy')
    await createAttendance({ id_usuario: user.id, hora_entrada: new Date() })

    return {
      success: 'Asistencia registrada',
      error: false,
    }
  }
  revalidatePath('/asistencias')

  return {
    error: 'Ya registraste una asistencia para hoy',
    success: false,
  }
}
export const checkOutTime = async (user: Usuario) => {
  if (!user || !user.id) {
    return {
      error: 'No se pudo encontrar el usuario',
      success: false,
    }
  }

  // Obtener las asistencias del usuario para el día de hoy
  const today = new Date()

  const lastAttendance = await getLastAttendanceByUserId(user.id)

  const todayAttendance = lastAttendance?.hora_entrada
    ? isSameDay(new Date(lastAttendance.hora_entrada), today)
    : false

  const alreadyCheckedOut = lastAttendance?.hora_salida

  if (alreadyCheckedOut) {
    return {
      error: 'Ya registraste tu hora de salida',
      success: false,
    }
  }
  // Si hay asistencia de entrada para hoy, actualizar la hora de salida
  if (todayAttendance && lastAttendance) {
    await updateAttendance(lastAttendance.id, {
      hora_salida: new Date(),
    })

    return {
      success: 'Hora de salida registrada',
      error: false,
    }
  }

  revalidatePath('/asistencias')
  return {
    error:
      'Por favor registra tu hora de entrada antes de registrar tu hora de salida',
    success: false,
  }
}
