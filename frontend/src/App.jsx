import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

// Un componente rápido para proteger rutas
const RutaProtegida = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

// Componente temporal para el Dashboard
const Dashboard = () => (
    <div className="p-8">
        <h1 className="text-3xl font-bold">Panel de Control (Próximamente Tablas)</h1>
        <button
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}
        >
            Cerrar Sesión
        </button>
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/"
                    element={
                        <RutaProtegida>
                            <Dashboard />
                        </RutaProtegida>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;