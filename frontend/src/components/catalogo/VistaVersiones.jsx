import { useState, useEffect, useRef } from 'react';
import clienteAxios from '@/api/clienteAxios';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Pencil, Trash2, MoreVertical, Image as ImageIcon, Upload, Lock, Unlock, X } from 'lucide-react';

export default function VistaVersiones({ modeloSeleccionado }) {
    const [versiones, setVersiones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    const [modalAbierto, setModalAbierto] = useState(false);
    const [versionIdEdicion, setVersionIdEdicion] = useState(null);
    const [archivoFoto, setArchivoFoto] = useState(null);

    const anioMaximo = new Date().getFullYear() + 1;

    // Estados para la lista de colores
    const [colorInput, setColorInput] = useState('');
    const [coloresLista, setColoresLista] = useState([]);

    // Estados para el motor (Desplegable vs Texto Libre)
    const [motorPersonalizado, setMotorPersonalizado] = useState(false);
    const opcionesMotor = ["Gasolina", "Diésel", "Eléctrico", "Híbrido (HEV)", "Híbrido Enchufable (PHEV)", "Gas (GNC/GLP)", "Hidrógeno"];

    const TASA_CAMBIO = 36.5;
    const [autoVenta, setAutoVenta] = useState(true);
    const [autoAlquiler, setAutoAlquiler] = useState(true);
    const memoriaVes = useRef({ venta: '', alquiler: '' });

    // Estado del formulario (Ahora motor vuelve a ser un solo campo)
    const estadoInicial = {
        titulo: '', 
        descripcion: '',
        ano: '',
        motor: '', 
        cilindrada: '', 
        precioVentaBaseUsd: '',
        precioVentaBaseVes: '',
        precioAlquilerBaseUsd: '',
        precioAlquilerBaseVes: '',
        modeloId: modeloSeleccionado.id
    };
    const [formulario, setFormulario] = useState(estadoInicial);

    useEffect(() => {
        const fetchVersiones = async () => {
            setCargando(true);
            try {
                const respuesta = await clienteAxios.get(`/versiones/modelo/${modeloSeleccionado.id}`);
                setVersiones(respuesta.data);
            } catch (error) {
                console.error("Error al cargar versiones:", error);
            } finally {
                setCargando(false);
            }
        };
        fetchVersiones();
    }, [refreshKey, modeloSeleccionado.id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormulario(prev => {
            const nuevoEstado = { ...prev, [name]: value };
            if (name === 'precioVentaBaseUsd' && autoVenta) {
                nuevoEstado.precioVentaBaseVes = value ? (parseFloat(value) * TASA_CAMBIO).toFixed(2) : '';
            }
            if (name === 'precioAlquilerBaseUsd' && autoAlquiler) {
                nuevoEstado.precioAlquilerBaseVes = value ? (parseFloat(value) * TASA_CAMBIO).toFixed(2) : '';
            }
            return nuevoEstado;
        });
    };

    // Manejador especial para el Select del Motor
    const handleMotorSelect = (valor) => {
        if (valor === 'Otro') {
            setMotorPersonalizado(true);
            setFormulario(prev => ({ ...prev, motor: '' }));
        } else {
            setFormulario(prev => ({ ...prev, motor: valor }));
        }
    };

    const toggleCalculoAuto = (tipo, checked) => {
        if (tipo === 'venta') {
            setAutoVenta(checked);
            if (checked) {
                memoriaVes.current.venta = formulario.precioVentaBaseVes;
                setFormulario(prev => ({ ...prev, precioVentaBaseVes: prev.precioVentaBaseUsd ? (parseFloat(prev.precioVentaBaseUsd) * TASA_CAMBIO).toFixed(2) : '' }));
            } else {
                setFormulario(prev => ({ ...prev, precioVentaBaseVes: memoriaVes.current.venta }));
            }
        } else {
            setAutoAlquiler(checked);
            if (checked) {
                memoriaVes.current.alquiler = formulario.precioAlquilerBaseVes;
                setFormulario(prev => ({ ...prev, precioAlquilerBaseVes: prev.precioAlquilerBaseUsd ? (parseFloat(prev.precioAlquilerBaseUsd) * TASA_CAMBIO).toFixed(2) : '' }));
            } else {
                setFormulario(prev => ({ ...prev, precioAlquilerBaseVes: memoriaVes.current.alquiler }));
            }
        }
    };

    const agregarColor = (e) => {
        e.preventDefault(); 
        if (colorInput.trim() && !coloresLista.includes(colorInput.trim())) {
            setColoresLista([...coloresLista, colorInput.trim()]);
            setColorInput('');
        }
    };

    const quitarColor = (color) => {
        setColoresLista(coloresLista.filter(c => c !== color));
    };

    const handleKeyDownColor = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            agregarColor(e);
        }
    };

    const handleFileChange = (e) => { if (e.target.files && e.target.files[0]) setArchivoFoto(e.target.files[0]); };

    const abrirModalCrear = () => {
        setVersionIdEdicion(null); 
        setFormulario(estadoInicial); 
        setArchivoFoto(null); 
        setColoresLista([]); 
        setAutoVenta(true);
        setAutoAlquiler(true);
        setMotorPersonalizado(false); // Reiniciar estado del motor
        setModalAbierto(true);
    };

    const abrirModalEditar = (version, e) => {
        e.stopPropagation();
        setVersionIdEdicion(version.id);

        // Rellenamos el formulario quitando el " cc" para el input
        setFormulario({
            titulo: version.titulo,
            descripcion: version.descripcion,
            ano: version.ano,
            motor: version.motor,
            cilindrada: version.cilindrada ? version.cilindrada.replace(' cc', '') : '',
            precioVentaBaseUsd: version.precioVentaBaseUsd,
            precioVentaBaseVes: version.precioVentaBaseVes,
            precioAlquilerBaseUsd: version.precioAlquilerBaseUsd,
            precioAlquilerBaseVes: version.precioAlquilerBaseVes,
            modeloId: modeloSeleccionado.id
        });

        // Restauramos los colores
        setColoresLista(version.coloresDisponibles || []);
        // Apagamos los seguros auto para no sobrescribir sin querer
        setAutoVenta(false);
        setAutoAlquiler(false);

        setModalAbierto(true);
    };

    const eliminarVersion = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm("¿Eliminar esta versión de catálogo?")) return;
        try {
            await clienteAxios.delete(`/versiones/${id}`);
            setRefreshKey(prev => prev + 1);
        } catch (error) { console.error("Error al eliminar:", error); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const cilindradaFinal = formulario.cilindrada ? `${formulario.cilindrada} cc` : '0 cc';
        
        const payloadJson = {
            titulo: formulario.titulo,
            descripcion: formulario.descripcion,
            ano: formulario.ano,
            motor: formulario.motor,
            modeloId: formulario.modeloId,
            precioVentaBaseUsd: formulario.precioVentaBaseUsd,
            precioVentaBaseVes: formulario.precioVentaBaseVes,
            precioAlquilerBaseUsd: formulario.precioAlquilerBaseUsd,
            precioAlquilerBaseVes: formulario.precioAlquilerBaseVes,
            cilindrada: cilindradaFinal,
            coloresDisponibles: coloresLista
        };

        try {
            let versionId;
            if (versionIdEdicion) {
                await clienteAxios.put(`/versiones/${versionIdEdicion}`, payloadJson);
                versionId = versionIdEdicion;
            } else {
                const response = await clienteAxios.post('/versiones', payloadJson);
                versionId = response.data.id;
            }

            if (archivoFoto && versionId) {
                const formData = new FormData();
                formData.append('file', archivoFoto);
                await clienteAxios.post(`/versiones/${versionId}/foto`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            setModalAbierto(false);
            setRefreshKey(prev => prev + 1);
        } catch (error) { console.error("Error al guardar:", error); }
    };

    // Helper para bloquear teclas en inputs numéricos
    const bloquearTeclasInvalidas = (e, permitirPunto = true) => {
        const teclasBloqueadas = ['-', 'e', '+'];
        if (!permitirPunto) teclasBloqueadas.push('.');
        if (teclasBloqueadas.includes(e.key)) {
            e.preventDefault();
        }
    };

    return (
        <div className="space-y-4">
            <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Añadir Versión a {modeloSeleccionado.nombre}</DialogTitle>
                        <DialogDescription>Define la plantilla técnica y configura los precios base.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                        
                        {/* SECCIÓN 1: DATOS TÉCNICOS */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-emerald-700 border-b pb-1">Datos Técnicos</h4>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                
                                <div className="space-y-2 md:col-span-8">
                                    <Label>Nombre de la Versión</Label>
                                    <Input name="titulo" value={formulario.titulo} onChange={handleInputChange} placeholder="Ej. LE, XLE Hybrid..." required />
                                </div>
                                
                                <div className="space-y-2 md:col-span-4">
                                    <Label>Año de Fabricación</Label>
                                    <Input name="ano" type="number" min="1900" max={anioMaximo} value={formulario.ano} onChange={handleInputChange} placeholder={`Ej. ${anioMaximo}`} required />
                                </div>

                                {/* MOTOR: Desplegable o Texto Libre */}
                                <div className="space-y-2 md:col-span-4">
                                    <Label>Tipo de Motorización</Label>
                                    {!motorPersonalizado ? (
                                        <Select onValueChange={handleMotorSelect} value={formulario.motor}>
                                            <SelectTrigger className="bg-white">
                                                <SelectValue placeholder="Seleccione combustible" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {opcionesMotor.map(op => (
                                                    <SelectItem key={op} value={op}>{op}</SelectItem>
                                                ))}
                                                <SelectItem value="Otro" className="font-medium text-emerald-600">Otro (Especificar)...</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Input 
                                                name="motor" 
                                                value={formulario.motor} 
                                                onChange={handleInputChange} 
                                                placeholder="Especifique el tipo..." 
                                                required 
                                                autoFocus
                                            />
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                onClick={() => {
                                                    setMotorPersonalizado(false);
                                                    setFormulario(prev => ({ ...prev, motor: '' }));
                                                }}
                                                className="px-3 hover:bg-red-50 hover:text-red-600"
                                                title="Volver a la lista"
                                            >
                                                <X size={16} />
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* Cilindrada blindada contra negativos */}
                                <div className="space-y-2 md:col-span-3">
                                    <Label>Cilindrada (Opcional)</Label>
                                    <div className="relative">
                                        <Input 
                                            name="cilindrada" 
                                            type="number" 
                                            min="0"
                                            onKeyDown={(e) => bloquearTeclasInvalidas(e, false)} // false = bloquea el punto (solo enteros)
                                            value={formulario.cilindrada} 
                                            onChange={handleInputChange} 
                                            placeholder="Ej. 1987" 
                                            className="pr-8" 
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500 font-medium">cc</span>
                                    </div>
                                </div>

                                <div className="space-y-2 md:col-span-5">
                                    <Label>Colores Disponibles</Label>
                                    <div className="flex gap-2">
                                        <Input 
                                            value={colorInput} 
                                            onChange={(e) => setColorInput(e.target.value)} 
                                            onKeyDown={handleKeyDownColor}
                                            placeholder="Escribe y presiona Enter..." 
                                        />
                                        <Button type="button" onClick={agregarColor} variant="secondary" className="px-3">
                                            <Plus size={16} />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {coloresLista.map((color, index) => (
                                            <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-zinc-100 text-zinc-700 hover:bg-zinc-200">
                                                {color}
                                                <X size={12} className="cursor-pointer text-zinc-500 hover:text-red-500" onClick={() => quitarColor(color)} />
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2 md:col-span-12">
                                    <Label>Descripción del Equipamiento</Label>
                                    <Textarea name="descripcion" value={formulario.descripcion} onChange={handleInputChange} placeholder="Detalla el equipamiento interior, seguridad, tecnología..." className="min-h-[80px]" />
                                </div>
                            </div>
                        </div>

                        {/* SECCIÓN 2: FINANZAS Y PRECIOS */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-emerald-700 border-b pb-1 flex justify-between items-end">
                                Precios Base
                                <span className="text-xs font-normal text-zinc-500">Tasa actual: {TASA_CAMBIO} VES/USD</span>
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4 bg-zinc-50 p-4 rounded-lg border border-zinc-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <Label className="text-zinc-900 font-semibold">Precio Venta</Label>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="auto-venta" checked={autoVenta} onCheckedChange={(c) => toggleCalculoAuto('venta', c)} />
                                            <label htmlFor="auto-venta" className="text-xs font-medium leading-none cursor-pointer text-zinc-600">Cambio Auto</label>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label className="text-xs text-zinc-500">USD ($)</Label>
                                            <Input 
                                                name="precioVentaBaseUsd" 
                                                type="number" 
                                                step="0.01" 
                                                min="0"
                                                onKeyDown={(e) => bloquearTeclasInvalidas(e, true)} // true = permite decimales
                                                value={formulario.precioVentaBaseUsd} 
                                                onChange={handleInputChange} 
                                                placeholder="0.00" 
                                                required 
                                            />
                                        </div>
                                        <div className="space-y-1 relative">
                                            <Label className="text-xs text-zinc-500">VES (Bs.)</Label>
                                            <div className="relative">
                                                <Input 
                                                    name="precioVentaBaseVes" 
                                                    type="number" 
                                                    step="0.01" 
                                                    min="0"
                                                    onKeyDown={(e) => bloquearTeclasInvalidas(e, true)}
                                                    value={formulario.precioVentaBaseVes} 
                                                    onChange={handleInputChange} 
                                                    disabled={autoVenta} 
                                                    className={`pr-8 ${autoVenta ? 'bg-zinc-100 text-zinc-500 cursor-not-allowed' : 'bg-white'}`} 
                                                    required 
                                                />
                                                {autoVenta ? <Lock size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" /> : <Unlock size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 bg-zinc-50 p-4 rounded-lg border border-zinc-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <Label className="text-zinc-900 font-semibold">Precio Alquiler</Label>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="auto-alquiler" checked={autoAlquiler} onCheckedChange={(c) => toggleCalculoAuto('alquiler', c)} />
                                            <label htmlFor="auto-alquiler" className="text-xs font-medium leading-none cursor-pointer text-zinc-600">Cambio Auto</label>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label className="text-xs text-zinc-500">USD ($)</Label>
                                            <Input 
                                                name="precioAlquilerBaseUsd" 
                                                type="number" 
                                                step="0.01" 
                                                min="0"
                                                onKeyDown={(e) => bloquearTeclasInvalidas(e, true)}
                                                value={formulario.precioAlquilerBaseUsd} 
                                                onChange={handleInputChange} 
                                                placeholder="0.00" 
                                            />
                                        </div>
                                        <div className="space-y-1 relative">
                                            <Label className="text-xs text-zinc-500">VES (Bs.)</Label>
                                            <div className="relative">
                                                <Input 
                                                    name="precioAlquilerBaseVes" 
                                                    type="number" 
                                                    step="0.01" 
                                                    min="0"
                                                    onKeyDown={(e) => bloquearTeclasInvalidas(e, true)}
                                                    value={formulario.precioAlquilerBaseVes} 
                                                    onChange={handleInputChange} 
                                                    disabled={autoAlquiler} 
                                                    className={`pr-8 ${autoAlquiler ? 'bg-zinc-100 text-zinc-500 cursor-not-allowed' : 'bg-white'}`} 
                                                />
                                                {autoAlquiler ? <Lock size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" /> : <Unlock size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECCIÓN 3: MULTIMEDIA */}
                        <div className="space-y-2">
                            <Label>Fotografía Principal (Automáticamente convertida a WebP)</Label>
                            <div className="border-2 border-dashed border-zinc-200 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-zinc-50 transition-colors">
                                <Upload className="text-zinc-400 mb-2" size={24} />
                                <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-emerald-50 file:text-emerald-700 font-medium cursor-pointer" />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100">
                            <Button type="button" variant="outline" onClick={() => setModalAbierto(false)}>Cancelar</Button>
                            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Guardar Versión</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Renderizado de Tarjetas de Versiones */}
            {cargando ? (
                <div className="text-center py-12 text-zinc-500">Cargando versiones...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {versiones.map((version) => (
                        <Card key={version.id} className="relative group overflow-hidden border-zinc-200 hover:border-emerald-500 hover:shadow-md transition-all">
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900 bg-white/80 backdrop-blur-sm">
                                            <MoreVertical size={16} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={(e) => abrirModalEditar(version, e)}>
                                            <Pencil size={14} className="mr-2" /> Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={(e) => eliminarVersion(version.id, e)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                            <Trash2 size={14} className="mr-2" /> Eliminar
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="aspect-[4/3] w-full bg-zinc-100 flex items-center justify-center border-b border-zinc-100 relative overflow-hidden">
                                {version.imagenDefecto ? <img src={`http://localhost:8080${version.imagenDefecto.startsWith('/') ? '' : '/'}${version.imagenDefecto}`} alt="Coche" className="w-full h-full object-contain p-2" /> : <ImageIcon size={32} className="text-zinc-300" />}
                                <div className="absolute bottom-2 left-2 bg-zinc-900/80 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                                    ${parseFloat(version.precioVentaBaseUsd).toLocaleString()}
                                </div>
                            </div>
                            <CardContent className="p-4 bg-white">
                                <h3 className="font-semibold text-zinc-900 text-sm line-clamp-1" title={version.titulo}>{version.titulo}</h3>
                                <p className="text-xs text-zinc-500 mt-1">{version.motor} • {version.ano}</p>
                            </CardContent>
                        </Card>
                    ))}
                    <Card onClick={abrirModalCrear} className="cursor-pointer border-2 border-dashed border-zinc-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all">
                        <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[200px] text-zinc-500 hover:text-emerald-700">
                            <Plus size={32} className="mb-2" />
                            <span className="font-medium">Añadir Versión</span>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}