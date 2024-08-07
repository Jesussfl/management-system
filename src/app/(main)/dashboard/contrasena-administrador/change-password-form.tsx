'use client'
import * as React from 'react'

import { useForm, SubmitHandler } from 'react-hook-form'
import { Button } from '@/modules/common/components/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/modules/common/components/form'
import { DialogFooter } from '@/modules/common/components/dialog/dialog'
import { useToast } from '@/modules/common/components/toast/use-toast'

import { useRouter } from 'next/navigation'
import { Input } from '@/modules/common/components/input/input'
import { validatePassword } from '@/utils/helpers/validate-password'
import { validateAdminPassword } from '@/utils/helpers/validate-admin-password'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/modules/common/components/alert'
import { FileWarning, Rocket } from 'lucide-react'
import { updateAdminPassword } from './lib/actions'

// type User = Prisma.UsuarioGetPayload<{ include: { rol: true } }>
type FormValues = {
  password: string
  confirmPassword: string
}
interface Props {
  id: string
}

export default function ChangeAdminPasswordForm() {
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<FormValues>({})
  const [isPending, startTransition] = React.useTransition()

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    startTransition(() => {
      updateAdminPassword(values).then((data) => {
        if (data?.success) {
          toast({
            title: 'Contraseña actualizado',
            description: 'La contraseña se ha actualizado correctamente',
            variant: 'success',
          })

          router.replace('/dashboard')
        }
      })
    })
  }

  return (
    <Form {...form}>
      <form
        style={{
          scrollbarGutter: 'stable both-edges',
        }}
        className="flex-1 overflow-y-auto px-8 gap-8 mb-36"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Alert variant={'destructive'} className="mb-8">
          <FileWarning className="h-4 w-4" />
          <AlertTitle>
            Una vez cambiada la contraseña, no podrás visualizarla.{' '}
          </AlertTitle>
          <AlertDescription>
            La contraseña de administrador es utilizada para registrar nuevos
            usuarios y cambiar la contraseña de los mismos.
          </AlertDescription>
        </Alert>
        <FormField
          control={form.control}
          name="password"
          rules={{
            required: true,
            validate: (value) => validatePassword({ value }),
          }}
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  {...field}
                  disabled={isPending}
                  placeholder="**********"
                />
              </FormControl>
              <FormDescription>
                La contraseña debe contener al menos 8 carácteres, una letra
                mayúscula, una letra minúscula, un número y un caracter especial
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          rules={{
            required: 'Contraseña requerida',
            validate: (value) => value === form.getValues('password'),
          }}
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Confirmar contraseña</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  {...field}
                  disabled={isPending}
                  placeholder="**********"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="fixed right-0 bottom-0 bg-white pt-4 border-t border-border gap-4 items-center w-full p-8">
          <Button variant="default" type="submit">
            Guardar
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
