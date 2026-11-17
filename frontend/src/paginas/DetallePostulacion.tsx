import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { type EstadoSalida, type HistorialSalida, type PostulacionSalida } from "../tipos/api";
import { useAuth } from "../contextos/AuthContexto";
import { borrarPostulacion, cambiarEstado, ErrorApi, listarEstados, obtenerHistorial, obtenerPostulacion } from "../servicios/api";
import TarjetaPostulacion from "../componentes/TarjetaPostulacion";
import MensajeError from "../componentes/MensajeError";

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
        return <p>Cargando postulacion...</p>
    }

    if (error && !postulacion) {
        return <MensajeError error={error} idError={idError}/>
    }

    if (!postulacion) {
        return <p>La postulación no existe</p>
    }

    return (
        <div>
            <Link to={`/postulaciones/${idValido}/editar`}>Editar postulación</Link>
            <button onClick={manejarBorrado}>Borrar postulación</button>

            <TarjetaPostulacion key={postulacion.id} postulacion={postulacion} />

            {historial.map(entrada => (
                <p key={entrada.id}>
                    {entrada.estado.nombre_estado} — {new Date(entrada.fecha).toLocaleString('es-MX', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </p>
            ))}

            <select value={estado} onChange={evento => setEstado(evento.target.value)}>
                {estados.map(estado => (
                    <option key={estado.id} value={estado.nombre_estado}>{estado.nombre_estado}</option>
                ))}
            </select>

            {cargandoCambio && <p>Cargando el cambio...</p>}
            {error && <MensajeError error={error} idError={idError}/>}
            {exito && <p>{exito}</p>}

            <button onClick={manejarCambioEstado} disabled={cargandoCambio}>
                {cargandoCambio ? "Cambiando estado..." : "Cambiar estado"}
            </button>

        </div>
    )
}

export default DetallePostulacion;