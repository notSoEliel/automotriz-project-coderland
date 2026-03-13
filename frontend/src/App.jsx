import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorProvider } from '@/context/ErrorContext';
import AxiosInterceptor from '@/components/AxiosInterceptor';
import AlertaModal from '@/components/ui/AlertaModal';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/layout/Layout';
import Agencias from './pages/Agencias';
import VistaAgenciaDetalle from './pages/VistaAgenciaDetalle';
import Catalogo from './pages/Catalogo';
import Inventario from './pages/Inventario';
import ErrorPage from './pages/ErrorPage';
import WIP from './pages/WIP';

const RutaProtegida = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <ErrorProvider>
            <BrowserRouter>
                {/* Enlaza el interceptor de Axios con el router y el contexto */}
                <AxiosInterceptor />
                {/* Modal global de alertas de flujo */}
                <AlertaModal />

                <Routes>
                    {/* Ruta Pública */}
                    <Route path="/login" element={<Login />} />

                    {/* Páginas de Error (accesibles sin autenticación) */}
                    <Route path="/error/404" element={<ErrorPage codigo={404} />} />
                    <Route path="/error/403" element={<ErrorPage codigo={403} />} />
                    <Route path="/error/500" element={<ErrorPage codigo={500} />} />

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
                        <Route path="catalogo" element={<Catalogo />} />
                        <Route path="inventario" element={<Inventario />} />
                        <Route path="agencias" element={<Agencias />} />
                        <Route path="agencias/:id" element={<VistaAgenciaDetalle />} />
                        {/* Módulos en construcción */}
                        <Route path="personal" element={<WIP />} />
                        <Route path="configuracion" element={<WIP />} />
                    </Route>

                    {/* Catch-all: cualquier ruta no declarada → 404 */}
                    <Route path="*" element={<Navigate to="/error/404" replace />} />
                </Routes>
            </BrowserRouter>
        </ErrorProvider>
    );
}

export default App;