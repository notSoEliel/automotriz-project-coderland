import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/layout/Layout';
import Agencias from './pages/Agencias';
import Vehiculos from './pages/Catalogo';
import Catalogo from './pages/Catalogo';

const RutaProtegida = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Ruta Pública */}
                <Route path="/login" element={<Login />} />

                {/* Rutas Privadas envueltas en el Layout */}
                <Route
                    path="/"
                    element={
                        <RutaProtegida>
                            <Layout />
                        </RutaProtegida>
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="inventario" element={<Catalogo />} />
                    <Route path="agencias" element={<Agencias />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;