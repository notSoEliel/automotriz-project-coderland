import { useError } from '@/context/ErrorContext';
import { AlertTriangle } from 'lucide-react';

export default function AlertaModal() {
    const { modal, closeModal } = useError();

    if (!modal.visible) return null;

    return (
        // Overlay — clic fuera del modal lo cierra
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
        >
            {/* Panel del Modal — clic dentro NO propaga al overlay */}
            <div
                className="relative w-full max-w-md mx-4 bg-white rounded-xl shadow-2xl border border-zinc-100 p-8 flex flex-col gap-5"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Ícono de advertencia */}
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-amber-50 border border-amber-200">
                        <AlertTriangle size={20} className="text-amber-500" strokeWidth={2} />
                    </div>
                    <h2 className="text-base font-semibold text-zinc-900 leading-tight">
                        {modal.titulo}
                    </h2>
                </div>

                {/* Separador */}
                <hr className="border-zinc-100" />

                {/* Mensaje */}
                <p className="text-sm text-zinc-600 leading-relaxed">
                    {modal.mensaje}
                </p>

                {/* Botón de cierre */}
                <div className="flex justify-end pt-1">
                    <button
                        onClick={closeModal}
                        className="px-5 py-2 text-sm font-medium rounded-lg bg-zinc-900 text-white hover:bg-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
}
