import SubNavCatalogo from '@/components/catalogo/SubNavCatalogo';
import { CarFront } from 'lucide-react';

export default function Inventario() {
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

            <div className="p-4 border-2 border-dashed border-zinc-200 bg-zinc-50 rounded-lg text-zinc-800 text-center">
                Aquí irá el componente `TablaInventario.jsx` (Vehículos Físicos con VIN)
            </div>
        </div>
    );
}
