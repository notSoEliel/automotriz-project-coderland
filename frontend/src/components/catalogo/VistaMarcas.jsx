import { useState, useEffect } from 'react';
import clienteAxios from '@/api/clienteAxios';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ConfirmModal from '@/components/ui/ConfirmModal';
import PostCreationModal from '@/components/ui/PostCreationModal';
import { useError } from '@/context/ErrorContext';

export default function VistaMarcas({ entrarAModelo }) {
    const [marcas, setMarcas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    // Estados del Modal
    const [modalAbierto, setModalAbierto] = useState(false);
    const [marcaIdEdicion, setMarcaIdEdicion] = useState(null);
    const [formulario, setFormulario] = useState({ nombre: '' });
    const [confirmObj, setConfirmObj] = useState({ isOpen: false, id: null });
    
    // Estados del Post-Creation Modal
    const [showPostModal, setShowPostModal] = useState(false);
    const [newlyCreatedBrand, setNewlyCreatedBrand] = useState(null);
    
    const { showModal } = useError();

    // Cargar Marcas
    useEffect(() => {
        const fetchMarcas = async () => {
            setCargando(true);
            try {
                // Asegúrate de que este endpoint exista en tu Spring Boot
                const respuesta = await clienteAxios.get('/marcas');
                setMarcas(respuesta.data);
            } catch (error) {
                console.error("Error al cargar marcas:", error);
            } finally {
                setCargando(false);
            }
        };
        fetchMarcas();
    }, [refreshKey]);

    const handleInputChange = (e) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value });
    };

    const abrirModalCrear = () => {
        setMarcaIdEdicion(null);
        setFormulario({ nombre: '' });
        setModalAbierto(true);
    };

    const abrirModalEditar = (marca, e) => {
        e.stopPropagation(); // Evita que se dispare el click de la tarjeta entera
        setMarcaIdEdicion(marca.id);
        setFormulario({ nombre: marca.nombre });
        setModalAbierto(true);
    };

    const handleEliminar = (id, e) => {
        e.stopPropagation();
        setConfirmObj({ isOpen: true, id });
    };

    const executeEliminar = async () => {
        if (!confirmObj.id) return;
        try {
            await clienteAxios.delete(`/marcas/${confirmObj.id}`);
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            if (error.response?.status === 409) {
                showModal("No se puede eliminar la marca porque tiene modelos o vehículos físicos asociados. Elimínelos primero.", "Acción Denegada");
            } else {
                console.error("Error al eliminar marca:", error);
                showModal("Ocurrió un error al intentar eliminar la marca.", "Error");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (marcaIdEdicion) {
                await clienteAxios.put(`/marcas/${marcaIdEdicion}`, formulario);
                setModalAbierto(false);
                setRefreshKey(prev => prev + 1);
            } else {
                const res = await clienteAxios.post('/marcas', formulario);
                setModalAbierto(false);
                setRefreshKey(prev => prev + 1);
                
                // Show the post-creation modal for new brands
                setNewlyCreatedBrand(res.data);
                setShowPostModal(true);
            }
        } catch (error) {
            console.error("Error al guardar marca:", error);
            showModal("Hubo un problema al guardar la marca.", "Error");
        }
    };

    return (
        <div className="space-y-4">

            {/* Modal de Creación / Edición */}
            <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>{marcaIdEdicion ? 'Editar Marca' : 'Añadir Nueva Marca'}</DialogTitle>
                        <DialogDescription>
                            Ingresa el nombre de la marca automotriz.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-950">Nombre</label>
                            <Input
                                name="nombre"
                                value={formulario.nombre}
                                onChange={handleInputChange}
                                placeholder="Ej. Toyota, Ford, Honda..."
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                            <Button type="button" variant="outline" onClick={() => setModalAbierto(false)}>Cancelar</Button>
                            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Guardar</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {cargando ? (
                <div className="text-center py-12 text-zinc-500">Cargando marcas...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                    {/* Renderizado de Marcas */}
                    {marcas.map((marca) => (
                        <Card 
                            key={marca.id} 
                            className="cursor-pointer hover:border-emerald-500 hover:shadow-md transition-all group overflow-hidden relative"
                            onClick={() => entrarAModelo(marca)}
                        >
                            {/* Menú de opciones (Editar/Eliminar) */}
                            <div className="absolute top-2 right-2 z-10">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900 bg-white/80 backdrop-blur-sm">
                                            <MoreVertical size={16} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={(e) => abrirModalEditar(marca, e)}>
                                            <Pencil size={14} className="mr-2" /> Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={(e) => handleEliminar(marca.id, e)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                            <Trash2 size={14} className="mr-2" /> Eliminar
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <CardContent className="p-6 flex flex-col items-center justify-center h-40 bg-white">
                                <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-emerald-50 transition-colors">
                                    <span className="text-xl font-bold text-zinc-400 group-hover:text-emerald-600">
                                        {marca.nombre.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-zinc-900">{marca.nombre}</h3>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Tarjeta de Añadir Marca (Siempre al final) */}
                    <Card
                        onClick={abrirModalCrear}
                        className="cursor-pointer border-2 border-dashed border-zinc-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all"
                    >
                        <CardContent className="p-6 flex flex-col items-center justify-center h-40 text-zinc-500 hover:text-emerald-700">
                            <Plus size={32} className="mb-2" />
                            <span className="font-medium">Añadir Marca</span>
                        </CardContent>
                    </Card>

                </div>
            )}
            
            <ConfirmModal 
                isOpen={confirmObj.isOpen} 
                onClose={() => setConfirmObj({ isOpen: false, id: null })} 
                onConfirm={executeEliminar} 
                titulo="¿Eliminar Marca?" 
                mensaje="¿Estás seguro de eliminar esta marca? Todas las asociaciones serán eliminadas si no hay restricciones activas."
            />

            {/* Modal post-creación de marca */}
            {newlyCreatedBrand && (
                <PostCreationModal
                    isOpen={showPostModal}
                    onClose={() => setShowPostModal(false)}
                    onContinue={() => {
                        setShowPostModal(false);
                        entrarAModelo(newlyCreatedBrand, true); // true param para auto-abrir modal
                    }}
                    entityName={`Marca "${newlyCreatedBrand.nombre}"`}
                    nextStepName="Agregar Modelo"
                    description={`El registro fue exitoso.`}
                />
            )}
        </div>
    );
}