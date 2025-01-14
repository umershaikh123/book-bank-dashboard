import { pgTable, text, integer, serial, jsonb, timestamp, date } from "drizzle-orm/pg-core"

// Define the books table
export const booksTable = pgTable("books", {
  title: text("title").primaryKey(),
  author: text("author").notNull(),
  category: text("category").notNull(),
  totalCopies: integer("total_copies").notNull(),
  availableCopies: integer("available_copies").notNull(),
  price: integer("price").notNull(),
  image: text("image"),
})

// Define the forms table schema
export const formsTable = pgTable("forms", {
  form_number: serial("form_number").primaryKey(),
  student_cnic: text("student_cnic").notNull(),
  name: text("name").notNull(),
  father_name: text("father_name").notNull(),
  mobile: text("mobile").notNull(),
  address: text("address").notNull(),
  books_required: jsonb("books_required").notNull(),
  borrowed_status: text("borrowed_status").notNull(),
  request_status: text("request_status").notNull(),
  // book_return_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, use YYYY-MM-DD").notNull(),
  book_return_date: date("book_return_date").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
})
