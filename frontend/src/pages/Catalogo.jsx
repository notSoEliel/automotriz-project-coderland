import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CarFront } from 'lucide-react';
import BreadcrumbInteractivo from '@/components/catalogo/BreadcrumbInteractivo';
import VistaMarcas from '@/components/catalogo/VistaMarcas';
import VistaModelos from '@/components/catalogo/VistaModelos';
import VistaVersiones from '@/components/catalogo/VistaVersiones';

export default function Catalogo() {
    const [nivelActivo, setNivelActivo] = useState('marcas'); // 'marcas', 'modelos', 'versiones'
    const [seleccion, setSeleccion] = useState({ marca: null, modelo: null });

    const entrarAModelo = (marca) => {
        setSeleccion({ ...seleccion, marca });
        setNivelActivo('modelos');
    };

    const entrarAVersion = (modelo) => {
        setSeleccion({ ...seleccion, modelo });
        setNivelActivo('versiones');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-950 flex items-center gap-2">
                    <CarFront size={24} className="text-emerald-600" />
                    Catálogo Automotriz
                </h1>
                <p className="text-sm text-zinc-500 mt-1">
                    Gestiona la jerarquía de vehículos y el inventario físico de las agencias.
                </p>
            </div>

            <Tabs defaultValue="galeria" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
                    <TabsTrigger value="galeria">Gestión de Marcas</TabsTrigger>
                    <TabsTrigger value="inventario">Catálogo / Inventario</TabsTrigger>
                </TabsList>

                <TabsContent value="galeria" className="space-y-4">
                    {/* El nuevo componente interactivo */}
                    <BreadcrumbInteractivo
                        nivelActivo={nivelActivo}
                        seleccion={seleccion}
                        setNivelActivo={setNivelActivo}
                        setSeleccion={setSeleccion}
                    />

                    {/* Renderizado Condicional Limpio */}
                    {nivelActivo === 'marcas' && (
                        <VistaMarcas entrarAModelo={entrarAModelo} />
                    )}

                    {nivelActivo === 'modelos' && (
                        <VistaModelos
                            marcaSeleccionada={seleccion.marca}
                            entrarAVersion={entrarAVersion}
                        />
                    )}

                    {nivelActivo === 'versiones' && (
                        <VistaVersiones
                            modeloSeleccionado={seleccion.modelo}
                        />
                    )}
                </TabsContent>

                <TabsContent value="inventario">
                    <div className="p-4 border-2 border-dashed border-zinc-200 bg-zinc-50 rounded-lg text-zinc-800 text-center">
                        Aquí irá el componente `TablaInventario.jsx` (Vehículos Físicos con VIN)
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}