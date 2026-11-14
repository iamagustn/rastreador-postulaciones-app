import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { type HistorialSalida, type PostulacionSalida } from "../tipos/api";
import { useAuth } from "../contextos/AuthContexto";
import { obtenerHistorial, obtenerPostulacion } from "../servicios/api";
import TarjetaPostulacion from "../componentes/TarjetaPostulacion";

function DetallePostulacion(){

    const { id } = useParams();
    const [postulacion, setPostulacion] = useState<PostulacionSalida>()
    const [historial, setHistorial] = useState<HistorialSalida[]>([])
    const [error, setError] = useState<string | null>(null)
    const [cargando, setCargando] = useState(false)

    const { token } = useAuth()
     
    const tokenValido: string = token ?? ""

    const idValido = Number(id)
    

    useEffect(() => {
        async function manejarDatos(){
            try {
                setCargando(true)
                const respuestaPostulacion = await obtenerPostulacion(idValido, tokenValido)
                const respuestaHistorial = await obtenerHistorial(idValido, tokenValido)
                setPostulacion(respuestaPostulacion)
                setHistorial(respuestaHistorial)
            }
            catch (error) {
                if (error instanceof Error) {
                    setError(error.message)
                } else {
                    setError("Ocurrió un error inesperado")
                }
            }
            finally {
                setCargando(false)
            }
        } manejarDatos()
    }, [idValido, tokenValido])

    if (!token) return null
    if (!id || Number.isNaN(idValido)){
        return <p>El ID es invalido</p>
    }
    return (
        <div>
            {cargando && <p>Cargando postulaciones...</p>}
            {error && <p>Ocurrió un error: { error }</p>}
            {postulacion && <TarjetaPostulacion key={postulacion.id} postulacion={postulacion}/>}
            
            {historial.map(entrada => (
                <p key={entrada.id}>
                    {entrada.estado.nombre_estado} — {new Date(entrada.fecha).toLocaleString('es-MX', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
            ))}
            
        </div>
    )
}

export default DetallePostulacion;