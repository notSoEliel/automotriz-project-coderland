import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '@/api/clienteAxios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CarFront, Building2, DollarSign, CircleCheck, Plus, BookOpen, ArrowRight } from 'lucide-react';

export default function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await clienteAxios.get('/dashboard/stats');
                setStats(res.data);
            } catch (err) {
                console.error('Error cargando stats:', err);
            } finally {
                setCargando(false);
            }
        };
        fetchStats();
    }, []);

    const kpis = stats ? [
        { titulo: 'Total Vehiculos', valor: stats.totalVehiculos, icon: CarFront, color: 'text-zinc-600', bg: 'bg-zinc-100' },
        { titulo: 'Disponibles', valor: stats.vehiculosDisponibles, icon: CircleCheck, color: 'text-zinc-600', bg: 'bg-zinc-100' },
        { titulo: 'Vendidos', valor: stats.vehiculosVendidos, icon: DollarSign, color: 'text-zinc-600', bg: 'bg-zinc-100' },
        { titulo: 'Agencias', valor: stats.totalAgencias, icon: Building2, color: 'text-zinc-600', bg: 'bg-zinc-100' },
    ] : [];

    const accesos = [
        { titulo: 'Registrar Vehiculo', descripcion: 'Agrega una unidad fisica al inventario de una agencia.', icon: Plus, ruta: '/inventario' },
        { titulo: 'Ver Catalogo', descripcion: 'Consulta las marcas, modelos y versiones del catalogo maestro.', icon: BookOpen, ruta: '/catalogo' },
        { titulo: 'Gestionar Agencias', descripcion: 'Administra sucursales, ubicaciones y metodos de pago.', icon: Building2, ruta: '/agencias' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Panel de Control</h1>
                <p className="text-sm text-zinc-500 mt-1">Resumen general de la concesionaria.</p>
            </div>

            <Tabs defaultValue="resumen" className="w-full">
                <TabsList className="bg-zinc-100">
                    <TabsTrigger value="resumen" className="data-[state=active]:bg-white data-[state=active]:text-zinc-950">
                        Resumen Operativo
                    </TabsTrigger>
                    <TabsTrigger value="accesos" className="data-[state=active]:bg-white data-[state=active]:text-zinc-950">
                        Accesos Rapidos
                    </TabsTrigger>
                </TabsList>

                {/* Resumen Operativo */}
                <TabsContent value="resumen" className="mt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {cargando ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <Card key={i}>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-5 w-5 rounded" />
                                    </CardHeader>
                                    <CardContent>
                                        <Skeleton className="h-8 w-16 mt-1" />
                                        <Skeleton className="h-3 w-28 mt-3" />
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            kpis.map((kpi, i) => (
                                <Card key={i} className="transition-shadow hover:shadow-md">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                        <CardTitle className="text-sm font-medium text-zinc-500">{kpi.titulo}</CardTitle>
                                        <div className={`p-2 rounded-lg ${kpi.bg}`}>
                                            <kpi.icon size={18} className={kpi.color} />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-zinc-950">{kpi.valor}</div>
                                        <p className="text-xs text-zinc-400 mt-1">Dato actualizado en tiempo real</p>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>

                {/* Accesos Rapidos */}
                <TabsContent value="accesos" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {accesos.map((item, i) => (
                            <Card
                                key={i}
                                className="cursor-pointer border border-zinc-200 bg-white hover:border-emerald-500 hover:shadow-md transition-all group"
                                onClick={() => navigate(item.ruta)}
                            >
                                <CardContent className="p-6 flex flex-col items-start gap-4">
                                    <div className="p-3 rounded-xl bg-zinc-50 group-hover:bg-zinc-100 transition-colors">
                                        <item.icon size={24} className="text-zinc-700" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-zinc-950 text-lg">{item.titulo}</h3>
                                        <p className="text-sm text-zinc-500 mt-1">{item.descripcion}</p>
                                    </div>
                                    <div className="flex items-center text-sm font-medium text-emerald-600 group-hover:gap-2 transition-all">
                                        Ir a la seccion <ArrowRight size={14} className="ml-1" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}