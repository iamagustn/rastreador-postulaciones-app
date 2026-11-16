import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { type EstadoSalida, type HistorialSalida, type PostulacionSalida } from "../tipos/api";
import { useAuth } from "../contextos/AuthContexto";
import { cambiarEstado, listarEstados, obtenerHistorial, obtenerPostulacion } from "../servicios/api";
import TarjetaPostulacion from "../componentes/TarjetaPostulacion";

function DetallePostulacion(){

    const { id } = useParams();

    const [postulacion, setPostulacion] = useState<PostulacionSalida>()
    const [historial, setHistorial] = useState<HistorialSalida[]>([])

    const [error, setError] = useState<string | null>(null)
    const [cargando, setCargando] = useState(false)
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
        setExito("")
        try {
            setCargangoCambio(true)
            await cambiarEstado(idValido, estado, tokenValido)
            setExito("Cambio hecho exitosamente")
            subirContador()
        }
        catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError("Ocurrió un error inesperado")
            }
        }
        finally {
            setCargangoCambio(false)
        }
    }

    useEffect(() => {
        async function manejarDatos(){
            try {
                setCargando(true)
                const respuestaPostulacion = await obtenerPostulacion(idValido, tokenValido)
                const respuestaHistorial = await obtenerHistorial(idValido, tokenValido)
                const datosEstado = await listarEstados()
                setPostulacion(respuestaPostulacion)
                setEstado(respuestaPostulacion.estado.nombre_estado)
                setHistorial(respuestaHistorial)
                setEstados(datosEstado)
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
    }, [idValido, tokenValido, contador])

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
            {exito && <p>{exito}</p>}

            <button onClick={manejarCambioEstado} disabled={cargandoCambio}>
                {cargandoCambio ? "Cambiando estado..." : "Cambiar estado"}
            </button>
            
        </div>
    )
}

export default DetallePostulacion;