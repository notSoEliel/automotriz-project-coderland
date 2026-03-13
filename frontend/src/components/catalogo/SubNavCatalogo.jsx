import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SubNavCatalogo() {
    const location = useLocation();
    const navigate = useNavigate();

    // Determinamos la pestaña activa basándonos en la ruta base
    const activeTab = location.pathname.startsWith('/catalogo') ? 'catalogo' : 'inventario';

    const handleTabChange = (value) => {
        if (value === 'catalogo') {
            navigate('/catalogo');
        } else if (value === 'inventario') {
            navigate('/inventario');
        }
    };

    return (
        <div className="mb-8 w-full max-w-md">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-zinc-100">
                    <TabsTrigger
                        value="catalogo"
                        className="data-[state=active]:bg-white data-[state=active]:text-zinc-950"
                    >
                        Gestión de Marcas
                    </TabsTrigger>
                    <TabsTrigger
                        value="inventario"
                        className="data-[state=active]:bg-white data-[state=active]:text-zinc-950"
                    >
                        Catálogo / Inventario
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    );
}
