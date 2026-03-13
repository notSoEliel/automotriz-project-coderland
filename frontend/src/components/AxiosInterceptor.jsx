import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useError } from '@/context/ErrorContext';
import { setupInterceptors } from '@/api/clienteAxios';

/**
 * Componente puente: vive dentro del BrowserRouter y del ErrorProvider,
 * por lo que tiene acceso tanto a useNavigate como al ErrorContext.
 * Registra el interceptor de respuesta de Axios una sola vez al montar.
 * No renderiza nada en el DOM.
 */
export default function AxiosInterceptor() {
    const navigate = useNavigate();
    const { showModal } = useError();
    const inicializado = useRef(false);

    useEffect(() => {
        if (!inicializado.current) {
            setupInterceptors(navigate, showModal);
            inicializado.current = true;
        }
    }, [navigate, showModal]);

    return null;
}
