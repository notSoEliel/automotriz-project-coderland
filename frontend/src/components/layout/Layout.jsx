import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CarFront, Building2, Users, Settings, LogOut, Menu } from 'lucide-react';
import { 
    SidebarProvider, 
    Sidebar, 
    SidebarContent, 
    SidebarGroup, 
    SidebarGroupContent, 
    SidebarMenu, 
    SidebarMenuItem, 
    SidebarMenuButton,
    SidebarTrigger
} from '@/components/ui/sidebar';

export default function Layout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Inventario', path: '/inventario', icon: CarFront },
        { name: 'Agencias', path: '/agencias', icon: Building2 },
        { name: 'Personal', path: '/personal', icon: Users },
        { name: 'Configuración', path: '/configuracion', icon: Settings },
    ];

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full bg-zinc-50 overflow-hidden font-sans">
                
                {/* Menú Lateral Oficial de shadcn */}
                <Sidebar variant="sidebar" className="bg-zinc-950 border-r-zinc-800">
                    <SidebarContent className="bg-zinc-950 text-zinc-400">
                        <div className="h-16 flex items-center px-6 border-b border-zinc-800">
                            <span className="text-zinc-50 font-semibold text-lg tracking-tight">Coderland Auto</span>
                        </div>
                        
                        <SidebarGroup>
                            <SidebarGroupContent>
                                <SidebarMenu className="space-y-1 mt-4">
                                    {navItems.map((item) => (
                                        <SidebarMenuItem key={item.name}>
                                            <SidebarMenuButton asChild>
                                                <NavLink
                                                    to={item.path}
                                                    className={({ isActive }) =>
                                                        `flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors ${
                                                            isActive 
                                                                ? 'bg-emerald-950/50 text-emerald-500' 
                                                                : 'hover:bg-zinc-900 hover:text-zinc-50'
                                                        }`
                                                    }
                                                >
                                                    <item.icon size={18} />
                                                    <span>{item.name}</span>
                                                </NavLink>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>

                    {/* Footer del Sidebar con botón de cerrar sesión */}
                    <div className="p-4 border-t border-zinc-800 bg-zinc-950 mt-auto">
                        <button 
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-zinc-50 transition-colors"
                        >
                            <LogOut size={18} />
                            Cerrar Sesión
                        </button>
                    </div>
                </Sidebar>

                {/* Contenedor Principal */}
                <main className="flex-1 flex flex-col min-w-0 w-full">
                    {/* Header Superior (Con el botón de hamburguesa integrado) */}
                    <header className="h-16 shrink-0 flex items-center justify-between md:justify-end px-4 md:px-8 border-b border-zinc-200 bg-white">
                        
                        {/* Botón Mágico que solo sale en móviles para abrir el menú */}
                        <div className="md:hidden">
                            <SidebarTrigger />
                        </div>

                        {/* Perfil de Usuario */}
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end hidden sm:flex">
                                <span className="text-sm font-medium text-zinc-950">Administrador</span>
                                <span className="text-xs text-zinc-500">Nivel de Acceso: Total</span>
                            </div>
                            <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
                                A
                            </div>
                        </div>
                    </header>

                    {/* Área Dinámica de Vistas */}
                    <div className="flex-1 overflow-auto p-4 md:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}