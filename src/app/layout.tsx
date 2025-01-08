import type { Metadata } from "next"
import QueryProvider from "@/utils/Provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={` antialiased`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
