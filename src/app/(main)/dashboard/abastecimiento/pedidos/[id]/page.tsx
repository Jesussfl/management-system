import { Metadata } from 'next'
import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { getAllItems } from '@/app/(main)/dashboard/abastecimiento/inventario/lib/actions/items'
import { buttonVariants } from '@/modules/common/components/button'
import { ArrowLeft, PackagePlus } from 'lucide-react'
import Link from 'next/link'
import OrdersForm from '../components/forms/orders-form'
import { getAllUnits } from '../../../unidades/lib/actions/units'
import { getAllProfessionals } from '../../../profesionales/lib/actions/professionals'
import { getAllReceivers } from '../../destinatarios/lib/actions/receivers'
import { getOrderById } from '../lib/actions/orders'
import { getAllSuppliers } from '../lib/actions/suppliers'

export const metadata: Metadata = {
  title: 'Editar Pedido',
  description: 'Desde aquí puedes editar la información del pedido',
}

export default async function Page({ params }: { params: { id: string } }) {
  const order = await getOrderById(Number(params.id))
  const itemsData = await getAllItems()
  const receivers = await getAllReceivers()
  const suppliers = await getAllSuppliers()

  const comboBoxSuppliers = suppliers.map((supplier) => {
    return {
      value: supplier.id,
      label: supplier.nombre,
    }
  })

  const comboBoxReceivers = receivers.map((receiver) => {
    return {
      value: receiver.id,
      label: `${receiver.tipo_cedula}-${receiver.cedula} ${receiver.nombres}`,
    }
  })

  const professionals = await getAllProfessionals()

  const comboBoxProfessionals = professionals.map((professional) => {
    return {
      value: professional.id,
      label: `${professional.tipo_cedula}-${professional.cedula} ${professional.nombres}`,
    }
  })
  const units = await getAllUnits()

  const comboBoxUnits = units.map((unit) => {
    return {
      value: unit.id,
      label: unit.nombre,
    }
  })
  return (
    <>
      <PageHeader className="mb-0">
        <HeaderLeftSide className="flex-row items-center gap-4">
          <Link
            href="/dashboard/abastecimiento/pedidos"
            className={buttonVariants({ variant: 'outline' })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
          <div>
            <PageHeaderTitle>
              <PackagePlus size={24} />
              Editar Pedido
            </PageHeaderTitle>
            <PageHeaderDescription>
              Desde aquí puedes editar la información del pedido
            </PageHeaderDescription>
          </div>
        </HeaderLeftSide>
      </PageHeader>
      <PageContent className=" pt-5 space-y-4 md:px-[20px] xl:px-[100px] 2xl:px-[250px]">
        <OrdersForm
          defaultValues={order}
          suppliers={comboBoxSuppliers}
          items={itemsData}
          units={comboBoxUnits}
          receivers={comboBoxReceivers}
          professionals={comboBoxProfessionals}
          orderId={Number(params.id)}
        />
      </PageContent>
    </>
  )
}
