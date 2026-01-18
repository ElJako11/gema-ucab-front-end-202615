// components/layout/app-sidebar.tsx - RUTAS CORREGIDAS
'use client'

import { useEffect, useRef } from "react"
import { LogOut, MapPin, UserCircle, Users, UserPlus, FileText, ClipboardCheck, Calendar, User, BarChart3, File } from "lucide-react"
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
import { useAuth } from "@/lib/auth/context"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"

// Definir los roles permitidos en el sistema
type UserRole = 'SUPERVISOR' | 'COORDINADOR' | 'DIRECTOR';

interface MenuItem {
  icon: any;
  label: string;
  path: string;
  roles?: UserRole[]; // Roles permitidos para ver este ítem. Si no se define, es público para todos los logueados.
}

const items: MenuItem[] = [
  {
    icon: Calendar,
    label: 'Calendario',
    path: '/calendario'
  },
  {
    icon: MapPin,
    label: "Ubicaciones Técnicas",
    path: "/ubicaciones-tecnicas",
  },
  {
    icon: Users,
    label: "Grupos de Trabajo",
    path: "/grupos-de-trabajo",
  },
  {
    icon: UserPlus,
    label: 'Tecnicos',
    path: '/tecnicos'
  },
  {
    icon: FileText,
    label: 'Resumen',
    path: '/resumen',
    roles: ['DIRECTOR', 'COORDINADOR'] // Solo directores y coordinadores pueden ver el resumen
  },
  {
    icon: User,
    label: 'Usuarios',
    path: '/usuarios',
    roles: ['DIRECTOR'] // Ejemplo: Solo directores y coordinadores ven esto
  },
  {
    icon: ClipboardCheck,
    label: 'Mantenimientos por Inspección',
    path: '/mantenimientos-inspeccion',
    roles: ['DIRECTOR', 'COORDINADOR']
  },
  {
    icon: File,
    label: 'Plantillas',
    path: '/plantillas',
    roles: ['DIRECTOR', 'COORDINADOR'] // Solo directores y coordinadores pueden ver plantillas
  },
  {
    icon: BarChart3,
    label: 'Estadísticas',
    path: '/estadisticas',
    roles: ['DIRECTOR'] // Solo directores pueden ver estadísticas
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
      // 1. Ejecutar la lógica del contexto (que llama a la API)
      await logout()

      // 2. Redirigir al login forzando recarga
      window.location.href = "/login"

    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      // Fallback en caso de error crítico
      window.location.href = "/login"
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
                  <span className="text-sm capitalize text-gray-500">
                    {user?.tipo?.toLowerCase() || "Sin rol"}
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="h-px bg-foreground/20 w-full mb-2 group-data-[collapsible=icon]:hidden" />
      </SidebarHeader>


      <SidebarContent>
        <SidebarMenu>
          {items.filter(item => {
            if (!item.roles) return true;
            // Normalizar el rol del usuario a mayúsculas para comparar
            const currentRole = user?.tipo?.toUpperCase() as UserRole;
            return item.roles.includes(currentRole);
          }).map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.path)}
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
