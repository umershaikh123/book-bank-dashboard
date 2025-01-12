import type { Metadata } from "next"
import QueryProvider from "@/utils/Provider"
import "./globals.css"
import "react-toastify/dist/ReactToastify.css"
import { IBM_Plex_Mono } from "next/font/google"
export const metadata: Metadata = {
  title: "Book Bank",
  description: "Book Bank is an app for lending out free books from Islamic Culture Center",
}

const IBM_Plex_MonoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${IBM_Plex_MonoFont.className} antialiased`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
