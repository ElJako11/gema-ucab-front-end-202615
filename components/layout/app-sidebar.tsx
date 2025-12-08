// components/layout/app-sidebar.tsx - RUTAS CORREGIDAS
'use client'

import { useEffect, useRef } from "react"
import { LogOut, MapPin, UserCircle, Users, UserPlus, FileText, ClipboardCheck, Calendar } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/sidebar/sidebar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth/contex"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"

const items = [
  {
    icon: MapPin,
    label: "Ubicaciones Técnicas",
    path: "/ubicaciones-tecnicas",
  },
  {
    icon: Users,
    label: "Grupos de Trabajo",
    path: "/grupos-trabajo"
  },
  {
    icon: UserPlus,
    label: 'Tecnicos',
    path: '/tecnicos'
  },
  {
    icon: FileText,
    label: 'Plantillas',
    path: '/plantillas'
  },
  {
    icon: ClipboardCheck,
    label: 'Mantenimientos por Inspección',
    path: '/mantenimientos-inspeccion'
  },
  {
    icon: Calendar,
    label: 'Calendario',
    path: '/calendario'
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { isMobile, setOpenMobile } = useSidebar()
  const prevPathnameRef = useRef(pathname)

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/iniciar-sesion")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  // Cerrar el menú móvil cuando cambia la ruta (solo si realmente cambió)
  useEffect(() => {
    if (isMobile && prevPathnameRef.current !== pathname) {
      setOpenMobile(false)
      prevPathnameRef.current = pathname
    }
  }, [pathname, isMobile, setOpenMobile])

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="py-4 px-10 flex items-center h-fit">
                <UserCircle size={24} />
                <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                  <span className="text-[1.05rem] font-semibold text-wrap!">
                    {user?.nombre || "Usuario"}
                  </span>
                  <span className="text-sm">Coordinador</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="h-px bg-foreground/20 w-full mb-2 group-data-[collapsible=icon]:hidden" />
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
                  <span className="group-data-[collapsible=icon]:hidden">
                    {item.label}
                  </span>
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
                <span className="text-neutral-600 group-data-[collapsible=icon]:hidden">Cerrar sesión</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}