import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { type MercadoSalida, type ModalidadSalida } from "../tipos/api";
import { editarPostulacion, ErrorApi, listarMercados, listarModalidades, obtenerPostulacion } from "../servicios/api";
import { useAuth } from "../contextos/AuthContexto";
import Mensaje from "../componentes/Mensaje";
import EsqueletoFormulario from "../componentes/EsqueletoFormulario";
import { Link } from "react-router-dom";
import PantallaVacia from "../componentes/PantallaVacia";

function EditarPostulacion() {
  const { id } = useParams()
  const idValido = Number(id)
  const navigate = useNavigate()

  // AVISOS
  const [cargando, setCargando] = useState(false)
  const [cargandoDatos, setCargandoDatos] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [idError, setIdError] = useState<string | null>(null)
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

  useEffect(() => {
    if (!token || !id || Number.isNaN(idValido)) return

    async function traerCatalogos() {
      try {
        setCargandoDatos(true)
        const [datosMercados, datosModalidades, respuestaPostulacion] = await Promise.all([
          listarMercados(),
          listarModalidades(),
          obtenerPostulacion(idValido, token!)
        ])

        if (!respuestaPostulacion) {
          throw new Error("La postulación no existe")
        }

        setMercados(datosMercados)
        setModalidades(datosModalidades)
        setPuesto(respuestaPostulacion.puesto)
        setSueldo(respuestaPostulacion.sueldo_centavos ? (respuestaPostulacion.sueldo_centavos / 100.0).toString() : "")
        setMercadoId(respuestaPostulacion.mercado ? (respuestaPostulacion.mercado.id).toString() : "")
        setModalidadId(respuestaPostulacion.modalidad ? (respuestaPostulacion.modalidad.id).toString() : "")
        setFechaPostulacion(respuestaPostulacion.fecha_postulacion)

      } catch (error) {
        if (error instanceof ErrorApi) {
          setError(error.message)
          setIdError(error.idError ?? null)
        } else {
          setError("Ocurrió un error inesperado")
        }

      } finally {
        setCargandoDatos(false)
      }
    }
    traerCatalogos()
  }, [id, idValido, token])

  if (!token) return null
  const tokenValido: string = token

  if (!id || Number.isNaN(idValido)) {
      return (
          <PantallaVacia 
            titulo="El ID es invalido"
            descripcion="El identificador de la postulación es invalido"
            icono={
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-texto-suave">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            }
          />
      )
    }


  if (cargandoDatos) {
    return <EsqueletoFormulario />
  }

  if (error && !puesto) {
    return <Mensaje tipo="error" texto={error} idError={idError}/>
  }

  async function manejarEdicion() {
    setError(null)
    setIdError(null)
    setAviso("")
    setExito("")

    const listaAviso: string[] = []

    if (!puesto) { listaAviso.push("Puesto") }
    if (!fechaPostulacion) { listaAviso.push("Fecha de postulación") }
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

    } catch (error) {
      if (error instanceof ErrorApi) {
        setError(error.message)
        setIdError(error.idError ?? null)
      } else {
        setError("Ocurrió un error inesperado")
      }

    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="flex items-center justify-center p-4 mt-18">
      <div className="bg-superficie p-8 rounded-lg shadow w-full max-w-xl space-y-4">
      
        <h1 className="text-2xl font-bold mb-4 text-center">Editar postulación</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Puesto</label>
            <input 
              className="w-full p-2 border border-borde rounded"
              type="text" 
              value={puesto} 
              onChange={evento => setPuesto(evento.target.value)} 
              placeholder="Nombre del puesto de la vacante" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Sueldo <span className="text-texto-suave">(Opcional)</span></label>
            <input 
              className="w-full p-2 border border-borde rounded"
              type="number" 
              value={sueldo} 
              onChange={evento => setSueldo(evento.target.value)} 
              placeholder="Sueldo de la vacante (opcional)" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Mercado <span className="text-texto-suave">(Opcional)</span></label>
            <select value={mercadoId} onChange={evento => setMercadoId(evento.target.value)} className="w-full p-2 border border-borde rounded">
              <option value="">Sin mercado</option>
              {mercados.map(mercado => (
                <option key={mercado.id} value={mercado.id}>{mercado.nombre}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Modalidad <span className="text-texto-suave">(Opcional)</span></label>
            <select value={modalidadId} onChange={evento => setModalidadId(evento.target.value)} className="w-full p-2 border border-borde rounded">
              <option value="">Sin modalidad</option>
              {modalidades.map(modalidad => (
                <option key={modalidad.id} value={modalidad.id}>{modalidad.nombre}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Fecha de postulación</label>
            <input 
              className="w-full p-2 border border-borde rounded"
              type="date" 
              value={fechaPostulacion} 
              onChange={evento => setFechaPostulacion(evento.target.value)} />
          </div>

        </div>

        {aviso && <Mensaje tipo="aviso" texto={aviso}/>}
        {error && <Mensaje tipo="error" texto={error} idError={idError}/>}
        {exito && <Mensaje tipo="exito" texto={exito}/>}
        
        <button onClick={manejarEdicion} disabled={cargando} className="bg-marino text-white p-2 rounded w-full hover:bg-marino-oscuro">
          {cargando ? "Guardando los cambios..." : "Editar postulación"}
        </button>
        <Link to={`/postulaciones/${idValido}`} className="text-marino text-sm block text-center">
          Cancelar
        </Link>
      </div>
    </div>
  )
}

export default EditarPostulacion;