import { z } from "zod"

export const formSchema = z.object({
  form_number: z.number().int("Form number must be an integer").optional(),
  student_cnic: z.string().min(1, "Student cnic required").optional(),
  name: z.string().min(1, "Name is required").optional(),
  father_name: z.string().min(1, "Father's name is required").optional(),
  mobile: z.string().min(1, "mobile no required").optional(),
  address: z.string().min(1, "Address is required").optional(),
  books_required: z.number().int("Books required must be an integer").min(1, "At least one book is required").optional(),
  borrowed_status: z.boolean().optional(),
  request_status: z.enum(["Pending", "Approved", "Accepted", "Rejected"]).optional(),
  created_at: z
    .string()
    .regex(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/, "Invalid date format (ISO 8601)")
    .optional(),
  updated_at: z
    .string()
    .regex(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/, "Invalid date format (ISO 8601)")
    .optional(),
})
