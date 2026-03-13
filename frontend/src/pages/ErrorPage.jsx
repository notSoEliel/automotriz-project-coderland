import { useNavigate } from 'react-router-dom';
import errorImg from '@/assets/ERROR.png';

const MENSAJES = {
    404: 'La ruta solicitada no existe o el vehículo ha sido movido de nuestro inventario.',
    500: 'Se ha detectado un fallo crítico en el sistema. Nuestros técnicos han sido notificados para restablecer el servicio a la brevedad.',
    403: 'Su usuario no posee las credenciales necesarias para acceder a esta sección.',
};

const TITULOS = {
    404: 'Recurso No Encontrado',
    500: 'Fallo Crítico del Sistema',
    403: 'Acceso Denegado',
};

export default function ErrorPage({ codigo }) {
    const navigate = useNavigate();

    const titulo = TITULOS[codigo] || 'Error Inesperado';
    const mensaje = MENSAJES[codigo] || 'Ha ocurrido un error desconocido. Por favor, intente nuevamente.';

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-6">
            <div className="flex flex-col items-center text-center max-w-lg w-full gap-6">

                {/* Imagen de error */}
                <img
                    src={errorImg}
                    alt={`Error ${codigo}`}
                    className="w-full max-w-[280px] object-contain select-none"
                    draggable={false}
                />

                {/* Código HTTP */}
                <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
                        Error {codigo}
                    </span>
                    <h1 className="text-2xl font-bold text-zinc-900 leading-tight">
                        {titulo}
                    </h1>
                </div>

                {/* Mensaje descriptivo */}
                <p className="text-sm text-zinc-500 leading-relaxed max-w-sm">
                    {mensaje}
                </p>

                {/* Separador */}
                <div className="w-12 h-px bg-zinc-200" />

                {/* Botón de regreso */}
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-zinc-300 bg-white text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:border-zinc-400 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2"
                >
                    Volver a la pagina anterior
                </button>
            </div>
        </div>
    );
}
