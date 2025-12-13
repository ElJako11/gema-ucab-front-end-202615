// app/layout.tsx
import type { Metadata } from 'next'
import { Poppins, Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '../lib/auth/contex'
import { QueryProvider } from '@/lib/providers/query-providers'
import { Toaster } from 'react-hot-toast'
import { SidebarProvider } from '@/components/sidebar/sidebar' // ← AÑADE ESTO


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins'
})

export const metadata: Metadata = {
  title: 'Tu App',
  description: 'Descripción de tu aplicación',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${poppins.variable} ${inter.variable}`}>
        <QueryProvider>
          <AuthProvider>
            <SidebarProvider> {/* ← ENVUELVE CON ESTO */}
              {children}
            </SidebarProvider>
            <Toaster position="top-right" />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}