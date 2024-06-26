import { validateSections } from '@/lib/data/validate-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { redirect } from 'next/navigation'
export default async function Layout({
  modal,
  children,
}: {
  modal: React.ReactNode
  children: React.ReactNode
}) {
  const isAuthorized = await validateSections({
    sections: [
      SECTION_NAMES.RANGOS,
      SECTION_NAMES.DESTINATARIOS_ABASTECIMIENTO,
      SECTION_NAMES.PROFESIONALES,
      SECTION_NAMES.ABASTECIMIENTO,
      SECTION_NAMES.RECURSOS_HUMANOS,
      SECTION_NAMES.ARMAMENTO,
    ],
  })

  if (!isAuthorized) {
    redirect('/dashboard')
  }
  return (
    <>
      {children}
      {modal}
    </>
  )
}
