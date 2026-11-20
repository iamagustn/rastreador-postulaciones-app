import { useState, useEffect } from "react";
import type { PostulacionSalida } from "../tipos/api";
import { ErrorApi, listarPostulaciones } from "../servicios/api";
import TarjetaPostulacion from "../componentes/TarjetaPostulacion";
import { useAuth } from "../contextos/AuthContexto";
import { Link } from "react-router-dom";
import Mensaje from "../componentes/Mensaje";
import EsqueletoLista from "../componentes/EsqueletoTarjetas";

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
        return (
            <div className="bg-superficie p-12 rounded-lg border border-borde space-y-4 mt-18 text-center">
                <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-12 h-12 mx-auto text-texto-suave">
                    <path stroke-linecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <h2 className="text-lg font-bold">Aún no has registrado ninguna postulación</h2>
                <p className="text-texto-suave">Empieza a llevar el control de tus procesos</p>
                <Link 
                    to="/postulaciones/nueva" 
                    className="px-4 py-2 rounded border inline-block bg-marino text-white hover:bg-marino-oscuro hover:text-white transition">
                    Registrar mi primer postulación
                </Link>
            </div>
        )
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