import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { type EstadoSalida, type HistorialSalida, type PostulacionSalida } from "../tipos/api";
import { useAuth } from "../contextos/AuthContexto";
import { borrarPostulacion, cambiarEstado, ErrorApi, listarEstados, obtenerHistorial, obtenerPostulacion } from "../servicios/api";
import TarjetaPostulacion from "../componentes/TarjetaPostulacion";
import Mensaje from "../componentes/Mensaje";
import { ESTILOS_ESTADO, ESTILO_POR_DEFECTO } from "../componentes/TarjetaPostulacion";
import EsqueletoLista from "../componentes/EsqueletoTarjetas";

function DetallePostulacion() {

    const { id } = useParams();
    const navigate = useNavigate()

    const [postulacion, setPostulacion] = useState<PostulacionSalida>()
    const [historial, setHistorial] = useState<HistorialSalida[]>([])

    const [error, setError] = useState<string | null>(null)
    const [idError, setIdError] = useState<string | null>(null)
    const [cargando, setCargando] = useState(true)
    const [exito, setExito] = useState("")
    const [cargandoCambio, setCargangoCambio] = useState(false)
    const [contador, setContador] = useState(0)

    const [estados, setEstados] = useState<EstadoSalida[]>([])
    const [estado, setEstado] = useState("")

    const { token } = useAuth()

    const tokenValido: string = token ?? ""

    const idValido = Number(id)

    function subirContador() {
        setContador((valorAnterior) => valorAnterior + 1)
    }

    async function manejarCambioEstado() {
        setError(null)
        setIdError(null)
        setExito("")
        try {
            setCargangoCambio(true)
            await cambiarEstado(idValido, estado, tokenValido)
            setExito("Cambio hecho exitosamente")
            subirContador()
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
            setCargangoCambio(false)
        }
    }

    async function manejarBorrado() {
        const respuesta = confirm("¿Estás seguro de que deseas eliminar esta postulación? (Este cambio sera irreversible)");
        if (!respuesta) return

        try {
            await borrarPostulacion(idValido, tokenValido)
            navigate("/postulaciones")
        }
        catch (error) {
            if (error instanceof ErrorApi) {
                setError(error.message)
                setIdError(error.idError ?? null)
            } else {
                setError("Ocurrió un error inesperado")
            }
        }
    }

    useEffect(() => {
        if (!tokenValido || !id || Number.isNaN(idValido)) return

        async function manejarDatos() {
            try {
                setCargando(true)
                setError(null)
                setIdError(null)
                const [respuestaPostulacion, respuestaHistorial, datosEstado] = await Promise.all([
                    obtenerPostulacion(idValido, tokenValido),
                    obtenerHistorial(idValido, tokenValido),
                    listarEstados()
                ])
                setPostulacion(respuestaPostulacion)
                setEstado(respuestaPostulacion.estado.nombre_estado)
                setHistorial(respuestaHistorial)
                setEstados(datosEstado)
            }
            catch (error) {
                if (error instanceof ErrorApi) {
                    setError(error.message)
                    setIdError(error.idError ??  null)
                } else {
                    setError("Ocurrió un error inesperado")
                }
            }
            finally {
                setCargando(false)
            }
        } manejarDatos()
    }, [id, idValido, tokenValido, contador])

    if (!token) return null
    if (!id || Number.isNaN(idValido)) {
        return <p>El ID es invalido</p>
    }

    if (cargando && !postulacion) {
        return <EsqueletoLista />
    }

    if (error && !postulacion) {
        return <Mensaje tipo="error" texto={error} idError={idError}/>
    }

    if (!postulacion) {
        return <p>La postulación no existe</p>
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold mb-4">Detalles de la postulación</h1>
                </div>
        
                <div className="flex gap-3">
                    <Link 
                        to={`/postulaciones/${idValido}/editar`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded border border-marino text-marino hover:bg-marino hover:text-white transition">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                        <span>Editar</span>
                    </Link>
                    <button 
                        onClick={manejarBorrado}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                        <span>Borrar</span>
                    </button>
                </div>
            </div>
        
            <TarjetaPostulacion key={postulacion.id} postulacion={postulacion} />

            {/* Tarjeta historial */}
            <div className="bg-superficie p-4 rounded-lg border border-borde space-y-4">
                <h2 className="text-lg font-bold mb-4">Historial</h2>

                {historial.map(entrada => (
                    <div key={entrada.id} className="flex justify-between items-center py-2 border-b border-borde last:border-0">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize ${ESTILOS_ESTADO[entrada.estado.nombre_estado] ?? ESTILO_POR_DEFECTO}`}>
                            {entrada.estado.nombre_estado}
                        </span>
                        <span className="text-sm text-texto-suave">
                            {new Date(entrada.fecha).toLocaleString('es-MX', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </span>
                    </div>
                ))}
            </div>

            <div className="bg-superficie p-4 rounded-lg border border-borde space-y-4">
                <h2 className="text-lg font-bold mb-4">Actualizar estado</h2>

                <select value={estado} onChange={evento => setEstado(evento.target.value)} className="w-full p-2 border border-borde rounded">
                    {estados.map(estado => (
                        <option key={estado.id} value={estado.nombre_estado}>{estado.nombre_estado}</option>
                    ))}
                </select>

                {error && <Mensaje tipo="error" texto={error} idError={idError}/>}
                {exito && <Mensaje tipo="exito" texto={exito}/>}

                <button onClick={manejarCambioEstado} disabled={cargandoCambio} className="bg-marino text-white p-2 rounded w-full hover:bg-marino-oscuro">
                    {cargandoCambio ? "Cambiando estado..." : "Cambiar estado"}
                </button>
            </div>
        </div>
    )
}

export default DetallePostulacion;
