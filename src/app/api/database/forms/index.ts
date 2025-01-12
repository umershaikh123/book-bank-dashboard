import { z } from "zod"

export const formSchema = z.object({
  form_number: z.number().int("Form number must be an integer"),
  student_cnic: z.string().regex(/^\d{5}-\d{7}-\d$/, "Invalid CNIC format (e.g., 42000-1036212-3)"),
  name: z.string().min(1, "Name is required"),
  father_name: z.string().min(1, "Father's name is required"),
  mobile: z.string().regex(/^\d{4}-\d{7}$/, "Invalid mobile format (e.g., 0332-9087421)"),
  address: z.string().min(1, "Address is required"),
  books_required: z.number().int("Books required must be an integer").min(1, "At least one book is required"),
  borrowed_status: z.boolean(),
  request_status: z.enum(["pending", "approved", "rejected"]),
  created_at: z.string().regex(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/, "Invalid date format (ISO 8601)"),
  updated_at: z.string().regex(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/, "Invalid date format (ISO 8601)"),
})
