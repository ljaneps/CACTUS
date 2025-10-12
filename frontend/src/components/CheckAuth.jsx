'use client';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

export default function CheckAuth({ PageComponent, requireAuth=false, requireAdmin=false, ...props }) {
    
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Primero obtenemos el token del localStorage si existe
        const token = localStorage.getItem('access_token');
        if (requireAuth && !token) {
            // Si no hay token y se requiere autorizacion se redirige al login
            router.push('/login');
            return;
        }

        try {
            // Decodifica el token de acceso para obtener el usuario
            const decoded = jwtDecode(token);
            if (requireAdmin && !decoded?.is_staff) {
                // Si el usuario no corresponde a un administrador, se redirige a otra pagina
                router.push('/no-autorizado');
                return;
            }
            setUser(decoded);
        } catch (err) {
            if (requireAuth) router.push('/login');
        } finally {
            setLoading(false);
        }
    }, []);

    if (loading) return <div>Loading...</div>;

    return <PageComponent {...props} user={user} />;
    
} 
