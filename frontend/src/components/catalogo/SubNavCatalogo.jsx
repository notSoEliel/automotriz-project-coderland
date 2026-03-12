import { NavLink } from 'react-router-dom';

export default function SubNavCatalogo() {
    return (
        <div className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-100 p-1 text-zinc-500 mb-8 w-full max-w-md grid-cols-2 grid">
            <NavLink
                to="/catalogo"
                className={({ isActive }) =>
                    `inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
                        isActive
                            ? 'bg-white text-zinc-950 shadow-sm cursor-default'
                            : 'hover:bg-zinc-200/50 hover:text-zinc-900'
                    }`
                }
            >
                Gestión de Marcas
            </NavLink>
            <NavLink
                to="/inventario"
                className={({ isActive }) =>
                    `inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
                        isActive
                            ? 'bg-white text-zinc-950 shadow-sm cursor-default'
                            : 'hover:bg-zinc-200/50 hover:text-zinc-900'
                    }`
                }
            >
                Catálogo / Inventario
            </NavLink>
        </div>
    );
}
