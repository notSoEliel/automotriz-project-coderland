import { useState, useEffect } from 'react';
import clienteAxios from '@/api/clienteAxios';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Image as ImageIcon, Trash2, Upload, Star } from 'lucide-react';

export default function VistaVersionDetalle({ versionId }) {
    const [version, setVersion] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const fetchVersion = async () => {
            setCargando(true);
            try {
                // Como no tenemos un GET /api/versiones/{id} directamente en el requerimiento, 
                // vamos a buscar todas las versiones del modelo y filtrar. 
                // Asumiremos que el backend devuelve la version completa con sus galeria, 
                // o añadiremos un endpoint si hiciera falta. 
                // Por ahora, como el fetch anterior traía todo:
                const respuesta = await clienteAxios.get(`/versiones`);
                const found = respuesta.data.find(v => v.id === parseInt(versionId));
                setVersion(found);
            } catch (error) {
                console.error("Error al cargar detalle de versión:", error);
            } finally {
                setCargando(false);
            }
        };
        fetchVersion();
    }, [refreshKey, versionId]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        
        try {
            await clienteAxios.post(`/versiones/${versionId}/galeria`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error("Error al subir imagen:", error);
        }
    };

    const eliminarFoto = async (imagenId) => {
        if (!window.confirm("¿Eliminar esta imagen de la galería?")) return;
        try {
            await clienteAxios.delete(`/versiones/galeria/${imagenId}`);
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error("Error al eliminar imagen:", error);
        }
    };

    const establecerComoPortada = async (imagenId) => {
        try {
            await clienteAxios.put(`/versiones/${versionId}/portada/${imagenId}`);
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error("Error al establecer portada:", error);
            alert("No se pudo establecer la imagen como portada.");
        }
    };

    if (cargando) return <div className="text-center py-12 text-zinc-500">Cargando detalles...</div>;
    if (!version) return <div className="text-center py-12 text-zinc-500">Versión no encontrada.</div>;

    const precioVentaUsd = parseFloat(version.precioVentaBaseUsd).toLocaleString();
    const precioVentaVes = parseFloat(version.precioVentaBaseVes).toLocaleString();
    const precioAlquilerUsd = version.precioAlquilerBaseUsd ? parseFloat(version.precioAlquilerBaseUsd).toLocaleString() : null;
    const precioAlquilerVes = version.precioAlquilerBaseVes ? parseFloat(version.precioAlquilerBaseVes).toLocaleString() : null;

    return (
        <div className="space-y-8">
            {/* SECCIÓN SUPERIOR: DATOS */}
            <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-zinc-900">{version.titulo}</h2>
                        <p className="text-zinc-500">{version.modelo.nombre} • {version.ano}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Motorización</p>
                        <p className="font-semibold text-zinc-900">{version.motor}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Cilindrada</p>
                        <p className="font-semibold text-zinc-900">{version.cilindrada || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Precio Venta (Desde)</p>
                        <div className="flex flex-col">
                            <span className="font-bold text-emerald-600">${precioVentaUsd}</span>
                            <span className="text-xs text-zinc-500">Bs. {precioVentaVes}</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Precio Alquiler (Desde)</p>
                        <div className="flex flex-col">
                            <span className="font-bold text-emerald-600">{precioAlquilerUsd ? `$${precioAlquilerUsd}` : 'N/A'}</span>
                            {precioAlquilerVes && <span className="text-xs text-zinc-500">Bs. {precioAlquilerVes}</span>}
                        </div>
                    </div>
                </div>

                {version.coloresDisponibles && version.coloresDisponibles.length > 0 && (
                    <div className="mt-6">
                        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Colores Disponibles</p>
                        <div className="flex flex-wrap gap-2">
                            {version.coloresDisponibles.map((color, idx) => (
                                <Badge key={idx} variant="outline" className="bg-zinc-50">{color}</Badge>
                            ))}
                        </div>
                    </div>
                )}

                {version.descripcion && (
                    <div className="mt-6">
                        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Equipamiento</p>
                        <p className="text-sm text-zinc-700 whitespace-pre-wrap">{version.descripcion}</p>
                    </div>
                )}
            </div>

            {/* SECCIÓN INFERIOR: GALERÍA */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-zinc-900">Galería Multimedia</h3>
                    <div className="relative">
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Button variant="outline" className="bg-white hover:bg-zinc-50 text-emerald-700 border-emerald-200">
                            <Upload size={16} className="mr-2" />
                            Añadir Imagen
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Imagen Principal (Portada) */}
                    <Card className="overflow-hidden border-2 border-emerald-500/20 relative group">
                        <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-md z-10 shadow-sm">
                            PORTADA
                        </div>
                        <div className="aspect-video w-full bg-zinc-100 flex items-center justify-center">
                            {version.imagenDefecto ? (
                                <img src={`http://localhost:8080${version.imagenDefecto.startsWith('/') ? '' : '/'}${version.imagenDefecto}`} alt="Portada" className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon size={32} className="text-zinc-300" />
                            )}
                        </div>
                    </Card>

                    {/* Imágenes de la Galería */}
                    {version.galerias && version.galerias.map((img) => (
                        <Card key={img.id} className="overflow-hidden border-zinc-200 relative group">
                            <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
                                <Button 
                                    variant="secondary" 
                                    size="icon" 
                                    title="Establecer como Portada"
                                    className="h-8 w-8 shadow-sm bg-white/90 hover:bg-emerald-50 hover:text-emerald-600 text-zinc-700"
                                    onClick={() => establecerComoPortada(img.id)}
                                >
                                    <Star size={14} />
                                </Button>
                                <Button 
                                    variant="destructive" 
                                    size="icon" 
                                    title="Eliminar de Galería"
                                    className="h-8 w-8 shadow-sm"
                                    onClick={() => eliminarFoto(img.id)}
                                >
                                    <Trash2 size={14} />
                                </Button>
                            </div>
                            <div className="aspect-video w-full bg-zinc-100 flex items-center justify-center">
                                <img src={`http://localhost:8080${img.urlArchivo.startsWith('/') ? '' : '/'}${img.urlArchivo}`} alt="Galería" className="w-full h-full object-cover" />
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
