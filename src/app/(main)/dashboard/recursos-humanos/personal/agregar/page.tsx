import { Metadata } from 'next'
import {
  HeaderLeftSide,
  PageContent,
  PageHeader,
  PageHeaderDescription,
  PageHeaderTitle,
} from '@/modules/layout/templates/page'
import { buttonVariants } from '@/modules/common/components/button'
import { ArrowLeft, PackagePlus } from 'lucide-react'
import Link from 'next/link'
import PersonnelForm from './form'

export const metadata: Metadata = {
  title: 'Personal',
  description: 'El personal son las personas que trabajan en el CESERLODAI',
}

export default async function Page({ params }: { params: { id: string } }) {
  return (
    <>
      <PageHeader className="mb-0">
        <HeaderLeftSide className="flex-row items-center gap-4">
          <Link
            href="/dashboard/recursos-humanos/personal"
            className={buttonVariants({ variant: 'outline' })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
          <div>
            <PageHeaderTitle>
              <PackagePlus size={24} />
              Añade nuevo personal
            </PageHeaderTitle>
            <PageHeaderDescription>
              El personal son las personas que trabajan en el CESERLODAI
            </PageHeaderDescription>
          </div>
        </HeaderLeftSide>
      </PageHeader>
      <PageContent className=" pt-5 space-y-4 md:px-[20px] xl:px-[100px] 2xl:px-[250px]">
        <PersonnelForm />
      </PageContent>
    </>
  )
}
