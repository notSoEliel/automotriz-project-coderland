import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '@/api/clienteAxios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Building2, Plus, Search, CheckCircle2, Pencil, Trash2, Eye } from 'lucide-react';

export default function Agencias() {
    const navigate = useNavigate();
    const [agencias, setAgencias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    // Estados del Modal
    const [modalAbierto, setModalAbierto] = useState(false);
    const [agenciaIdEdicion, setAgenciaIdEdicion] = useState(null); // Null = Crear, ID = Editar

    // Estado del Formulario (Alineado estrictamente con el JSON del Backend)
    const estadoInicialFormulario = {
        nombre: '',
        ubicacion: '',
        mediosPago: []
    };
    const [formulario, setFormulario] = useState(estadoInicialFormulario);

    // Opciones de pago actualizadas
    const opcionesPago = [
        "Transferencia Bancaria (USD)",
        "Zelle",
        "Efectivo (USD)",
        "Yappy",
        "ACH",
        "Binance Pay"
    ];

    // Cargar Datos
    useEffect(() => {
        const fetchAgencias = async () => {
            setCargando(true);
            try {
                const respuesta = await clienteAxios.get('/agencias');
                setAgencias(respuesta.data);
            } catch (error) {
                console.error("Error al cargar agencias:", error);
            } finally {
                setCargando(false);
            }
        };
        fetchAgencias();
    }, [refreshKey]);

    // Manejadores del Formulario
    const handleInputChange = (e) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (metodo) => {
        setFormulario(prev => {
            const metodosActuales = prev.mediosPago || [];
            if (metodosActuales.includes(metodo)) {
                return { ...prev, mediosPago: metodosActuales.filter(m => m !== metodo) };
            } else {
                return { ...prev, mediosPago: [...metodosActuales, metodo] };
            }
        });
    };

    // Abrir Modal para Crear
    const abrirModalCrear = () => {
        setAgenciaIdEdicion(null);
        setFormulario(estadoInicialFormulario);
        setModalAbierto(true);
    };

    // Abrir Modal para Editar
    const abrirModalEditar = (agencia) => {
        setAgenciaIdEdicion(agencia.id);
        setFormulario({
            nombre: agencia.nombre,
            ubicacion: agencia.ubicacion,
            mediosPago: agencia.mediosPago || []
        });
        setModalAbierto(true);
    };

    // Eliminar Agencia
    const eliminarAgencia = async (id) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar esta agencia?")) return;

        try {
            await clienteAxios.delete(`/agencias/${id}`);
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };

    // Enviar Formulario (POST o PUT)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (agenciaIdEdicion) {
                // Modo Edición
                await clienteAxios.put(`/agencias/${agenciaIdEdicion}`, formulario);
            } else {
                // Modo Creación
                await clienteAxios.post('/agencias', formulario);
            }

            setModalAbierto(false);
            setFormulario(estadoInicialFormulario);
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error("Error al guardar la agencia:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-950 flex items-center gap-2">
                        <Building2 size={24} className="text-emerald-600" />
                        Agencias
                    </h1>
                    <p className="text-sm text-zinc-500 mt-1">Gestiona las sucursales y sus métodos de pago habilitados.</p>
                </div>

                <Button onClick={abrirModalCrear} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                    <Plus size={16} />
                    Nueva Agencia
                </Button>

                <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{agenciaIdEdicion ? 'Editar Agencia' : 'Registrar Nueva Agencia'}</DialogTitle>
                            <DialogDescription>
                                {agenciaIdEdicion ? 'Modifica los datos de la sucursal.' : 'Ingresa los detalles de la nueva sucursal.'} Haz clic en guardar cuando termines.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-zinc-950">Nombre de la Agencia</label>
                                    <Input
                                        name="nombre"
                                        value={formulario.nombre}
                                        onChange={handleInputChange}
                                        placeholder="Ej. Sede Norte"
                                        className="mt-1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-zinc-950">Dirección Física</label>
                                    <Input
                                        name="ubicacion"
                                        value={formulario.ubicacion}
                                        onChange={handleInputChange}
                                        placeholder="Ej. Av. Principal, Local 4"
                                        className="mt-1"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-zinc-950 block mb-3">Métodos de Pago Aceptados</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {opcionesPago.map((metodo) => (
                                            <div key={metodo} className="flex items-center space-x-2 border border-zinc-200 p-3 rounded-md hover:bg-zinc-50 transition-colors">
                                                <Checkbox 
                                                    id={metodo} 
                                                    checked={formulario.mediosPago.includes(metodo)}
                                                    onCheckedChange={() => handleCheckboxChange(metodo)}
                                                />
                                                <label 
                                                    htmlFor={metodo}
                                                    className="text-sm font-medium leading-none cursor-pointer text-zinc-700"
                                                >
                                                    {metodo}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                                <Button type="button" variant="outline" onClick={() => setModalAbierto(false)}>
                                    Cancelar
                                </Button>
                                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                                    {agenciaIdEdicion ? 'Actualizar Agencia' : 'Guardar Agencia'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border border-zinc-200 rounded-lg bg-white overflow-hidden">
                <Table>
                    <TableHeader className="bg-zinc-50">
                        <TableRow>
                            <TableHead className="sticky left-0 z-20 bg-zinc-50 font-semibold text-zinc-950 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)]">Nombre</TableHead>
                            <TableHead className="font-semibold text-zinc-950">Dirección</TableHead>
                            <TableHead className="font-semibold text-zinc-950">Métodos de Pago</TableHead>
                            <TableHead className="font-semibold text-zinc-950 text-center">Estado</TableHead>
                            <TableHead className="sticky right-0 z-20 bg-zinc-50 font-semibold text-zinc-950 text-right shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.08)]">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cargando ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-zinc-500">
                                    Cargando agencias...
                                </TableCell>
                            </TableRow>
                        ) : agencias.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-zinc-500">
                                    No hay agencias registradas. ¡Agrega la primera!
                                </TableCell>
                            </TableRow>
                        ) : (
                            agencias.map((agencia) => (
                                <TableRow key={agencia.id} className="cursor-pointer hover:bg-zinc-50 transition-colors group" onClick={() => navigate(`/agencias/${agencia.id}`)}>
                                    <TableCell className="sticky left-0 z-10 bg-white font-medium text-zinc-900 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.06)] group-hover:bg-zinc-50 transition-colors">{agencia.nombre}</TableCell>
                                    <TableCell className="text-zinc-500">{agencia.ubicacion}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {agencia.mediosPago && agencia.mediosPago.map((metodo, idx) => (
                                                <span key={idx} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
                                                    {metodo}
                                                </span>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            <CheckCircle2 size={12} />
                                            Operativa
                                        </span>
                                    </TableCell>
                                    <TableCell className="sticky right-0 z-10 bg-white text-right shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.06)] group-hover:bg-zinc-50 transition-colors">
                                        <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => navigate(`/agencias/${agencia.id}`)}
                                                className="text-zinc-500 hover:text-emerald-600 hover:bg-emerald-50"
                                                title="Ver detalle"
                                            >
                                                <Eye size={16} />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => abrirModalEditar(agencia)}
                                                className="text-zinc-500 hover:text-blue-600 hover:bg-blue-50"
                                            >
                                                <Pencil size={16} />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => eliminarAgencia(agencia.id)}
                                                className="text-zinc-500 hover:text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}