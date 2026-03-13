import { useState, useRef } from 'react';
import clienteAxios from '@/api/clienteAxios';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Pencil, Upload, Trash2, ChevronLeft, ChevronRight, MapPin, Tag, DollarSign, CarFront, ImagePlus } from 'lucide-react';

const getImageUrl = (ruta) => {
    if (!ruta) return null;
    if (ruta.startsWith('http')) return ruta;
    return `http://localhost:8080${ruta.startsWith('/') ? '' : '/'}${ruta}`;
};

export default function DetalleVehiculo({ vehiculo, onVolver, onEditar }) {
    const [fotos, setFotos] = useState(vehiculo.galerias || []);
    const [indiceActual, setIndiceActual] = useState(0);
    const [subiendo, setSubiendo] = useState(false);
    const fileInputRef = useRef(null);

    // Combinar fotos propias + fallback a versión
    const todasLasFotos = fotos.length > 0
        ? fotos.map(f => ({ id: f.id, url: getImageUrl(f.rutaArchivo), propia: true }))
        : vehiculo.version?.imagenDefecto
            ? [{ id: null, url: getImageUrl(vehiculo.version.imagenDefecto), propia: false }]
            : [];

    const fotoActual = todasLasFotos[indiceActual] || null;

    const handleSubirFoto = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSubiendo(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await clienteAxios.post(`/vehiculos/${vehiculo.id}/multimedia`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFotos(prev => [...prev, res.data]);
            setIndiceActual(fotos.length); // Go to the just-uploaded one
        } catch (err) {
            console.error(err);
            alert('Error al subir la foto.');
        } finally {
            setSubiendo(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleEliminarFoto = async (multimediaId) => {
        if (!confirm('¿Eliminar esta foto?')) return;
        try {
            await clienteAxios.delete(`/vehiculos/multimedia/${multimediaId}`);
            setFotos(prev => prev.filter(f => f.id !== multimediaId));
            setIndiceActual(0);
        } catch (err) {
            console.error(err);
            alert('Error al eliminar la foto.');
        }
    };

    const getEstadoBadge = (estado) => {
        const map = {
            DISPONIBLE: <Badge className="bg-emerald-500 text-white text-sm px-3 py-1">Disponible</Badge>,
            VENDIDO: <Badge className="bg-red-500 text-white text-sm px-3 py-1">Vendido</Badge>,
            RESERVADO: <Badge className="bg-yellow-500 text-white text-sm px-3 py-1">Reservado</Badge>,
            ALQUILADO: <Badge className="bg-blue-500 text-white text-sm px-3 py-1">Alquilado</Badge>,
        };
        return map[estado] || <Badge variant="outline">{estado}</Badge>;
    };

    const precioVentaUsd = vehiculo.precioVentaEspecificoUsd || vehiculo.version?.precioVentaBaseUsd;
    const precioAlquilerUsd = vehiculo.precioAlquilerEspecificoUsd || vehiculo.version?.precioAlquilerBaseUsd;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={onVolver} className="h-9 w-9 rounded-full hover:bg-zinc-100">
                        <ArrowLeft size={18} />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
                            {vehiculo.version?.modelo?.marca?.nombre} {vehiculo.version?.modelo?.nombre}
                        </h1>
                        <p className="text-sm text-zinc-500">{vehiculo.version?.titulo} — <span className="font-mono">{vehiculo.placa}</span></p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => onEditar(vehiculo)} className="gap-2">
                        <Pencil size={14} /> Editar
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Carrusel de Fotos (3 cols) */}
                <div className="lg:col-span-3 space-y-4">
                    <Card className="overflow-hidden border-zinc-200">
                        <div className="relative aspect-[16/10] bg-zinc-100">
                            {fotoActual ? (
                                <img src={fotoActual.url} alt="Foto del vehículo" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400">
                                    <CarFront size={64} className="opacity-20 mb-2" />
                                    <span className="text-sm">Sin fotos</span>
                                </div>
                            )}
                            {!fotoActual?.propia && fotoActual && (
                                <div className="absolute bottom-2 left-2">
                                    <Badge variant="outline" className="bg-white/80 backdrop-blur text-xs">Imagen de la Versión (fallback)</Badge>
                                </div>
                            )}
                            {todasLasFotos.length > 1 && (
                                <>
                                    <Button
                                        variant="ghost" size="icon"
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full h-10 w-10 backdrop-blur"
                                        onClick={() => setIndiceActual(i => (i - 1 + todasLasFotos.length) % todasLasFotos.length)}
                                    ><ChevronLeft size={20} /></Button>
                                    <Button
                                        variant="ghost" size="icon"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full h-10 w-10 backdrop-blur"
                                        onClick={() => setIndiceActual(i => (i + 1) % todasLasFotos.length)}
                                    ><ChevronRight size={20} /></Button>
                                </>
                            )}
                            <div className="absolute top-2 right-2">{getEstadoBadge(vehiculo.estado)}</div>
                        </div>
                    </Card>

                    {/* Thumbnails + Upload */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        {todasLasFotos.map((f, i) => (
                            <button key={i} onClick={() => setIndiceActual(i)}
                                className={`w-16 h-12 rounded-md overflow-hidden border-2 shrink-0 transition-all ${i === indiceActual ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-zinc-200 hover:border-zinc-400'}`}
                            >
                                <img src={f.url} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                        {/* Upload button */}
                        <button onClick={() => fileInputRef.current?.click()}
                            className="w-16 h-12 rounded-md border-2 border-dashed border-zinc-300 hover:border-emerald-400 hover:bg-emerald-50 flex items-center justify-center shrink-0 transition-colors"
                            disabled={subiendo}
                        >
                            {subiendo ? <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /> : <ImagePlus size={18} className="text-zinc-400" />}
                        </button>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleSubirFoto} />
                    </div>

                    {/* Delete button for current photo */}
                    {fotoActual?.propia && (
                        <div className="flex justify-end">
                            <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50 gap-1 text-xs" onClick={() => handleEliminarFoto(fotoActual.id)}>
                                <Trash2 size={12} /> Eliminar foto actual
                            </Button>
                        </div>
                    )}
                </div>

                {/* Ficha de datos (2 cols) */}
                <div className="lg:col-span-2 space-y-4">
                    <Card className="border-zinc-200">
                        <CardContent className="p-5 space-y-5">
                            <h2 className="font-bold text-lg text-zinc-900 border-b pb-2">Datos de la Unidad</h2>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-500 flex items-center gap-1.5"><Tag size={14} /> Placa</span>
                                    <span className="font-mono font-bold text-zinc-900">{vehiculo.placa}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-500 flex items-center gap-1.5"><MapPin size={14} /> Agencia</span>
                                    <span className="text-zinc-900">{vehiculo.agencia?.nombre}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-500">Color</span>
                                    <span className="flex items-center gap-2 text-zinc-900">
                                        <div className="w-4 h-4 rounded-full border border-zinc-300" style={{ backgroundColor: vehiculo.colorEspecifico?.toLowerCase() }} />
                                        <span className="capitalize">{vehiculo.colorEspecifico}</span>
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-500">Versión</span>
                                    <span className="text-zinc-900 text-right max-w-[60%] truncate">{vehiculo.version?.titulo}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-500">Año</span>
                                    <span className="text-zinc-900">{vehiculo.version?.ano}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-zinc-500">Motor</span>
                                    <span className="text-zinc-900">{vehiculo.version?.motor}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-zinc-200">
                        <CardContent className="p-5 space-y-4">
                            <h2 className="font-bold text-lg text-zinc-900 border-b pb-2 flex items-center gap-2">
                                <DollarSign size={16} className="text-emerald-600" /> Precios
                            </h2>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="bg-zinc-50 rounded-md p-3">
                                    <p className="text-xs text-zinc-400 uppercase mb-1">Venta USD</p>
                                    <p className="font-semibold text-zinc-900">{precioVentaUsd ? `$${Number(precioVentaUsd).toLocaleString()}` : '—'}</p>
                                    {!vehiculo.precioVentaEspecificoUsd && vehiculo.version?.precioVentaBaseUsd && <p className="text-[10px] text-emerald-600 mt-0.5">Precio sugerido</p>}
                                </div>
                                <div className="bg-zinc-50 rounded-md p-3">
                                    <p className="text-xs text-zinc-400 uppercase mb-1">Alquiler USD</p>
                                    <p className="font-semibold text-zinc-900">{precioAlquilerUsd ? `$${Number(precioAlquilerUsd).toLocaleString()}` : '—'}</p>
                                    {!vehiculo.precioAlquilerEspecificoUsd && vehiculo.version?.precioAlquilerBaseUsd && <p className="text-[10px] text-emerald-600 mt-0.5">Precio sugerido</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-zinc-200">
                        <CardContent className="p-5">
                            <h2 className="font-bold text-lg text-zinc-900 border-b pb-2 mb-3">Galería</h2>
                            <p className="text-sm text-zinc-500">{fotos.length} foto(s) propias de esta unidad.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
