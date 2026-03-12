import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowLeft } from 'lucide-react';

export default function BreadcrumbInteractivo({ nivelActivo, seleccion, setNivelActivo, setSeleccion }) {
    
    const irAtras = () => {
        if (nivelActivo === 'versiones') setNivelActivo('modelos');
        if (nivelActivo === 'modelos') {
            setNivelActivo('marcas');
            setSeleccion({ marca: null, modelo: null });
        }
    };

    const saltarAMarca = () => {
        setNivelActivo('modelos');
        setSeleccion({ marca: seleccion.marca, modelo: null });
    };

    if (nivelActivo === 'marcas') return null;

    return (
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-zinc-200">
            <Button variant="ghost" size="sm" onClick={irAtras} className="text-zinc-500 hover:text-zinc-950">
                <ArrowLeft size={16} className="mr-2" />
                Volver
            </Button>
            
            <div className="flex items-center text-sm">
                {/* Nombre de la Marca (Interactivo si estamos más profundos) */}
                <button 
                    onClick={nivelActivo === 'versiones' ? saltarAMarca : undefined}
                    className={`font-medium transition-colors ${
                        nivelActivo === 'modelos' 
                            ? 'text-zinc-950 font-bold cursor-default' 
                            : 'text-zinc-500 hover:text-zinc-950 cursor-pointer hover:underline'
                    }`}
                >
                    {seleccion.marca?.nombre}
                </button>

                {/* Separador y Nombre del Modelo */}
                {seleccion.modelo && (
                    <>
                        <ChevronRight size={16} className="mx-2 text-zinc-400" />
                        <span className="text-zinc-950 font-bold cursor-default">
                            {seleccion.modelo.nombre}
                        </span>
                    </>
                )}
            </div>
        </div>
    );
}