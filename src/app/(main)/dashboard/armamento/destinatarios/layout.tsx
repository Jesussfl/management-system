import { validateSections } from '@/lib/data/validate-permissions'
import { SECTION_NAMES } from '@/utils/constants/sidebar-constants'
import { redirect } from 'next/navigation'
export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAuthorized = await validateSections({
    sections: [SECTION_NAMES.DESTINATARIOS_ARMAMENTO, SECTION_NAMES.ARMAMENTO],
  })

  if (!isAuthorized) {
    redirect('/dashboard')
  }
  return <>{children}</>
}
