import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/modules/common/components/dialog/dialog'

import { Label } from '@/modules/common/components/label/label'
import { Input } from '@/modules/common/components/input/input'
import { Renglon } from '@prisma/client'
import { Button } from '@/modules/common/components/button'
import { deleteItem } from '@/app/(main)/dashboard/abastecimiento/inventario/lib/actions/items'
import { useToast } from '@/modules/common/components/toast/use-toast'
function DeleteDialog({ renglon }: { renglon: Renglon }) {
  const { toast } = useToast()
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Eliminar Renglón - {renglon.nombre}</DialogTitle>
        <DialogDescription>
          Estás a punto de eliminar este renglón y todas sus dependencias,
          introduce la contraseña de administrador para borrarlo
          permanentemente.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="flex flex-col items-center gap-4">
          <Label htmlFor="adminPassword" className="text-right">
            Contraseña de administrador
          </Label>
          <Input
            id="adminPassword"
            type="password"
            value="Pedro Duarte"
            className="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        <Button
          type="submit"
          variant="destructive"
          onClick={(e) => {
            e.preventDefault()
            deleteItem(renglon.id).then(() => {
              toast({
                title: 'Renglón eliminado',
                description: 'Renglón eliminado permanentemente',
                variant: 'success',
              })
            })
          }}
        >
          Borrar Permanentemente
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

export default DeleteDialog
