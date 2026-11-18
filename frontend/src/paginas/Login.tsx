import { useState } from "react";
import { ErrorApi, iniciarSesion } from "../servicios/api";
import { Link } from "react-router-dom";
import { useAuth } from "../contextos/AuthContexto";
import MensajeError from "../componentes/MensajeError";

function Login(){

    const [cargando, setCargando] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [idError, setIdError] = useState<string | null>(null)
    const [aviso, setAviso] = useState("")

    const [correo, setCorreo] = useState("")
    const [contrasena, setContrasena] = useState("")

    const { guardarToken } = useAuth()

    async function manejarLogin() {
        const listaAviso: string[] = []

        if (!correo) { listaAviso.push("Correo")}
        if (!contrasena) { listaAviso.push("Contraseña")}
        if (listaAviso.length > 0){
            setAviso("Llena los siguientes campos: " + listaAviso.join(', '))
            return
        }

        const datosLogin = {
            correo: correo,
            contrasena: contrasena
        }

        try {
            setCargando(true)
            const respuesta = await iniciarSesion(datosLogin)
            guardarToken(respuesta.access_token)
        }
        catch (error) {
            if (error instanceof ErrorApi){
                setError(error.message);
                setIdError(error.idError ?? null);
            } else {
                setError("Ocurrió un error inesperado")
            }
        }
        finally {
            setCargando(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-fondo p-4">
            <div className="bg-superficie p-8 rounded-lg shadow w-full max-w-sm space-y-4">
                <h1 className="text-2xl font-bold text-center">Iniciar Sesión</h1>

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
                    onClick={manejarLogin}
                    className="bg-marino text-white p-2 rounded w-full hover:bg-marino-oscuro">Iniciar sesión</button>

                <Link 
                    to="/registro"
                    className="text-marino text-sm block text-center">¿No tienes cuenta? Regístrate</Link>

            </div>            
        </div>
    )
}

export default Login;