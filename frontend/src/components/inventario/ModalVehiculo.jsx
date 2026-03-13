import { useState, useEffect } from 'react';
import clienteAxios from '@/api/clienteAxios';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Wand2, Loader2 } from 'lucide-react';
import { useError } from '@/context/ErrorContext';

export default function ModalVehiculo({ abierto, setAbierto, vehiculo, agencias, onSuccess }) {
    const estadoInicial = {
        placa: '', colorEspecifico: '', estado: 'DISPONIBLE',
        precioVentaEspecificoUsd: '', precioVentaEspecificoVes: '',
        precioAlquilerEspecificoUsd: '', precioAlquilerEspecificoVes: '',
        versionId: '', agenciaId: ''
    };

    const [formulario, setFormulario] = useState(estadoInicial);
    const [marcas, setMarcas] = useState([]);
    const [modelos, setModelos] = useState([]);
    const [versiones, setVersiones] = useState([]);
    const [marcaSeleccionada, setMarcaSeleccionada] = useState('');
    const [modeloSeleccionado, setModeloSeleccionado] = useState('');
    const [versionSeleccionada, setVersionSeleccionada] = useState(null);
    const [usarPreciosSugeridos, setUsarPreciosSugeridos] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [generandoPlaca, setGenerandoPlaca] = useState(false);
    const [cargandoModelos, setCargandoModelos] = useState(false);
    const [cargandoVersiones, setCargandoVersiones] = useState(false);
    const { showModal } = useError();

    useEffect(() => {
        if (!abierto) return;
        clienteAxios.get('/marcas').then(r => setMarcas(r.data)).catch(console.error);
        if (vehiculo) {
            setFormulario({
                placa: vehiculo.placa || '',
                colorEspecifico: vehiculo.colorEspecifico,
                estado: vehiculo.estado,
                precioVentaEspecificoUsd: vehiculo.precioVentaEspecificoUsd || '',
                precioVentaEspecificoVes: vehiculo.precioVentaEspecificoVes || '',
                precioAlquilerEspecificoUsd: vehiculo.precioAlquilerEspecificoUsd || '',
                precioAlquilerEspecificoVes: vehiculo.precioAlquilerEspecificoVes || '',
                versionId: vehiculo.version?.id?.toString() || '',
                agenciaId: vehiculo.agencia?.id?.toString() || ''
            });
            setMarcaSeleccionada(vehiculo.version?.modelo?.marca?.id?.toString() || '');
            setModeloSeleccionado(vehiculo.version?.modelo?.id?.toString() || '');
            setVersionSeleccionada(vehiculo.version);
            setUsarPreciosSugeridos(!(vehiculo.precioVentaEspecificoUsd || vehiculo.precioAlquilerEspecificoUsd));
        } else {
            setFormulario(estadoInicial);
            setMarcaSeleccionada(''); setModeloSeleccionado(''); setVersionSeleccionada(null);
            setUsarPreciosSugeridos(true);
        }
    }, [abierto, vehiculo]);

    useEffect(() => {
        if (marcaSeleccionada) {
            setCargandoModelos(true);
            clienteAxios.get(`/modelos/marca/${marcaSeleccionada}`)
                .then(r => setModelos(r.data))
                .catch(console.error)
                .finally(() => setCargandoModelos(false));

            if (!vehiculo || vehiculo.version?.modelo?.marca?.id?.toString() !== marcaSeleccionada) {
                setModeloSeleccionado(''); setVersionSeleccionada(null);
                setFormulario(p => ({ ...p, versionId: '', colorEspecifico: '' }));
            }
        } else {
            setModelos([]);
            setCargandoModelos(false);
        }
    }, [marcaSeleccionada]);

    useEffect(() => {
        if (modeloSeleccionado) {
            setCargandoVersiones(true);
            clienteAxios.get(`/versiones/modelo/${modeloSeleccionado}`)
                .then(r => setVersiones(r.data))
                .catch(console.error)
                .finally(() => setCargandoVersiones(false));

            if (!vehiculo || vehiculo.version?.modelo?.id?.toString() !== modeloSeleccionado) {
                setVersionSeleccionada(null);
                setFormulario(p => ({ ...p, versionId: '', colorEspecifico: '' }));
            }
        } else {
            setVersiones([]);
            setCargandoVersiones(false);
        }
    }, [modeloSeleccionado]);

    const handleVersionChange = (val) => {
        setVersionSeleccionada(versiones.find(v => v.id.toString() === val) || null);
        setFormulario(p => ({ ...p, versionId: val, colorEspecifico: '' }));
    };
    const handleInputChange = (e) => setFormulario({ ...formulario, [e.target.name]: e.target.value });

    const handleGenerarPlaca = async () => {
        setGenerandoPlaca(true);
        try {
            const res = await clienteAxios.get('/vehiculos/generar-placa');
            setFormulario(p => ({ ...p, placa: res.data.placa }));
        } catch (err) { console.error(err); }
        finally { setGenerandoPlaca(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formulario.agenciaId) { showModal('Debes seleccionar una agencia asignada a este vehículo físico.', 'Campo Obligatorio'); return; }
        setGuardando(true);
        try {
            const payload = { ...formulario };
            if (usarPreciosSugeridos) {
                payload.precioVentaEspecificoUsd = null; payload.precioVentaEspecificoVes = null;
                payload.precioAlquilerEspecificoUsd = null; payload.precioAlquilerEspecificoVes = null;
            } else {
                ['precioVentaEspecificoUsd','precioVentaEspecificoVes','precioAlquilerEspecificoUsd','precioAlquilerEspecificoVes']
                    .forEach(k => { payload[k] = payload[k] || null; });
            }
            vehiculo ? await clienteAxios.put(`/vehiculos/${vehiculo.id}`, payload) : await clienteAxios.post('/vehiculos', payload);
            setAbierto(false); onSuccess();
        } catch (error) {
            console.error(error);
            showModal("Hubo un error al guardar el vehículo. Verifica que la placa sea única y no esté duplicada en otra agencia.", "Error al Guardar");
        } finally { setGuardando(false); }
    };

    const flujoIncompleto = (marcaSeleccionada && !cargandoModelos && modelos.length === 0) ||
                            (modeloSeleccionado && !cargandoVersiones && versiones.length === 0);

    return (
        <Dialog open={abierto} onOpenChange={setAbierto}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{vehiculo ? 'Editar Vehículo' : 'Registrar Vehículo'}</DialogTitle>
                    <DialogDescription>Completa los datos. La Agencia y la Placa son obligatorias.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 pt-2">
                    {/* Jerarquía */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md bg-zinc-50 border-zinc-200">
                        <div>
                            <Label className="text-zinc-900 mb-2 block">1. Marca *</Label>
                            <Select value={marcaSeleccionada} onValueChange={setMarcaSeleccionada}>
                                <SelectTrigger className="bg-white"><SelectValue placeholder="Seleccione" /></SelectTrigger>
                                <SelectContent>{marcas.map(m => <SelectItem key={m.id} value={m.id.toString()}>{m.nombre}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-zinc-900 mb-2 block">2. Modelo *</Label>
                            <Select value={modeloSeleccionado} onValueChange={setModeloSeleccionado} disabled={!marcaSeleccionada}>
                                <SelectTrigger className="bg-white"><SelectValue placeholder="Seleccione" /></SelectTrigger>
                                <SelectContent>{modelos.map(m => <SelectItem key={m.id} value={m.id.toString()}>{m.nombre}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-zinc-900 mb-2 block">3. Versión *</Label>
                            <Select value={formulario.versionId} onValueChange={handleVersionChange} disabled={!modeloSeleccionado}>
                                <SelectTrigger className="bg-white"><SelectValue placeholder="Seleccione" /></SelectTrigger>
                                <SelectContent>{versiones.map(v => <SelectItem key={v.id} value={v.id.toString()}>{v.titulo}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    </div>

                    {flujoIncompleto && (
                        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
                            El flujo para esta marca está incompleto. Debe completarlo (agregar modelos o versiones) para poder registrar este vehículo.
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            {/* Placa + Varita */}
                            <div>
                                <Label className="text-zinc-900">Placa / Matrícula *</Label>
                                <div className="flex gap-2 mt-1">
                                    <Input name="placa" value={formulario.placa} onChange={handleInputChange} placeholder="ABC-123" required className="uppercase font-mono tracking-widest" maxLength={8} />
                                    <Button type="button" variant="outline" size="icon" onClick={handleGenerarPlaca} disabled={generandoPlaca} title="Generar placa" className="shrink-0 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50">
                                        {generandoPlaca ? <Loader2 size={16} className="animate-spin text-emerald-600" /> : <Wand2 size={16} className="text-emerald-600" />}
                                    </Button>
                                </div>
                                <p className="text-xs text-zinc-400 mt-1">Formato: AAA-000. Usa la varita ✨ para auto-generar.</p>
                            </div>

                            <div>
                                <Label className="text-zinc-900">Color *</Label>
                                <Select value={formulario.colorEspecifico} onValueChange={v => setFormulario({ ...formulario, colorEspecifico: v })} disabled={!versionSeleccionada} required>
                                    <SelectTrigger className="mt-1"><SelectValue placeholder="Seleccione un color..." /></SelectTrigger>
                                    <SelectContent>
                                        {versionSeleccionada?.coloresDisponibles?.map((c, i) => (
                                            <SelectItem key={i} value={c}><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border" style={{ backgroundColor: c.toLowerCase() }} /><span className="capitalize">{c}</span></div></SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="text-zinc-900">Estado *</Label>
                                <Select value={formulario.estado} onValueChange={v => setFormulario({ ...formulario, estado: v })} required>
                                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="DISPONIBLE">Disponible</SelectItem>
                                        <SelectItem value="RESERVADO">Reservado</SelectItem>
                                        <SelectItem value="VENDIDO">Vendido</SelectItem>
                                        <SelectItem value="ALQUILADO">Alquilado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Agencia obligatoria */}
                            <div>
                                <Label className="text-zinc-900">Agencia Asignada *</Label>
                                <Select value={formulario.agenciaId} onValueChange={v => setFormulario({ ...formulario, agenciaId: v })} required>
                                    <SelectTrigger className="mt-1"><SelectValue placeholder="— Obligatorio —" /></SelectTrigger>
                                    <SelectContent>{agencias.map(a => <SelectItem key={a.id} value={a.id.toString()}>{a.nombre}</SelectItem>)}</SelectContent>
                                </Select>
                                {!formulario.agenciaId && <p className="text-xs text-red-400 mt-1">Selecciona una agencia para continuar.</p>}
                            </div>
                        </div>

                        {/* Precios */}
                        <div className="space-y-4 bg-zinc-50 border border-zinc-200 p-4 rounded-md">
                            <div className="flex items-center space-x-2 border-b border-zinc-200 pb-3">
                                <Checkbox id="usarPreciosSugeridos" checked={usarPreciosSugeridos} onCheckedChange={setUsarPreciosSugeridos} disabled={!versionSeleccionada} />
                                <Label htmlFor="usarPreciosSugeridos" className="font-semibold text-emerald-700 cursor-pointer">Usar precios sugeridos</Label>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-zinc-700 font-semibold text-xs uppercase tracking-wide">Venta</Label>
                                <div><Label className="text-xs text-zinc-500 mb-1 block">USD</Label><Input type="number" step="0.01" name="precioVentaEspecificoUsd" value={formulario.precioVentaEspecificoUsd} onChange={handleInputChange} placeholder={versionSeleccionada?.precioVentaBaseUsd ? `Sugerido: ${versionSeleccionada.precioVentaBaseUsd}` : ''} disabled={usarPreciosSugeridos || !versionSeleccionada} /></div>
                                <div><Label className="text-xs text-zinc-500 mb-1 block">VES</Label><Input type="number" step="0.01" name="precioVentaEspecificoVes" value={formulario.precioVentaEspecificoVes} onChange={handleInputChange} placeholder={versionSeleccionada?.precioVentaBaseVes ? `Sugerido: ${versionSeleccionada.precioVentaBaseVes}` : ''} disabled={usarPreciosSugeridos || !versionSeleccionada} /></div>
                            </div>
                            <div className="space-y-3 pt-3 border-t border-zinc-200">
                                <Label className="text-zinc-700 font-semibold text-xs uppercase tracking-wide">Alquiler</Label>
                                <div><Label className="text-xs text-zinc-500 mb-1 block">USD</Label><Input type="number" step="0.01" name="precioAlquilerEspecificoUsd" value={formulario.precioAlquilerEspecificoUsd} onChange={handleInputChange} placeholder={versionSeleccionada?.precioAlquilerBaseUsd ? `Sugerido: ${versionSeleccionada.precioAlquilerBaseUsd}` : ''} disabled={usarPreciosSugeridos || !versionSeleccionada} /></div>
                                <div><Label className="text-xs text-zinc-500 mb-1 block">VES</Label><Input type="number" step="0.01" name="precioAlquilerEspecificoVes" value={formulario.precioAlquilerEspecificoVes} onChange={handleInputChange} placeholder={versionSeleccionada?.precioAlquilerBaseVes ? `Sugerido: ${versionSeleccionada.precioAlquilerBaseVes}` : ''} disabled={usarPreciosSugeridos || !versionSeleccionada} /></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                        <Button type="button" variant="outline" onClick={() => setAbierto(false)}>Cancelar</Button>
                        <Button type="submit" disabled={guardando || !formulario.versionId || !formulario.agenciaId} className="bg-emerald-600 hover:bg-emerald-700">
                            {guardando ? <><Loader2 size={16} className="animate-spin mr-2" />Guardando...</> : (vehiculo ? 'Actualizar' : 'Guardar')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
