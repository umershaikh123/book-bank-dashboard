import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyToken } from "@/utils/verifyToken"

const sql = neon(process.env.DATABASE_URL || "")
export const dynamic = "force-dynamic"
export async function GET(req: Request) {
  try {
    // Verify JWT
    const authHeader = req.headers.get("authorization")
    await verifyToken(authHeader || "")

    // Fetch books from the database
    const books = await sql`
      SELECT 
        isbn, 
        title, 
        author, 
        category, 
        total_copies AS "totalCopies", 
        available_copies AS "availableCopies", 
        price, 
        subject, 
        grade_level AS "gradeLevel", 
        image, 
        created_at AS "createdAt", 
        updated_at AS "updatedAt" 
      FROM books
    `

    return NextResponse.json({ success: true, data: books }, { status: 200 })
  } catch (err) {
    console.error("Error fetching books:", err)
    return NextResponse.json({ success: false, error: err }, { status: 401 })
  }
}

// import { useQuery } from "@tanstack/react-query";

// export default function Books() {
//   const fetchBooks = async () => {
//     const res = await fetch("/api/books/get", {
//       headers: {
//         Authorization: `Bearer YOUR_JWT_TOKEN`,
//       },
//     });
//     if (!res.ok) throw new Error("Failed to fetch books");
//     return res.json();
//   };

//   const { data, error, isLoading } = useQuery(["books"], fetchBooks);

//   if (isLoading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error.message}</p>;

//   return (
//     <div>
//       <h1>Books</h1>
//       {data.map((book: any) => (
//         <div key={book.isbn}>
//           <p>{book.title}</p>
//         </div>
//       ))}
//     </div>
//   );
// }
