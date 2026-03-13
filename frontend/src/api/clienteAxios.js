import axios from 'axios';

const clienteAxios = axios.create({
    baseURL: 'http://localhost:8080/api'
});

// Interceptor de solicitud: adjunta el token JWT
clienteAxios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

/**
 * Configura el interceptor de respuesta con acceso al router y al contexto de error.
 * Se invoca desde el componente AxiosInterceptor, que vive dentro del BrowserRouter.
 *
 * @param {Function} navigate  — useNavigate() del componente
 * @param {Function} showModal — showModal(mensaje, titulo) del ErrorContext
 */
export function setupInterceptors(navigate, showModal) {
    clienteAxios.interceptors.response.use(
        response => response,
        error => {
            const status = error.response?.status;
            const data = error.response?.data;

            // Extraemos el mensaje más descriptivo disponible desde el backend
            const mensaje =
                data?.message ||
                data?.error ||
                data?.detalle ||
                'Ha ocurrido un error inesperado. Intente nuevamente.';

            if (status === 403) {
                navigate('/error/403');
            } else if (status === 404) {
                navigate('/error/404');
            } else if (status === 500) {
                navigate('/error/500');
            } else if (status === 409) {
                // Conflicto de negocio (ej. marca duplicada): modal con título específico
                showModal(mensaje, 'Conflicto de Datos');
            } else if (status === 400) {
                // Solo disparamos el modal si el backend NO devuelve errores de campo.
                // Si devuelve un mapa de errores por campo (ej. { "nombre": "requerido" }),
                // lo dejamos pasar para que el formulario lo maneje localmente.
                const esErrorDeCampos =
                    data?.errores && typeof data.errores === 'object' && !Array.isArray(data.errores);

                if (!esErrorDeCampos) {
                    showModal(mensaje, 'Error de Validacion');
                }
                // Si es de campos: el error se propaga al catch del formulario original
            }

            return Promise.reject(error);
        }
    );
}

export default clienteAxios;