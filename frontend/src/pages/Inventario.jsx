import { useState, useEffect } from 'react';
import clienteAxios from '@/api/clienteAxios';
import SubNavCatalogo from '@/components/catalogo/SubNavCatalogo';
import { CarFront, Search, LayoutGrid, List, Plus, MapPin, Tag, Eye, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ModalVehiculo from '@/components/inventario/ModalVehiculo';
import DetalleVehiculo from '@/components/inventario/DetalleVehiculo';

const getImageUrl = (ruta) => {
    if (!ruta) return null;
    if (ruta.startsWith('http')) return ruta;
    return `http://localhost:8080${ruta.startsWith('/') ? '' : '/'}${ruta}`;
};

export default function Inventario() {
    const [vehiculos, setVehiculos] = useState([]);
    const [agencias, setAgencias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [vista, setVista] = useState('galeria');
    const [refreshKey, setRefreshKey] = useState(0);

    const [filtroPlaca, setFiltroPlaca] = useState('');
    const [filtroAgencia, setFiltroAgencia] = useState('todas');
    const [filtroEstado, setFiltroEstado] = useState('todos');

    const [modalAbierto, setModalAbierto] = useState(false);
    const [vehiculoEdicion, setVehiculoEdicion] = useState(null);
    const [vehiculoDetalle, setVehiculoDetalle] = useState(null);

    const estadosVehiculo = ['DISPONIBLE', 'RESERVADO', 'VENDIDO', 'ALQUILADO'];

    useEffect(() => {
        const fetchDatos = async () => {
            setCargando(true);
            try {
                const params = new URLSearchParams();
                if (filtroAgencia !== 'todas') params.append('agenciaId', filtroAgencia);
                if (filtroEstado !== 'todos') params.append('estado', filtroEstado);
                const [resV, resA] = await Promise.all([
                    clienteAxios.get(`/vehiculos?${params.toString()}`),
                    clienteAxios.get('/agencias')
                ]);
                setVehiculos(resV.data);
                setAgencias(resA.data);
            } catch (error) {
                console.error("Error cargando inventario:", error);
            } finally {
                setCargando(false);
            }
        };
        fetchDatos();
    }, [refreshKey, filtroAgencia, filtroEstado]);

    const vehiculosFiltrados = vehiculos.filter(v =>
        (v.placa || '').toLowerCase().includes(filtroPlaca.toLowerCase())
    );

    const getEstadoBadge = (estado) => {
        const map = {
            DISPONIBLE: <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white">Disponible</Badge>,
            VENDIDO: <Badge className="bg-red-500 hover:bg-red-600 text-white">Vendido</Badge>,
            RESERVADO: <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">Reservado</Badge>,
            ALQUILADO: <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Alquilado</Badge>,
        };
        return map[estado] || <Badge variant="outline">{estado}</Badge>;
    };

    const getThumbnail = (v) => {
        if (v.galerias?.length > 0) return getImageUrl(v.galerias[0].rutaArchivo);
        if (v.version?.imagenDefecto) return getImageUrl(v.version.imagenDefecto);
        return null;
    };

    const handleEliminar = async (e, id) => {
        e.stopPropagation();
        if (!confirm('¿Eliminar este vehículo permanentemente?')) return;
        try {
            await clienteAxios.delete(`/vehiculos/${id}`);
            setRefreshKey(k => k + 1);
        } catch (err) {
            console.error(err);
            alert('Error al eliminar.');
        }
    };

    const abrirDetalle = (v) => setVehiculoDetalle(v);
    const cerrarDetalle = () => { setVehiculoDetalle(null); setRefreshKey(k => k + 1); };
    const abrirModalCrear = () => { setVehiculoEdicion(null); setModalAbierto(true); };
    const abrirModalEditar = (e, v) => { e.stopPropagation(); setVehiculoEdicion(v); setModalAbierto(true); };

    // ── Vista Detalle (Nivel 5) ────────────────────────────────
    if (vehiculoDetalle) {
        return (
            <DetalleVehiculo
                vehiculo={vehiculoDetalle}
                onVolver={cerrarDetalle}
                onEditar={(v) => { setVehiculoDetalle(null); setVehiculoEdicion(v); setModalAbierto(true); }}
                agencias={agencias}
                onSuccess={cerrarDetalle}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-950 flex items-center gap-2">
                        <CarFront size={24} className="text-emerald-600" /> Inventario Físico
                    </h1>
                    <p className="text-sm text-zinc-500 mt-1">Gestiona los vehículos reales en las agencias.</p>
                </div>
                <Button onClick={abrirModalCrear} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                    <Plus size={16} /> Registrar Vehículo
                </Button>
            </div>

            <SubNavCatalogo />

            {/* Filtros */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                        <Input placeholder="Buscar por placa..." value={filtroPlaca} onChange={e => setFiltroPlaca(e.target.value)} className="pl-9 bg-white uppercase" />
                    </div>
                    <Select value={filtroAgencia} onValueChange={setFiltroAgencia}>
                        <SelectTrigger className="w-full md:w-[200px] bg-white"><SelectValue placeholder="Agencia" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todas">Todas las Agencias</SelectItem>
                            {agencias.map(a => <SelectItem key={a.id} value={a.id.toString()}>{a.nombre}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                        <SelectTrigger className="w-full md:w-[150px] bg-white"><SelectValue placeholder="Estado" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos</SelectItem>
                            {estadosVehiculo.map(e => <SelectItem key={e} value={e}>{e.charAt(0) + e.slice(1).toLowerCase()}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-md border border-zinc-200 p-1">
                    <Button variant={vista === 'tabla' ? 'secondary' : 'ghost'} size="sm" onClick={() => setVista('tabla')} className={`px-3 ${vista === 'tabla' ? 'bg-zinc-100' : ''}`}>
                        <List size={16} className="mr-2" /> Tabla
                    </Button>
                    <Button variant={vista === 'galeria' ? 'secondary' : 'ghost'} size="sm" onClick={() => setVista('galeria')} className={`px-3 ${vista === 'galeria' ? 'bg-zinc-100' : ''}`}>
                        <LayoutGrid size={16} className="mr-2" /> Galería
                    </Button>
                </div>
            </div>

            {/* Contenido */}
            {cargando ? (
                <div className="text-center py-12 text-zinc-500">Cargando inventario...</div>
            ) : vehiculosFiltrados.length === 0 ? (
                <div className="text-center py-12 bg-white border border-zinc-200 rounded-lg text-zinc-500">No se encontraron vehículos.</div>
            ) : vista === 'tabla' ? (
                <div className="border border-zinc-200 rounded-lg bg-white overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-zinc-50">
                            <TableRow>
                                <TableHead className="sticky left-0 z-20 bg-zinc-50 font-semibold text-zinc-950 min-w-[120px] shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)]">Placa</TableHead>
                                <TableHead className="font-semibold text-zinc-950 min-w-[60px]">Foto</TableHead>
                                <TableHead className="font-semibold text-zinc-950 min-w-[200px]">Vehículo</TableHead>
                                <TableHead className="font-semibold text-zinc-950 min-w-[160px]">Agencia</TableHead>
                                <TableHead className="font-semibold text-zinc-950 min-w-[120px]">Color</TableHead>
                                <TableHead className="font-semibold text-zinc-950 text-center min-w-[110px]">Estado</TableHead>
                                <TableHead className="sticky right-0 z-20 bg-zinc-50 font-semibold text-zinc-950 text-right min-w-[120px] shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.08)]">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {vehiculosFiltrados.map(v => {
                                const thumb = getThumbnail(v);
                                return (
                                    <TableRow key={v.id} className="cursor-pointer hover:bg-zinc-50 transition-colors" onClick={() => abrirDetalle(v)}>
                                        <TableCell className="sticky left-0 z-10 bg-white font-mono font-semibold text-zinc-900 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.06)]">{v.placa}</TableCell>
                                        <TableCell>
                                            <div className="w-12 h-9 rounded overflow-hidden bg-zinc-100 flex items-center justify-center">
                                                {thumb ? <img src={thumb} alt={v.placa} className="w-full h-full object-cover" /> : <CarFront size={20} className="text-zinc-300" />}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium text-zinc-900">{v.version?.modelo?.marca?.nombre} {v.version?.modelo?.nombre}</div>
                                            <div className="text-xs text-zinc-500">{v.version?.titulo}</div>
                                        </TableCell>
                                        <TableCell className="text-zinc-600"><span className="flex items-center gap-1"><MapPin size={14} className="text-zinc-400" />{v.agencia?.nombre}</span></TableCell>
                                        <TableCell className="text-zinc-600">
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full border border-zinc-300" style={{ backgroundColor: v.colorEspecifico?.toLowerCase() }} />
                                                <span className="capitalize">{v.colorEspecifico}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">{getEstadoBadge(v.estado)}</TableCell>
                                        <TableCell className="sticky right-0 z-10 bg-white shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.06)] text-right">
                                            <div className="flex justify-end items-center gap-1" onClick={e => e.stopPropagation()}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => abrirDetalle(v)} title="Ver"><Eye size={15} className="text-zinc-500" /></Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={e => abrirModalEditar(e, v)} title="Editar"><Pencil size={15} className="text-zinc-500" /></Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50" onClick={e => handleEliminar(e, v.id)} title="Eliminar"><Trash2 size={15} className="text-red-500" /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {vehiculosFiltrados.map(v => {
                        const thumb = getThumbnail(v);
                        return (
                            <Card key={v.id} className="overflow-hidden cursor-pointer hover:shadow-md transition-all border-zinc-200 group" onClick={() => abrirDetalle(v)}>
                                <div className="aspect-[4/3] bg-zinc-100 relative overflow-hidden">
                                    {thumb ? <img src={thumb} alt={v.placa} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full flex items-center justify-center"><CarFront size={48} className="text-zinc-300 opacity-30" /></div>}
                                    <div className="absolute top-2 right-2">{getEstadoBadge(v.estado)}</div>
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-bold text-zinc-950 text-lg truncate">{v.version?.modelo?.marca?.nombre} {v.version?.modelo?.nombre}</h3>
                                    <p className="text-sm text-zinc-500 truncate mb-3">{v.version?.titulo}</p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center text-zinc-600 bg-zinc-50 p-1.5 rounded"><Tag size={12} className="mr-1.5 shrink-0" /><span className="font-mono text-xs">{v.placa}</span></div>
                                        <div className="flex items-center text-zinc-600"><MapPin size={14} className="text-zinc-400 mr-1.5 shrink-0" />{v.agencia?.nombre}</div>
                                        <div className="flex items-center text-zinc-600"><div className="w-3 h-3 rounded-full border border-zinc-300 mr-1.5 shrink-0" style={{ backgroundColor: v.colorEspecifico?.toLowerCase() }} /><span className="capitalize">{v.colorEspecifico}</span></div>
                                    </div>
                                    <div className="flex gap-2 mt-4 pt-3 border-t border-zinc-100">
                                        <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={e => { e.stopPropagation(); abrirDetalle(v); }}><Eye size={12} className="mr-1" /> Ver</Button>
                                        <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={e => abrirModalEditar(e, v)}><Pencil size={12} className="mr-1" /> Editar</Button>
                                        <Button size="sm" variant="outline" className="h-8 text-xs text-red-500 hover:bg-red-50" onClick={e => handleEliminar(e, v.id)}><Trash2 size={12} /></Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            <ModalVehiculo abierto={modalAbierto} setAbierto={setModalAbierto} vehiculo={vehiculoEdicion} agencias={agencias} onSuccess={() => setRefreshKey(k => k + 1)} />
        </div>
    );
}
