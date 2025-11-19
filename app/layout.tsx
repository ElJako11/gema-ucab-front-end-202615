// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from './(auth)/contex'
import { QueryProvider } from '@/lib/providers/query-providers'
import { Toaster } from 'react-hot-toast'
import { SidebarProvider } from '@/components/sidebar/sidebar' // ← AÑADE ESTO

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className}>
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