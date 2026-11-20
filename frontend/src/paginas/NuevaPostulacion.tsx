import { useState, useEffect } from "react"
import { crearPostulacion, ErrorApi, listarMercados, listarModalidades } from "../servicios/api"
import { type MercadoSalida, type ModalidadSalida } from "../tipos/api"
import { useAuth } from "../contextos/AuthContexto";
import Mensaje from "../componentes/Mensaje";
import EsqueletoFormulario from "../componentes/EsqueletoFormulario";

interface Props {
    subirContador: () => void;
}

function NuevaPostulacion({ subirContador }: Props) {

    // AVISOS
    const [cargando, setCargando] = useState(false)
    const [cargandoCatalogos, setCargandoCatalogos] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [idError, setIdError] = useState<string | null>(null)
    const [errorCatalogos, setErrorCatalogos] = useState<string | null>(null)
    const [aviso, setAviso] = useState("")
    const [exito, setExito] = useState("")

    // CATALOGOS
    const [mercados, setMercados] = useState<MercadoSalida[]>([])
    const [modalidades, setModalidades] = useState<ModalidadSalida[]>([])

    // DATOS DEL FORMULARIO
    const [puesto, setPuesto] = useState("")
    const [sueldo, setSueldo] = useState("")
    const [empresa, setEmpresa] = useState("")
    const [portal, setPortal] = useState("")
    const [mercadoId, setMercadoId] = useState("")
    const [modalidadId, setModalidadId] = useState("")
    const [fechaPostulacion, setFechaPostulacion] = useState("")

    const { token } = useAuth()

    // Listar mercados y modalidades para ser usados en <select>
    useEffect(() => {
        if (!token) return

        async function traerCatalogos() {
            try {
                setCargandoCatalogos(true)
                setErrorCatalogos(null)
                const [datosMercados, datosModalidades] = await Promise.all([
                    listarMercados(),
                    listarModalidades(),
                ])
                setMercados(datosMercados)
                setModalidades(datosModalidades)
            }
            catch (error) {
                if (error instanceof ErrorApi) {
                    setErrorCatalogos(error.message)
                    setIdError(error.idError ?? null)
                } else {
                    setErrorCatalogos("Ocurrió un error al cargar los catálogos")
                }
            }
            finally {
                setCargandoCatalogos(false)
            }
        }

        traerCatalogos()
    }, [token])

    if (!token) return null
    const tokenValido: string = token

    if (cargandoCatalogos) {
        return <EsqueletoFormulario />
    }

    if (errorCatalogos) {
        return <Mensaje tipo="error" texto={errorCatalogos} idError={idError}/>
    }

    async function manejarRegistro(evento: React.FormEvent) {
        evento.preventDefault()

        setError(null)
        setIdError(null)
        setAviso("")
        setExito("")

        const listaAviso: string[] = []

        if (!puesto) { listaAviso.push("Puesto") }
        if (!empresa) { listaAviso.push("Empresa") }
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
            empresa: empresa,
            portal: portal || null,
            mercado_id: mercadoId ? parseInt(mercadoId) : null,
            modalidad_id: modalidadId ? parseInt(modalidadId) : null,
            fecha_postulacion: fechaPostulacion
        };

        try {
            setCargando(true)

            await crearPostulacion(tokenValido, datosPostulacion)

            subirContador()

            setExito("Postulación registrada correctamente")

            setPuesto("")
            setSueldo("")
            setEmpresa("")
            setPortal("")
            setMercadoId("")
            setModalidadId("")
            setFechaPostulacion("")
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

    return (
        <div className="flex items-center justify-center p-4 mt-18">
            <div className="bg-superficie p-8 rounded-lg shadow w-full max-w-xl space-y-4">
                <h1 className="text-2xl font-bold mb-4 text-center">Nueva Postulación</h1>

                <form onSubmit={manejarRegistro} className="space-y-4">    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* PUESTO */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">Puesto</label>
                            <input
                                className="w-full p-2 border border-borde rounded"
                                type="text"
                                value={puesto}
                                onChange={evento => setPuesto(evento.target.value)}
                                placeholder="Nombre del puesto de la vacante" />
                        </div>

                        {/* SUELDO */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Sueldo <span className="text-texto-suave">(Opcional)</span></label>
                            <input
                                className="w-full p-2 border border-borde rounded"
                                type="number"
                                value={sueldo}
                                onChange={evento => setSueldo(evento.target.value)}
                                placeholder="Sueldo de la vacante" />
                        </div>

                        {/* EMPRESA */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Empresa</label>
                            <input
                                className="w-full p-2 border border-borde rounded"
                                type="text"
                                value={empresa}
                                onChange={evento => setEmpresa(evento.target.value)}
                                placeholder="Empresa que publicó la vacante" />
                        </div>

                        {/* PORTAL */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Portal <span className="text-texto-suave">(Opcional)</span></label>
                            <input
                                className="w-full p-2 border border-borde rounded"
                                type="text"
                                value={portal}
                                onChange={evento => setPortal(evento.target.value)}
                                placeholder="Portal donde salió la vacante" />
                        </div>

                        {/* LISTA DE MERCADOS */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Mercado <span className="text-texto-suave">(Opcional)</span></label>
                            <select value={mercadoId} onChange={evento => setMercadoId(evento.target.value)} className="w-full p-2 border border-borde rounded">
                                <option value="" className="capitalize">Sin mercado</option>
                                {mercados.map(mercado => (
                                    <option key={mercado.id} value={mercado.id} className="capitalize">{mercado.nombre}</option>
                                ))}
                            </select>
                        </div>

                        {/* LISTA DE MODALIDADES */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Modalidad <span className="text-texto-suave">(Opcional)</span></label>
                            <select value={modalidadId} onChange={evento => setModalidadId(evento.target.value)} className="w-full p-2 border border-borde rounded">
                                <option value="" className="capitalize">Sin modalidad</option>
                                {modalidades.map(modalidad => (
                                    <option key={modalidad.id} value={modalidad.id} className="capitalize">{modalidad.nombre}</option>
                                ))}
                            </select>
                        </div>

                        {/* FECHA DE POSTULACION */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Fecha de postulación</label>
                            <input
                                className="w-full p-2 border border-borde rounded"
                                type="date"
                                value={fechaPostulacion}
                                onChange={evento => setFechaPostulacion(evento.target.value)} />
                        </div>

                    </div>

                    {/* MENSAJES */}
                    {aviso && <Mensaje tipo="aviso" texto={aviso}/>}
                    {error && <Mensaje tipo="error" texto={error} idError={idError}/>}
                    {exito && <Mensaje tipo="exito" texto={exito}/>}
                            
                    <button type="submit" disabled={cargando} className="bg-marino text-white p-2 rounded w-full hover:bg-marino-oscuro">
                        {cargando ? "Registrando..." : "Registrar postulación"}
                    </button>

                </form>
            </div>
        </div>
    )
}

export default NuevaPostulacion;