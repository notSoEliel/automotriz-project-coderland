import { useSearchParams } from 'react-router-dom';
import SubNavCatalogo from '@/components/catalogo/SubNavCatalogo';
import { CarFront } from 'lucide-react';
import BreadcrumbInteractivo from '@/components/catalogo/BreadcrumbInteractivo';
import VistaMarcas from '@/components/catalogo/VistaMarcas';
import VistaModelos from '@/components/catalogo/VistaModelos';
import VistaVersiones from '@/components/catalogo/VistaVersiones';

export default function Catalogo() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Derived state from URL params
    const marcaId = searchParams.get('marcaId');
    const marcaNombre = searchParams.get('marcaNombre');
    const modeloId = searchParams.get('modeloId');
    const modeloNombre = searchParams.get('modeloNombre');

    let nivelActivo = 'marcas';
    if (marcaId && modeloId) {
        nivelActivo = 'versiones';
    } else if (marcaId) {
        nivelActivo = 'modelos';
    }

    const seleccion = {
        marca: marcaId ? { id: parseInt(marcaId), nombre: marcaNombre } : null,
        modelo: modeloId ? { id: parseInt(modeloId), nombre: modeloNombre } : null
    };

    const entrarAModelo = (marca) => {
        setSearchParams({ marcaId: marca.id, marcaNombre: marca.nombre });
    };

    const entrarAVersion = (modelo) => {
        setSearchParams({ 
            marcaId, 
            marcaNombre, 
            modeloId: modelo.id, 
            modeloNombre: modelo.nombre 
        });
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

            <SubNavCatalogo />

            <div className="space-y-4">
                {/* El nuevo componente interactivo */}
                <BreadcrumbInteractivo
                    nivelActivo={nivelActivo}
                    seleccion={seleccion}
                    setSearchParams={setSearchParams}
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
            </div>
        </div>
    );
}