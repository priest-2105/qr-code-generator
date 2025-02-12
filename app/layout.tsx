import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'QR code Generator',
  description: '',
  generator: '',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <link rel="shortcut icon" href="/logo-favicon.png" type="image/x-icon" />
      <body>{children}</body>
    </html>
  )
}
