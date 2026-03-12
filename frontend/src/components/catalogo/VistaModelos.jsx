import { useState, useEffect } from 'react';
import clienteAxios from '@/api/clienteAxios';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, MoreVertical, Image as ImageIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function VistaModelos({ marcaSeleccionada, entrarAVersion }) {
    const [modelos, setModelos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    const [modalAbierto, setModalAbierto] = useState(false);
    const [modeloIdEdicion, setModeloIdEdicion] = useState(null);
    const [formulario, setFormulario] = useState({ nombre: '', marcaId: marcaSeleccionada.id });

    // Cargar Modelos de ESTA marca específica
    useEffect(() => {
        const fetchModelos = async () => {
            setCargando(true);
            try {
                // Ajusta este endpoint según cómo lo armaste en Spring Boot
                // Puede ser /modelos?marcaId=X o /marcas/X/modelos
                const respuesta = await clienteAxios.get(`/modelos/marca/${marcaSeleccionada.id}`);
                setModelos(respuesta.data);
            } catch (error) {
                console.error("Error al cargar modelos:", error);
            } finally {
                setCargando(false);
            }
        };
        fetchModelos();
    }, [refreshKey, marcaSeleccionada.id]);

    const handleInputChange = (e) => setFormulario({ ...formulario, [e.target.name]: e.target.value });

    const abrirModalCrear = () => {
        setModeloIdEdicion(null);
        setFormulario({ nombre: '', marcaId: marcaSeleccionada.id });
        setModalAbierto(true);
    };

    const abrirModalEditar = (modelo, e) => {
        e.stopPropagation();
        setModeloIdEdicion(modelo.id);
        setFormulario({ nombre: modelo.nombre, marcaId: marcaSeleccionada.id });
        setModalAbierto(true);
    };

    const eliminarModelo = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm("¿Eliminar este modelo y todas sus versiones?")) return;
        try {
            await clienteAxios.delete(`/modelos/${id}`);
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modeloIdEdicion) {
                await clienteAxios.put(`/modelos/${modeloIdEdicion}`, formulario);
            } else {
                await clienteAxios.post('/modelos', formulario);
            }
            setModalAbierto(false);
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    };

    return (
        <div className="space-y-4">
            <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>{modeloIdEdicion ? 'Editar Modelo' : `Añadir Modelo a ${marcaSeleccionada.nombre}`}</DialogTitle>
                        <DialogDescription>Ingresa el nombre del modelo.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-950">Nombre del Modelo</label>
                            <Input name="nombre" value={formulario.nombre} onChange={handleInputChange} placeholder="Ej. Corolla, Civic..." required />
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                            <Button type="button" variant="outline" onClick={() => setModalAbierto(false)}>Cancelar</Button>
                            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Guardar</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {cargando ? (
                <div className="text-center py-12 text-zinc-500">Cargando modelos...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {modelos.map((modelo) => (
                        <Card key={modelo.id} className="cursor-pointer hover:border-emerald-500 hover:shadow-md transition-all group overflow-hidden relative" onClick={() => entrarAVersion(modelo)}>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900 bg-white/80 backdrop-blur-sm"><MoreVertical size={16} /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={(e) => abrirModalEditar(modelo, e)}><Pencil size={14} className="mr-2" /> Editar</DropdownMenuItem>
                                        <DropdownMenuItem onClick={(e) => eliminarModelo(modelo.id, e)} className="text-red-600"><Trash2 size={14} className="mr-2" /> Eliminar</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="aspect-[4/3] w-full bg-zinc-100 flex items-center justify-center border-b border-zinc-100 relative overflow-hidden">
                                {modelo.imagenDestacada ? (
                                    <img 
                                        src={`http://localhost:8080${modelo.imagenDestacada.startsWith('/') ? '' : '/'}${modelo.imagenDestacada}`} 
                                        alt={modelo.nombre} 
                                        className="w-full h-full object-contain p-2" 
                                    />
                                ) : (
                                    <ImageIcon size={24} className="text-zinc-300" />
                                )}
                            </div>
                            <CardContent className="p-4 bg-white">
                                <h3 className="font-semibold text-zinc-900">{modelo.nombre}</h3>
                            </CardContent>
                        </Card>
                    ))}

                    <Card onClick={abrirModalCrear} className="cursor-pointer border-2 border-dashed border-zinc-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all">
                        <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[160px] text-zinc-500 hover:text-emerald-700">
                            <Plus size={32} className="mb-2" />
                            <span className="font-medium">Añadir Modelo</span>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}