import { useState } from "react"
import { ErrorApi, iniciarSesion, registrarUsuario } from "../servicios/api"
import { Link } from "react-router-dom";
import { useAuth } from "../contextos/AuthContexto";
import MensajeError from "../componentes/MensajeError";


function Registro() {

    const [cargando, setCargando] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [idError, setIdError] = useState<string | null>(null)
    const [aviso, setAviso] = useState("")

    const [nombre, setNombre] = useState("")
    const [apellidos, setApellidos] = useState("")
    const [correo, setCorreo] = useState("")
    const [contrasena, setContrasena] = useState("")

    const { guardarToken } = useAuth()

    async function manejarRegistro() {
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

    return (
        <div className="flex items-center justify-center p-4 mt-18">
            <div className="bg-superficie p-8 rounded-lg shadow w-full max-w-sm space-y-4">
                <h1 className="text-2xl font-bold text-center">Registrarse</h1>

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

                <input 
                    className="w-full p-2 border border-borde rounded"
                    type="password"
                    value={contrasena}
                    onChange={evento => setContrasena(evento.target.value)}
                    placeholder="Contraseña"/>

                {aviso && <p>{aviso}</p>}
                {cargando && <p>Espera un momento...</p>}
                {error && <MensajeError error={error} idError={idError}/>}

                <button 
                    onClick={manejarRegistro}
                    className="bg-marino text-white p-2 rounded w-full hover:bg-marino-oscuro">Registrarse</button>

                <Link 
                    to="/login"
                    className="text-marino text-sm block text-center">¿Ya tienes cuenta? Inicia sesión</Link>

            </div>
        </div>
    )

}

export default Registro;