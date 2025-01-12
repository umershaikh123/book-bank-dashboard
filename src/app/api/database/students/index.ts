import { z } from "zod"

// Define book history object
const bookHistorySchema = z.object({
  book_id: z.string().uuid("Invalid book ID format"),
  borrowedDate: z.string().regex(/\d{4}-\d{2}-\d{2}/, "Invalid date format (YYYY-MM-DD)"),
  returned: z.boolean(),
  returnDate: z
    .string()
    .regex(/\d{4}-\d{2}-\d{2}/, "Invalid date format (YYYY-MM-DD)")
    .optional(),
})

// Define current borrowed object
const currentBorrowedSchema = z.object({
  book_id: z.string().uuid("Invalid book ID format"),
  due_date: z.string().regex(/\d{4}-\d{2}-\d{2}/, "Invalid date format (YYYY-MM-DD)"),
})

// Define the full student schema
export const studentSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  father_name: z.string().min(1, "Father's name is required").optional(),
  cnic: z.string().min(1, "CNIC is required").optional(),
  mobile: z
    .string()
    .min(1, "Mobile number is required")
    .regex(/^\d{4}-\d{7}$/, "Invalid mobile format (e.g., 0332-9087421)"),

  email: z.string().email("Invalid email format").optional(),
  address: z.string().min(1, "Address is required").optional(),
  book_history: z.array(bookHistorySchema).optional(),
  current_borrowed: z.array(currentBorrowedSchema).optional(),
  TotalBooksBorrowed: z.number().int().optional(),
  TotalBooksReturned: z.number().int().optional(),
  TotalNotReturnedBooks: z.number().int().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
})
