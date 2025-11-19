// app/(dashboard)/ubicaciones-tecnicas/page.tsx
'use client';

import dynamic from 'next/dynamic';

// Deshabilitar SSR solo para esta página
const UbicacionesTecnicas = dynamic(
  () => import('./UbicacionesTecnicasContent') as any,
  { ssr: false }
);

export default function UbicacionesTecnicasPage() {
  return <UbicacionesTecnicas />;
}