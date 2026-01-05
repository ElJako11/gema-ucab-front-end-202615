'use client'

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Cell,
    LabelList,
    RadialBarChart,
    RadialBar,
    PolarAngleAxis,
} from 'recharts'
import {
    useMantenimientosReabiertos,
    useMantenimientosActivosPorArea,
    useMantenimientosReabiertosPorArea,
    useMantenimientosResumenMesActual,
} from '@/hooks/estadisticas/useEstadisticas'


export default function EstadisticasPage() {
    const { data: totalReabiertos, isLoading: isLoadingReabiertos } = useMantenimientosReabiertos()
    const { data: mantenimientosActivosPorArea, isLoading: isLoadingActivos } = useMantenimientosActivosPorArea()
    const { data: mantenimientosReabiertosPorArea, isLoading: isLoadingReabiertosPorArea } = useMantenimientosReabiertosPorArea()
    const { data: mantenimientosResumenMesActual, isLoading: isLoadingResumenMesActual } = useMantenimientosResumenMesActual()


    const chartActivos = (mantenimientosActivosPorArea ?? []).map(({ Grupo, Total }) => ({
        name: Grupo,
        value: Total,
    }))

    const chartReabiertos = (mantenimientosReabiertosPorArea ?? []).map(({ Grupo, Total }) => ({
        name: Grupo,
        value: Total,
    }))

    const chartResumenMesActual = mantenimientosResumenMesActual ?? {
        totalMantenimientos: 0,
        completados: 0,
        porcentajeCompletados: 0,
        }


    return (

        
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Estadísticas Generales</h1>
                <p className="text-gray-500">visualiza las distintas estadísticas generadas</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tarjeta: Cantidad de Mantenimientos Reabiertos este Mes */}
                <div className="bg-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[240px]">
                    <h2 className="text-xl font-semibold text-gray-700 text-center mb-6">
                        Cantidad de Mantenimientos Reabiertos<br />este Mes
                    </h2>
                    {isLoadingReabiertos ? (
                        <p className="text-2xl font-bold text-gray-900">Cargando...</p>
                    ) : (
                        <p className="text-8xl font-bold text-gray-900">{totalReabiertos ?? '—'}</p>
                    )}
                </div>

                {/* Gráfico de barras: Mantenimientos activos por área encargada */}



                <div className="bg-gray-200 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-gray-700 text-center mb-4">
                        Mantenimientos activos por área encargada
                    </h2>
                    {isLoadingActivos ? (
                        <p className="text-2xl font-bold text-gray-900">Cargando...</p>
                    ) : (
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={chartActivos.length ? chartActivos : []} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                            <defs>
                                {/* grupo 1*/}
                                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#1d4ed8" />
                                    <stop offset="100%" stopColor="#60a5fa" />
                                </linearGradient>
                                {/* grupo 2*/}
                                <linearGradient id="yellowGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#ca8a04" />
                                    <stop offset="100%" stopColor="#fde047" />
                                </linearGradient>
                                {/* grupo 3*/}
                                <linearGradient id="greenBarGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#15803d" />
                                    <stop offset="100%" stopColor="#86efac" />
                                </linearGradient>
                                {/* grupo 4 */}
                                <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#b91c1c" />
                                    <stop offset="100%" stopColor="#fca5a5" />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 11, fill: '#374151' }}
                                axisLine={{ stroke: '#000000', strokeWidth: 1 }}
                                tickLine={false}
                            />
                            <YAxis
                                axisLine={{ stroke: '#000000', strokeWidth: 1 }}
                                tickLine={false}    
                                tick={false}
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                <Cell fill="url(#blueGradient)" />
                                <Cell fill="url(#yellowGradient)" />
                                <Cell fill="url(#greenBarGradient)" />
                                <Cell fill="url(#redGradient)" />
                                <LabelList
                                    dataKey="value"
                                    position="top"
                                    style={{ fontSize: 12, fontWeight: 600, fill: '#374151' }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>)}

                </div>

                {/* Gráfico de barras: Mantenimientos Reabiertos por área encargada */}


                <div className="bg-gray-200 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-gray-700 text-center mb-4">
                        Mantenimientos Reabiertos por área encargada
                    </h2>
                    {isLoadingReabiertosPorArea ? (
                        <p className="text-2xl font-bold text-gray-900">Cargando...</p>
                    ) : (
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={chartReabiertos.length ? chartReabiertos :[] } margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 11, fill: '#374151' }}
                                axisLine={{ stroke: '#000000', strokeWidth: 1 }}
                                tickLine={false}
                            />
                            <YAxis
                                axisLine={{ stroke: '#000000', strokeWidth: 1 }}
                                tickLine={false}
                                tick={false}
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                <Cell fill="url(#blueGradient)" />
                                <Cell fill="url(#yellowGradient)" />
                                <Cell fill="url(#greenBarGradient)" />
                                <Cell fill="url(#redGradient)" />
                                <LabelList
                                    dataKey="value"
                                    position="top"
                                    style={{ fontSize: 12, fontWeight: 600, fill: '#374151' }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>)}
                </div>

                {/* Gráfico radial: usa mantenimientosResumenMesActual si llega */}
                <div className="bg-gray-200 rounded-2xl p-8 flex items-center justify-center min-h-[240px]">
                    <div className="flex items-center justify-center gap-10 w-full">
                        <div className="relative w-48 h-48">
                            
                            {isLoadingResumenMesActual ? (
                                <p className="text-2xl font-bold text-gray-900">Cargando...</p>
                            ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="70%"
                                    outerRadius="100%"
                                    barSize={12}
                                    data={[
                                        {
                                            name: 'Finalizados',
                                            value: mantenimientosResumenMesActual?.porcentajeCompletados ?? 0,
                                            fill: '#22c55e',
                                        },
                                    ]}
                                    startAngle={90}
                                    endAngle={-270}
                                >
                                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                                    <RadialBar background={{ fill: '#e5e7eb' }} dataKey="value" cornerRadius={10} />
                                </RadialBarChart>
                            </ResponsiveContainer>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-4xl font-bold text-green-600">
                                    {isLoadingResumenMesActual
                                        ? '...'
                                        : `${mantenimientosResumenMesActual?.porcentajeCompletados ?? 0}%`}
                                </span>
                            </div>
                        </div>
                        <div className="text-left">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Mantenimientos<br />Finalizados por Mes
                            </h2>
                            <p className="text-4xl font-semibold text-gray-700 mt-3">
                                {isLoadingResumenMesActual ? '...' : mantenimientosResumenMesActual?.completados ?? 0}
                            </p>
                            <p className="text-lg text-gray-600">mantenimientos</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
