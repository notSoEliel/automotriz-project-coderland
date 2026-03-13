import { createContext, useContext, useState, useCallback } from 'react';

const ErrorContext = createContext(null);

export function ErrorProvider({ children }) {
    const [modal, setModal] = useState({ visible: false, titulo: '', mensaje: '' });

    const showModal = useCallback((mensaje, titulo = 'Aviso del Sistema') => {
        setModal({ visible: true, titulo, mensaje });
    }, []);

    const closeModal = useCallback(() => {
        setModal({ visible: false, titulo: '', mensaje: '' });
    }, []);

    return (
        <ErrorContext.Provider value={{ modal, showModal, closeModal }}>
            {children}
        </ErrorContext.Provider>
    );
}

export function useError() {
    const ctx = useContext(ErrorContext);
    if (!ctx) throw new Error('useError debe usarse dentro de ErrorProvider');
    return ctx;
}
