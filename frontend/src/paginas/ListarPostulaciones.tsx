import { useState, useEffect } from "react";
import type { PostulacionSalida } from "../tipos/api";
import { listarPostulaciones } from "../servicios/api";
import TarjetaPostulacion from "../componentes/TarjetaPostulacion";
import { useAuth } from "../contextos/AuthContexto";
import { Link } from "react-router-dom";

interface Props{
    contador: number;
}

function ListarPostulaciones({ contador }: Props){

    const [postulaciones, setPostulaciones] = useState<PostulacionSalida[]>([])
    const [error, setError] = useState<string | null>(null)
    const [cargando, setCargando] = useState(false)
    
    const { token } = useAuth()
    if (!token) return null

    const tokenValido: string = token
    
    useEffect(() => {
        async function manejarPostulaciones() {
            try{
                setCargando(true)
                const respuesta = await listarPostulaciones(tokenValido)
                setPostulaciones(respuesta)
            }
            catch (error){
                if (error instanceof Error) {
                    setError(error.message)
                } else {
                    setError("Ocurrió un error inesperado")
                }
            }
            finally {
                setCargando(false)
            }
        } manejarPostulaciones()
    }, [tokenValido, contador])

    return (
        <div>
            {cargando && <p>Cargando postulaciones...</p>}
            {error && <p>Ocurrió un error: { error }</p>}
            {postulaciones.length > 0 ? postulaciones.map(postulacion => 
                <Link key={postulacion.id} to={`/postulaciones/${postulacion.id}`}>
                    <TarjetaPostulacion postulacion={postulacion}/>
                </Link>
            ) : <p>No tienes postulaciones registradas</p>}
        </div>
    )
}

export default ListarPostulaciones;