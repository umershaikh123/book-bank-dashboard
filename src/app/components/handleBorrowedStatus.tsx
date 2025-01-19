"use client"
import { useToast } from "@/hooks/use-toast"
import { useUpdateBorrowedStatus } from "@/hooks/useFormMutation"
import { queryClient } from "@/utils/Provider"

export function useHandleFormStatus() {
  const { toast } = useToast()
  const updateFormMutation = useUpdateBorrowedStatus()

  const handleNotReturned = (form_number: number, setOpenDialog: any, closeDrawer: any) => {
    updateFormMutation.mutate(
      { form_number, borrowed_status: "NotReturned" },
      {
        onSuccess: (data) => {
          console.log("Form updated successfully:", data)
          setOpenDialog(false)
          closeDrawer()
          toast({ title: "Success", description: "Borrowed Status changed to Not Returned successfully", variant: "default" })
          queryClient.invalidateQueries()
        },
        onError: (error) => {
          console.error("Error in changing borrowed status", error)
          toast({ title: "Error", description: "Error in changing borrowed status", variant: "destructive" })
        },
      }
    )
  }

  const handleReturned = (form_number: number, setOpenDialog: any, closeDrawer: any) => {
    updateFormMutation.mutate(
      { form_number, borrowed_status: "returned" },
      {
        onSuccess: (data) => {
          console.log("Form accepted successfully:", data)
          setOpenDialog(false)
          closeDrawer()

          toast({ title: "Success", description: "Borrowed Status changed to  Returned successfully", variant: "default" })
          queryClient.invalidateQueries()
        },
        onError: (error) => {
          console.error("Error in changing borrowed status", error)
          toast({ title: "Error", description: "Error in changing borrowed status", variant: "destructive" })
        },
      }
    )
  }

  return { handleNotReturned, handleReturned }
}
