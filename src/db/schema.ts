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
  book_return_date: date("book_return_date").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
})

export const studentsTable = pgTable("students", {
  email: text("email").primaryKey(),
  name: text("name").notNull(),
  father_name: text("father_name").notNull(),
  student_cnic: text("cnic").notNull(),
  mobile: text("mobile").notNull(),
  address: text("address").notNull(),
  book_history: jsonb("book_history").notNull().default([]),
  current_borrowed: jsonb("current_borrowed").notNull().default([]),
  totalBooksBorrowed: integer("totalBooksBorrowed").notNull().default(0),
  totalBooksReturned: integer("totalBooksReturned").notNull().default(0),
  totalBooksNotReturned: integer("totalBooksNotReturned").notNull().default(0),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
})

export const bookRequestsTable = pgTable("book_requests", {
  book_title: text("book_title").primaryKey(),
  serial_no: serial("serial_no").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
})
