import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '@/api/clienteAxios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react'; // Importamos los íconos de shadcn

export default function Login() {
    const [credenciales, setCredenciales] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [mostrarPassword, setMostrarPassword] = useState(false); // Estado para el ojito
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const respuesta = await clienteAxios.post('/auth/login', credenciales);
            localStorage.setItem('token', respuesta.data.token);
            navigate('/'); 
        } catch (err) {
            // Imprimimos el error real en consola para diagnosticar
            console.error("Error detallado:", err); 
            setError('Credenciales inválidas. Intenta de nuevo.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-zinc-50">
            <Card className="w-100">
                <CardHeader>
                    <CardTitle className="text-2xl">Coderland Auto</CardTitle>
                    <CardDescription>Ingresa tus credenciales para administrar el inventario.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4 pb-4">
                        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

                        <div className="space-y-2">
                            <Label htmlFor="username">Usuario</Label>
                            <Input
                                id="username"
                                name="username"
                                placeholder="ej. admin"
                                value={credenciales.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    // Cambiamos el tipo dinámicamente
                                    type={mostrarPassword ? "text" : "password"}
                                    value={credenciales.password}
                                    onChange={handleChange}
                                    className="pr-10" // Damos espacio a la derecha para no pisar el ícono
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                                    onClick={() => setMostrarPassword(!mostrarPassword)}
                                >
                                    {mostrarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </CardContent>


                    <CardFooter>
                        <Button type="submit" className="w-full">Iniciar Sesión</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}