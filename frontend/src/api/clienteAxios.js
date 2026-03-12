import axios from 'axios';

const clienteAxios = axios.create({
    // Asumiendo que tu backend corre en el puerto 8080
    baseURL: 'http://localhost:8080/api'
});

clienteAxios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default clienteAxios;