"use client"
import { useToast } from "@/hooks/use-toast"
import { useUpdateFormStatus } from "@/hooks/useFormMutation"
import { queryClient } from "@/utils/Provider"

export function useHandleFormStatus() {
  const { toast } = useToast()
  const updateFormMutation = useUpdateFormStatus()

  const handleReject = (form_number: number, setOpenDialog: any, closeDrawer: any, setLoading: any) => {
    setLoading(true)
    updateFormMutation.mutate(
      { form_number, request_status: "Rejected" },

      {
        onSuccess: (data) => {
          console.log("Form rejected successfully:", data)
          setOpenDialog(false)
          closeDrawer()
          toast({ title: "Success", description: "Form request Rejected successfully", variant: "success" })
          queryClient.invalidateQueries()
        },
        onError: (error) => {
          console.error("Error rejecting form:", error)
          toast({ title: "Error", description: "Failed to Reject request", variant: "destructive" })
        },
        onSettled: () => {
          setLoading(false)
        },
      }
    )
  }

  const handleApprove = (form_number: number, setOpenDialog: any, closeDrawer: any, setLoading: any) => {
    setLoading(true)
    updateFormMutation.mutate(
      { form_number, request_status: "Approved" },
      {
        onSuccess: (data) => {
          console.log("Form approved successfully:", data)
          setOpenDialog(false)
          closeDrawer()
          toast({ title: "Success", description: "Form request Approved successfully", variant: "success" })
          queryClient.invalidateQueries()
        },
        onError: (error) => {
          console.error("Error approving form:", error)
          toast({ title: "Error", description: "Failed to Approve request", variant: "destructive" })
        },
        onSettled: () => {
          setLoading(false)
        },
      }
    )
  }

  const handleAccept = (form_number: number, setOpenDialog: any, closeDrawer: any, setLoading: any) => {
    setLoading(true)
    updateFormMutation.mutate(
      { form_number, request_status: "Accepted" },
      {
        onSuccess: (data) => {
          console.log("Form accepted successfully:", data)
          setOpenDialog(false)
          closeDrawer()
          toast({ title: "Success", description: "Form request Accepted successfully", variant: "success" })
          queryClient.invalidateQueries()
        },
        onError: (error) => {
          console.error("Error accepting form:", error)
          toast({ title: "Error", description: "Failed to Accept request", variant: "destructive" })
        },
        onSettled: () => {
          setLoading(false)
        },
      }
    )
  }

  return { handleReject, handleApprove, handleAccept }
}
