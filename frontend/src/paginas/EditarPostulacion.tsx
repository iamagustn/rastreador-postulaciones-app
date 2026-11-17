import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { type MercadoSalida, type ModalidadSalida } from "../tipos/api";
import { editarPostulacion, listarMercados, listarModalidades, obtenerPostulacion } from "../servicios/api";
import { useAuth } from "../contextos/AuthContexto";

function EditarPostulacion() {
    const { id } = useParams()
    const idValido = Number(id)

    const navigate = useNavigate()

    // AVISOS
    const [cargando, setCargando] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [aviso, setAviso] = useState("")
    const [exito, setExito] = useState("")

    // CATALOGOS
    const [mercados, setMercados] = useState<MercadoSalida[]>([])
    const [modalidades, setModalidades] = useState<ModalidadSalida[]>([])
    
    // DATOS DEL FORMULARIO
    const [puesto, setPuesto] = useState("")
    const [sueldo, setSueldo] = useState("")
    const [mercadoId, setMercadoId] = useState("")
    const [modalidadId, setModalidadId] = useState("")
    const [fechaPostulacion, setFechaPostulacion] = useState("")

    const { token } = useAuth()
    if (!token) return null
    const tokenValido: string = token

    async function manejarEdicion() {
        setError(null)
        setAviso("")
        setExito("")

        const listaAviso: string[] = []
        
        if (!puesto) { listaAviso.push("Puesto")}
        if (!fechaPostulacion) { listaAviso.push("Fecha de postulación")}

        if (listaAviso.length > 0) {
            setAviso("Llena los siguientes campos: " + listaAviso.join(', '))
            return
        }

        const sueldoNumerico = parseFloat(sueldo)
        const sueldoCentavos = Math.round(sueldoNumerico * 100)

        const datosPostulacion = {
            puesto: puesto,
            sueldo_centavos: sueldoNumerico > 0 ? sueldoCentavos : null,
            mercado_id: mercadoId ? parseInt(mercadoId) : null,
            modalidad_id: modalidadId ? parseInt(modalidadId) : null,
            fecha_postulacion: fechaPostulacion
        };

        try {
            setCargando(true)
            await editarPostulacion(idValido, datosPostulacion, tokenValido)
            setExito("Cambios registrados correctamente")
            navigate("/postulaciones")
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
    }

    useEffect(() => {
        async function traerCatalogos() {
            try {
                const [datosMercados, datosModalidades, respuestaPostulacion] = await Promise.all([
                    listarMercados(),
                    listarModalidades(),
                    obtenerPostulacion(idValido, tokenValido)
                ])
                setMercados(datosMercados)
                setModalidades(datosModalidades)
                setPuesto(respuestaPostulacion.puesto)
                setSueldo(respuestaPostulacion.sueldo_centavos ? (respuestaPostulacion.sueldo_centavos / 100.0).toString() : "")
                setMercadoId(respuestaPostulacion.mercado ? (respuestaPostulacion.mercado.id).toString() : "")
                setModalidadId(respuestaPostulacion.modalidad ? (respuestaPostulacion.modalidad.id).toString() : "")
                setFechaPostulacion(respuestaPostulacion.fecha_postulacion)
            }
            catch (error) {
                if (error instanceof Error) {
                    setError(error.message)
                } else {
                    setError("Ocurrió un error inesperado")
                }
            }
        }

        traerCatalogos()
    }, [])

    if (!id || Number.isNaN(idValido)){
        return <p>El ID es invalido</p>
    }

    return (
        <div>
            <input
                type="text"
                value={puesto}
                onChange={evento => setPuesto(evento.target.value)}
                placeholder="Nombre del puesto de la vacante"/>
            
            <input
                type="number"
                value={sueldo}
                onChange={evento => setSueldo(evento.target.value)}
                placeholder="Sueldo de la vacante (opcional)"/>
            
             <select value={mercadoId} onChange={evento => setMercadoId(evento.target.value)}>
                <option value="">Sin mercado</option>
                {mercados.map(mercado => (
                    <option key={mercado.id} value={mercado.id}>{mercado.nombre}</option>
                ))}
            </select>

            <select value={modalidadId} onChange={evento => setModalidadId(evento.target.value)}>
                <option value="">Sin modalidad</option>
                {modalidades.map(modalidad => (
                    <option key={modalidad.id} value={modalidad.id}>{modalidad.nombre}</option>
                ))}
            </select>

            {/* FECHA DE POSTULACION */}
            <input
                type="date"
                value={fechaPostulacion}
                onChange={evento => setFechaPostulacion(evento.target.value)}/>

            {/* MENSAJES */}
            {aviso && <p>{aviso}</p>}
            {cargando && <p>Espera un momento...</p>}
            {error && <p>Ocurrió un error: {error}</p>}
            {exito && <p>{exito}</p>}

            <button onClick={manejarEdicion} disabled={cargando}>
                {cargando ? "Guardando los cambios..." : "Editar postulación"}
            </button>
        </div>
    )
}

export default EditarPostulacion;