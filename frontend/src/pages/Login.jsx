import { useState } from 'react';
import logoPrincipal from '@/assets/logo-coderland-auto-1.png';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '@/api/clienteAxios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 gap-6 px-4">
            {/* Logo sobre el formulario */}
            <img
                src={logoPrincipal}
                alt="Coderland Auto"
                className="w-full max-w-[200px] object-contain select-none"
                draggable={false}
            />
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardDescription className="text-center text-sm">
                        Ingresa tus credenciales para administrar el inventario.
                    </CardDescription>
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