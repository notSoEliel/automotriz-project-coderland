import { useSearchParams } from 'react-router-dom';
import SubNavCatalogo from '@/components/catalogo/SubNavCatalogo';
import { CarFront } from 'lucide-react';
import BreadcrumbInteractivo from '@/components/catalogo/BreadcrumbInteractivo';
import VistaMarcas from '@/components/catalogo/VistaMarcas';
import VistaModelos from '@/components/catalogo/VistaModelos';
import VistaVersiones from '@/components/catalogo/VistaVersiones';
import VistaVersionDetalle from '@/components/catalogo/VistaVersionDetalle';

export default function Catalogo() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Derived state from URL params
    const marcaId = searchParams.get('marcaId');
    const marcaNombre = searchParams.get('marcaNombre');
    const modeloId = searchParams.get('modeloId');
    const modeloNombre = searchParams.get('modeloNombre');
    const versionId = searchParams.get('versionId');
    const versionNombre = searchParams.get('versionNombre');
    const autoOpenCreate = searchParams.get('autoOpenCreate') === 'true';

    let nivelActivo = 'marcas';
    if (marcaId && modeloId && versionId) {
        nivelActivo = 'detalle_version';
    } else if (marcaId && modeloId) {
        nivelActivo = 'versiones';
    } else if (marcaId) {
        nivelActivo = 'modelos';
    }

    const seleccion = {
        marca: marcaId ? { id: parseInt(marcaId), nombre: marcaNombre } : null,
        modelo: modeloId ? { id: parseInt(modeloId), nombre: modeloNombre } : null,
        version: versionId ? { id: parseInt(versionId), nombre: versionNombre } : null
    };

    const entrarAModelo = (marca, autoOpen = false) => {
        const params = { marcaId: marca.id, marcaNombre: marca.nombre };
        if (autoOpen) params.autoOpenCreate = 'true';
        setSearchParams(params);
    };

    const entrarAVersion = (modelo, autoOpen = false) => {
        const params = { 
            marcaId, 
            marcaNombre, 
            modeloId: modelo.id, 
            modeloNombre: modelo.nombre 
        };
        if (autoOpen) params.autoOpenCreate = 'true';
        setSearchParams(params);
    };

    const entrarADetalleVersion = (version) => {
        setSearchParams({ 
            marcaId, 
            marcaNombre, 
            modeloId, 
            modeloNombre,
            versionId: version.id,
            versionNombre: version.titulo
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
                        autoOpenCreate={autoOpenCreate}
                        onModalClosed={() => {
                            if (autoOpenCreate) {
                                searchParams.delete('autoOpenCreate');
                                setSearchParams(searchParams);
                            }
                        }}
                    />
                )}

                {nivelActivo === 'versiones' && (
                    <VistaVersiones
                        modeloSeleccionado={seleccion.modelo}
                        entrarADetalleVersion={entrarADetalleVersion}
                        autoOpenCreate={autoOpenCreate}
                        onModalClosed={() => {
                            if (autoOpenCreate) {
                                searchParams.delete('autoOpenCreate');
                                setSearchParams(searchParams);
                            }
                        }}
                    />
                )}

                {nivelActivo === 'detalle_version' && (
                    <VistaVersionDetalle 
                        versionId={seleccion.version.id} 
                    />
                )}
            </div>
        </div>
    );
}