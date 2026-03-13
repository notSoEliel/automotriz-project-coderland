import { useNavigate } from 'react-router-dom';
import wipImg from '@/assets/WIP.png';

export default function WIP() {
    const navigate = useNavigate();

    return (
        <div className="min-h-[calc(100vh-7rem)] flex items-center justify-center px-6">
            <div className="flex flex-col items-center text-center max-w-lg w-full gap-6">

                {/* Imagen WIP */}
                <img
                    src={wipImg}
                    alt="Modulo en construccion"
                    className="w-full max-w-[300px] object-contain select-none"
                    draggable={false}
                />

                {/* Etiqueta */}
                <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
                        En Desarrollo
                    </span>
                    <h1 className="text-xl font-bold text-zinc-900 leading-tight">
                        Modulo en Optimizacion
                    </h1>
                </div>

                {/* Mensaje */}
                <p className="text-sm text-zinc-500 leading-relaxed max-w-sm">
                    Este modulo se encuentra actualmente en fase de optimizacion tecnica.
                    La funcionalidad estara disponible tras la proxima actualizacion del sistema.
                </p>

                {/* Separador */}
                <div className="w-12 h-px bg-zinc-200" />

                {/* Botón regresar al Dashboard */}
                <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-zinc-300 bg-white text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:border-zinc-400 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2"
                >
                    Volver al Dashboard
                </button>
            </div>
        </div>
    );
}
