'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

import { Button, buttonVariants } from '@/modules/common/components/button'

import { SELECT_COLUMN } from '@/utils/constants/columns'
import { Prisma } from '@prisma/client'

import { DropdownMenuItem } from '@/modules/common/components/dropdown-menu/dropdown-menu'
import Link from 'next/link'
import { cn } from '@/utils/utils'
import { deleteOrder } from './lib/actions/orders'
import { format } from 'date-fns'
import dayjs from 'dayjs'
import 'dayjs/plugin/utc'
import 'dayjs/plugin/duration'
import ProtectedTableActions from '@/modules/common/components/table-actions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import {
  HoverCard,
  HoverCardTrigger,
} from '@/modules/common/components/hover-card'
import { HoverCardContent } from '@radix-ui/react-hover-card'

dayjs.extend(require('dayjs/plugin/utc'))
dayjs.extend(require('dayjs/plugin/duration'))

type PedidoType = Prisma.PedidoGetPayload<{
  include: {
    unidad: true
    proveedor: true
    destinatario: true
    supervisor: true
    abastecedor: true
    autorizador: true
    renglones: { include: { renglon: true } }
  }
}>

export const columns: ColumnDef<PedidoType>[] = [
  SELECT_COLUMN,
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'motivo',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Motivo
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      // max width 100
      return (
        <div className="max-w-[300px] truncate">
          {row.getValue<string>('motivo') || 'S/M'}
        </div>
      )
    },
  },
  {
    id: 'estado',
    accessorFn: (row) => row.estado || 'S/E',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Estado
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const { estado } = row.original
      const COLORS = {
        Recibido: 'bg-green-500',
        Pendiente: 'bg-yellow-500',
        En_proceso: 'bg-gray-500',
        Cancelado: 'bg-red-500',
      }
      return (
        <div className="w-32 flex gap-2 items-center">
          <div
            className={` rounded-full w-2 h-2 ${COLORS[estado || 'Pendiente']}`}
          />{' '}
          {estado === 'En_proceso' ? 'En Proceso' : estado || 'Pendiente'}
        </div>
      )
    },
  },
  {
    id: 'unidad',
    accessorFn: (row: PedidoType) => row.unidad?.nombre,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Proveedor/Unidad
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    id: 'destinatario',
    accessorFn: (row: PedidoType) => row.destinatario?.nombres,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Proveedor/Persona
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    id: 'proveedor',
    accessorFn: (row: PedidoType) => row.proveedor?.nombre,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Proveedor/Empresa
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
  },
  {
    id: 'supervisor',
    accessorFn: (row: PedidoType) =>
      row?.supervisor?.nombres + ' ' + row.supervisor?.apellidos,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Supervisor
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const data = row.getValue<string>('supervisor')

      if (!data) return <div>No asignado</div>

      return <div>{data}</div>
    },
  },
  {
    id: 'autorizador',
    accessorFn: (row: PedidoType) =>
      row?.autorizador?.nombres + ' ' + row.autorizador?.apellidos,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Autorizador
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const data = row.getValue<string>('autorizador')

      if (!data) return <div>No asignado</div>

      return <div>{data}</div>
    },
  },
  {
    id: 'abastecedor',
    accessorFn: (row: PedidoType) => {
      return row?.abastecedor?.nombres + ' ' + row.abastecedor?.apellidos
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size={'sm'}
          className="text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Abastecedor
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const data = row.getValue<string>('abastecedor')

      if (!data) return <div>No asignado</div>

      return <div>{data}</div>
    },
  },
  {
    id: 'renglones',
    accessorFn: (row: PedidoType) =>
      row.renglones.map((reception) => reception.renglon?.nombre).join(', '),

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="text-xs"
          size={'sm'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Renglones pedidos
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const renglones = row.original.renglones
      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link">Ver renglones pedidos</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 bg-background p-5 border border-border rounded-sm">
            <div className="space-y-1">
              {renglones.map((renglon) => (
                <div key={renglon.id}>
                  <div className="text-sm font-semibold">
                    {renglon.renglon?.nombre}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Cantidad: {renglon.cantidad}
                  </div>
                </div>
              ))}
            </div>
          </HoverCardContent>
        </HoverCard>
      )
    },
  },
  {
    accessorKey: 'fecha_solicitud',
    filterFn: 'dateBetweenFilterFn',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-xs"
        size={'sm'}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Fecha de solicitud
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) =>
      format(new Date(row.original.fecha_solicitud), 'dd/MM/yyyy HH:mm'),
  },

  {
    accessorKey: 'fecha_creacion',
    filterFn: 'dateBetweenFilterFn',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-xs"
        size={'sm'}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Fecha de creación
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) =>
      format(new Date(row.original?.fecha_creacion), 'dd/MM/yyyy HH:mm'),
  },

  // {
  //   accessorKey: 'detalles',
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         className="text-xs"
  //         size={'sm'}
  //         onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  //       >
  //         Detalles
  //         <ArrowUpDown className="ml-2 h-3 w-3" />
  //       </Button>
  //     )
  //   },
  //   cell: ({ row }) => {
  //     return (
  //       <Link
  //         className={cn(buttonVariants({ variant: 'outline' }))}
  //         href={`/dashboard/armamento/pedidos/detalle/${row.original.id}`}
  //       >
  //         Ver detalles
  //       </Link>
  //     )
  //   },
  // },
  {
    id: 'acciones',
    cell: ({ row }) => {
      const data = row.original

      return (
        <ProtectedTableActions
          sectionName={SECTION_NAMES.PEDIDOS_ARMAMENTO}
          editConfig={{
            href: `/dashboard/armamento/pedidos/${data.id}`,
          }}
          deleteConfig={{
            alertTitle: '¿Estás seguro de eliminar este pedido?',
            alertDescription: `Estas a punto de eliminar este pedido y todas sus dependencias.`,
            onConfirm: () => {
              return deleteOrder(data.id)
            },
          }}
        >
          <Link
            href={`/dashboard/armamento/pedidos/${String(
              data.id
            )}/editar-estado`}
          >
            <DropdownMenuItem>Editar estado</DropdownMenuItem>
          </Link>
        </ProtectedTableActions>
      )
    },
  },
]
