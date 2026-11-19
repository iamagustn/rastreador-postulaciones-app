import { useState, useEffect } from "react";
import type { PostulacionSalida } from "../tipos/api";
import { ErrorApi, listarPostulaciones } from "../servicios/api";
import TarjetaPostulacion from "../componentes/TarjetaPostulacion";
import { useAuth } from "../contextos/AuthContexto";
import { Link } from "react-router-dom";
import Mensaje from "../componentes/Mensaje";
import EsqueletoLista from "../componentes/EsqueletoTargetas";

interface Props {
    contador: number;
}

function ListarPostulaciones({ contador }: Props) {

    const [postulaciones, setPostulaciones] = useState<PostulacionSalida[]>([])
    const [error, setError] = useState<string | null>(null)
    const [cargando, setCargando] = useState(true)
    const [idError, setIdError] = useState<string | null>(null)

    const { token } = useAuth()

    useEffect(() => {
        if (!token) return

        async function manejarPostulaciones() {
            try {
                setCargando(true)
                setError(null)
                setIdError(null)
                const respuesta = await listarPostulaciones(token!)
                setPostulaciones(respuesta)
            }
            catch (error) {
                if (error instanceof ErrorApi) {
                    setError(error.message)
                    setIdError(error.idError ?? null)
                } else {
                    setError("Ocurrió un error inesperado")
                }
            }
            finally {
                setCargando(false)
            }
        }
        manejarPostulaciones()
    }, [token, contador])

    if (!token) return null

    if (cargando) {
        return <EsqueletoLista />
    }

    if (error) {
        return <Mensaje tipo="error" texto={error} idError={idError}/>
    }

    if (postulaciones.length === 0) {
        return <p>No tienes postulaciones registradas</p>
    }

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold mb-4">Mis Postulaciones</h1>
            {postulaciones.map(postulacion => (
                <Link 
                    key={postulacion.id} to={`/postulaciones/${postulacion.id}`}
                    className="hover:shadow-md transition block">
                        <TarjetaPostulacion postulacion={postulacion} />
                </Link>
            ))}
        </div>
    )
}

export default ListarPostulaciones;
