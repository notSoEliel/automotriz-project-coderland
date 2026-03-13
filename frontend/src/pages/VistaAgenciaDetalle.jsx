import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import clienteAxios from '@/api/clienteAxios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Building2, MapPin, CreditCard, CarFront, Tag } from 'lucide-react';

const getImageUrl = (ruta) => {
    if (!ruta) return null;
    if (ruta.startsWith('http')) return ruta;
    return `http://localhost:8080${ruta.startsWith('/') ? '' : '/'}${ruta}`;
};

const getEstadoBadge = (estado) => {
    const map = {
        DISPONIBLE: <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white">Disponible</Badge>,
        VENDIDO: <Badge className="bg-red-500 hover:bg-red-600 text-white">Vendido</Badge>,
        RESERVADO: <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">Reservado</Badge>,
        ALQUILADO: <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Alquilado</Badge>,
    };
    return map[estado] || <Badge variant="outline">{estado}</Badge>;
};

export default function VistaAgenciaDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [agencia, setAgencia] = useState(null);
    const [vehiculos, setVehiculos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const fetchDatos = async () => {
            setCargando(true);
            try {
                const [resAgencia, resVehiculos] = await Promise.all([
                    clienteAxios.get(`/agencias/${id}`),
                    clienteAxios.get(`/vehiculos?agenciaId=${id}`)
                ]);
                setAgencia(resAgencia.data);
                setVehiculos(resVehiculos.data);
            } catch (err) {
                console.error('Error cargando detalle de agencia:', err);
            } finally {
                setCargando(false);
            }
        };
        fetchDatos();
    }, [id]);

    const getThumbnail = (v) => {
        if (v.galerias?.length > 0) return getImageUrl(v.galerias[0].rutaArchivo);
        if (v.version?.imagenDefecto) return getImageUrl(v.version.imagenDefecto);
        return null;
    };

    if (cargando) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-40 w-full rounded-lg" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-64 rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    if (!agencia) {
        return (
            <div className="text-center py-20 text-zinc-500">
                <p>No se encontro la agencia solicitada.</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate('/agencias')}>
                    <ArrowLeft size={16} className="mr-2" /> Volver a Agencias
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Boton Volver */}
            <Button
                variant="ghost"
                className="text-zinc-500 hover:text-zinc-950 -ml-2 gap-2"
                onClick={() => navigate('/agencias')}
            >
                <ArrowLeft size={16} />
                Volver a Agencias
            </Button>

            {/* Tarjeta de Informacion de la Agencia */}
            <Card className="border-zinc-200">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-emerald-50">
                            <Building2 size={24} className="text-emerald-600" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold text-zinc-950">{agencia.nombre}</CardTitle>
                            <p className="text-sm text-zinc-500 flex items-center gap-1 mt-1">
                                <MapPin size={14} />
                                {agencia.ubicacion}
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2 mb-3">
                        <CreditCard size={16} className="text-zinc-400" />
                        <span className="text-sm font-medium text-zinc-700">Metodos de Pago Aceptados</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {agencia.mediosPago && agencia.mediosPago.length > 0 ? (
                            agencia.mediosPago.map((metodo, idx) => (
                                <span key={idx} className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
                                    {metodo}
                                </span>
                            ))
                        ) : (
                            <span className="text-sm text-zinc-400">Sin metodos de pago registrados.</span>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Inventario de la Agencia */}
            <div>
                <h2 className="text-lg font-semibold text-zinc-950 mb-4 flex items-center gap-2">
                    <CarFront size={20} className="text-emerald-600" />
                    Inventario en esta Sucursal
                    <span className="text-sm font-normal text-zinc-400 ml-1">({vehiculos.length})</span>
                </h2>

                {vehiculos.length === 0 ? (
                    <div className="text-center py-12 bg-white border border-zinc-200 rounded-lg text-zinc-500">
                        No hay vehiculos estacionados en esta agencia.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {vehiculos.map(v => {
                            const thumb = getThumbnail(v);
                            return (
                                <Card key={v.id} className="overflow-hidden border-zinc-200 hover:shadow-md transition-all group">
                                    <div className="aspect-[4/3] bg-zinc-100 relative overflow-hidden">
                                        {thumb ? (
                                            <img src={thumb} alt={v.placa} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <CarFront size={48} className="text-zinc-300 opacity-30" />
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2">{getEstadoBadge(v.estado)}</div>
                                    </div>
                                    <CardContent className="p-4">
                                        <h3 className="font-bold text-zinc-950 text-lg truncate">
                                            {v.version?.modelo?.marca?.nombre} {v.version?.modelo?.nombre}
                                        </h3>
                                        <p className="text-sm text-zinc-500 truncate mb-3">{v.version?.titulo}</p>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center text-zinc-600 bg-zinc-50 p-1.5 rounded">
                                                <Tag size={12} className="mr-1.5 shrink-0" />
                                                <span className="font-mono text-xs">{v.placa}</span>
                                            </div>
                                            <div className="flex items-center text-zinc-600">
                                                <div className="w-3 h-3 rounded-full border border-zinc-300 mr-1.5 shrink-0" style={{ backgroundColor: v.colorEspecifico?.toLowerCase() }} />
                                                <span className="capitalize">{v.colorEspecifico}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
