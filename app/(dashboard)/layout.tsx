// app/(dashboard)/layout.tsx
'use client'

import { SidebarProvider } from '@/components/sidebar/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { SidebarTrigger } from '@/components/sidebar/sidebar'


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-4 lg:p-6 lg:pl-1 lg:pt-4">
          <SidebarTrigger />
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}