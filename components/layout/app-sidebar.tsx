// components/layout/app-sidebar.tsx - RUTAS CORREGIDAS
'use client'

import { LogOut, MapPin, UserCircle, Users, UserPlus } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/sidebar/sidebar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/(auth)/contex"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"

const items = [
  {
    icon: MapPin,
    label: "Ubicaciones Técnicas",
    path: "/ubicaciones-tecnicas", // ← SIN /dashboard
  },
  {
    icon: Users,
    label: "Grupos de Trabajo",
    path: "/grupos" // ← SIN /dashboard
  },
  {
    icon: UserPlus,
    label: 'Tecnicos',
    path: '/tecnicos' // ← SIN /dashboard
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/iniciar-sesion")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center h-fit">
                <UserCircle size={24} />
                <div className="flex flex-col">
                  <span className="text-[1.05rem] font-semibold !text-wrap">
                    {user?.nombre || "Usuario"}
                  </span>
                  <span className="text-sm">Coordinador</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <hr className="border-neutral-400 mb-2" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.path}
              >
                <Link href={item.path}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button
                variant="ghost"
                onClick={handleLogout}
              >
                <LogOut size={20} className="text-neutral-600" />
                <span className="text-neutral-600">Cerrar sesión</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}