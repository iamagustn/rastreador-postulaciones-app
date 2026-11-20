import { useEffect, useState } from "react"
import { ErrorApi, iniciarSesion, registrarUsuario } from "../servicios/api"
import { Link } from "react-router-dom";
import { useAuth } from "../contextos/AuthContexto";
import Mensaje from "../componentes/Mensaje";

function Registro() {

    const [cargando, setCargando] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [idError, setIdError] = useState<string | null>(null)
    const [aviso, setAviso] = useState("")

    const [tardando, setTardando] = useState(false)

    const [nombre, setNombre] = useState("")
    const [apellidos, setApellidos] = useState("")
    const [correo, setCorreo] = useState("")
    const [contrasena, setContrasena] = useState("")
    const [mostrarContrasena, setMostrarContrasena] = useState(false)

    const { guardarToken } = useAuth()

    async function manejarRegistro(evento: React.FormEvent) {
        evento.preventDefault()

        setError(null)
        setIdError(null)
        setAviso("")
        const listaAviso: string[] = []

        if (!nombre) { listaAviso.push("Nombre")}
        if (!apellidos) { listaAviso.push("Apellidos")}
        if (!correo) { listaAviso.push("Correo")}
        if (!contrasena) { listaAviso.push("Contraseña")}
        if (listaAviso.length > 0){
            setAviso("Llena los siguientes campos: " + listaAviso.join(', '))
            return
        }

        const datosRegistro = {
            nombre: nombre,
            apellidos: apellidos,
            correo: correo,
            contrasena: contrasena,
        }

        try {
            setCargando(true)
            const respuesta = await registrarUsuario(datosRegistro)

            const datosLogin = {
                correo: respuesta.correo,
                contrasena: contrasena,
            }

            const respuestaLogin = await iniciarSesion(datosLogin)
            guardarToken(respuestaLogin.access_token)
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

    useEffect(() => {
        if (!cargando) {
            setTardando(false)
            return
        }
        const temporizador = setTimeout(() => setTardando(true), 5000);
        return () => clearTimeout(temporizador)
    }, [cargando])

    return (
        <div className="flex items-center justify-center p-4 mt-18">
            <div className="bg-superficie p-8 rounded-lg shadow w-full max-w-sm space-y-4">
                <h1 className="text-2xl font-bold text-center">Registrarse</h1>

                <form onSubmit={manejarRegistro} className="space-y-4">
                    <input 
                        className="w-full p-2 border border-borde rounded"
                        type="text"
                        value={nombre}
                        onChange={evento => setNombre(evento.target.value)}
                        placeholder="Tu nombre"/>

                    <input 
                        className="w-full p-2 border border-borde rounded"
                        type="text"
                        value={apellidos}
                        onChange={evento => setApellidos(evento.target.value)}
                        placeholder="Tus apellidos"/>

                    <input 
                        className="w-full p-2 border border-borde rounded"
                        type="text"
                        value={correo}
                        onChange={evento => setCorreo(evento.target.value)}
                        placeholder="usuario@example.com"/>

                    <div className="relative">
                        <input 
                            className="w-full p-2 pr-10 border border-borde rounded"
                            type={mostrarContrasena ? "text" : "password"}
                            value={contrasena}
                            onChange={evento => setContrasena(evento.target.value)}
                            placeholder="Contraseña"/>

                        <button
                            type="button"
                            onClick={() => setMostrarContrasena(!mostrarContrasena)}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                            {mostrarContrasena ? (
                                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-texto-suave hover:text-texto">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                            ) : (
                                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-texto-suave hover:text-texto">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {tardando && <Mensaje tipo="aviso" texto="El servidor está despertando, esto tarda unos segundos la primera vez" />}
                    {aviso && <Mensaje tipo="aviso" texto={aviso}/>}
                    {error && <Mensaje tipo="error" texto={error} idError={idError}/>}

                    <button 
                        type="submit"
                        className="bg-marino text-white p-2 rounded w-full hover:bg-marino-oscuro"
                        disabled={cargando}>
                            {cargando ? "Registrando..." : "Registrarse"}
                    </button>
                </form>

                <Link 
                    to="/login"
                    className="text-marino text-sm block text-center">¿Ya tienes cuenta? Inicia sesión</Link>

            </div>
        </div>
    )

}

export default Registro;