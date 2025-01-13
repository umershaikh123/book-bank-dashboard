import { pgTable, text, integer, serial } from "drizzle-orm/pg-core"

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
