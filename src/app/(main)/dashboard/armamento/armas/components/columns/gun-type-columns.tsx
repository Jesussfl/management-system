'use client'

import * as React from 'react'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/modules/common/components/dropdown-menu/dropdown-menu'
import Link from 'next/link'

import { Button } from '@/modules/common/components/button'
import { Checkbox } from '@/modules/common/components/checkbox/checkbox'
import { Accesorio_Arma, Tipo_Armamento } from '@prisma/client'
import { MoreHorizontal } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogTrigger,
} from '@/modules/common/components/alert-dialog'
import ProtectedTableActions from '@/modules/common/components/table-actions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { deleteGunType } from '../../lib/actions/type'
export const gunTypeColumns: ColumnDef<Tipo_Armamento>[] = [
  {
    id: 'seleccionar',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Seleccionar fila"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'nombre',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nombre
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'descripcion',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Descripción
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: 'acciones',

    cell: ({ row }) => {
      const data = row.original

      return (
        <ProtectedTableActions
          sectionName={SECTION_NAMES.ARMAS_ARMAMENTO}
          editConfig={{
            href: `/dashboard/armamento/armas/tipo/${data.id}`,
          }}
          deleteConfig={{
            alertTitle: '¿Estás seguro de eliminar este tipo de armamento?',
            alertDescription: `Estas a punto de eliminar este tipo de armamento. Pero puedes recuperar el registro más tarde.`,
            onConfirm: () => {
              return deleteGunType(data.id)
            },
          }}
        />
      )
    },
  },
]
