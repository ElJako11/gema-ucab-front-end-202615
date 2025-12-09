// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Verificar si el usuario está autenticado
  const token = request.cookies.get('accessToken')?.value

  const { pathname } = request.nextUrl

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/login']
  const isPublicRoute = publicRoutes.includes(pathname)

  // Si no hay token y NO es ruta pública, redirigir al login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Si ya está autenticado y va a login, redirigir al inicio
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/ubicaciones-tecnicas', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Proteger todas las rutas excepto assets, API y archivos estáticos
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
  ]
}