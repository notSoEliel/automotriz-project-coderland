import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CarFront, Building2, DollarSign, Activity } from 'lucide-react';

export default function Dashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Panel de Control</h1>
                <p className="text-sm text-zinc-500 mt-1">Resumen general de la concesionaria.</p>
            </div>

            {/* Tarjetas de Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-zinc-500">Total Vehículos</CardTitle>
                        <CarFront size={18} className="text-zinc-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-zinc-950">124</div>
                        <p className="text-xs text-emerald-600 font-medium mt-1">+4 esta semana</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-zinc-500">Agencias Activas</CardTitle>
                        <Building2 size={18} className="text-zinc-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-zinc-950">5</div>
                        <p className="text-xs text-zinc-500 mt-1">Operando con normalidad</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-zinc-500">Valor del Inventario</CardTitle>
                        <DollarSign size={18} className="text-zinc-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-zinc-950">$3,250,000</div>
                        <p className="text-xs text-zinc-500 mt-1">Equivalente a 117,000,000 VES</p>
                    </CardContent>
                </Card>
            </div>

            {/* Sección de Actividad Reciente */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Activity size={18} className="text-emerald-600" />
                            Actividad Reciente
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 border-b border-zinc-100 pb-4">
                                <div className="mt-0.5 rounded-full bg-emerald-100 p-1.5 text-emerald-600">
                                    <CarFront size={14} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-zinc-950">Nuevo vehículo registrado</p>
                                    <p className="text-xs text-zinc-500">Toyota Corolla 2024 agregado a la agencia Centro.</p>
                                    <span className="text-xs text-zinc-400 mt-1 block">Hace 2 horas</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="mt-0.5 rounded-full bg-blue-100 p-1.5 text-blue-600">
                                    <Building2 size={14} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-zinc-950">Actualización de Agencia</p>
                                    <p className="text-xs text-zinc-500">Se modificaron los métodos de pago de la agencia Norte.</p>
                                    <span className="text-xs text-zinc-400 mt-1 block">Ayer a las 16:30</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}