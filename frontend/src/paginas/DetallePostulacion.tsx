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
                        className="px-4 py-2 rounded border border-marino text-marino hover:bg-marino hover:text-white transition">
                        Editar
                    </Link>
                    <button 
                        onClick={manejarBorrado}
                        className="px-4 py-2 rounded border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition">
                        Borrar
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