import type { UsuarioEntrada, UsuarioSalida, LoginEntrada, PostulacionSalida, TokenSalida, PostulacionEntrada, MercadoSalida, ModalidadSalida, EstadoSalida, HistorialSalida, PostulacionParche } from "../tipos/api";

const apiUrl = import.meta.env.VITE_API_URL
let alRecibir401: (() => void) | null = null

function cabecera(token: string){
    const cabecera = { "Authorization": "Bearer " + token }
    return cabecera
}

async function verificarRespuesta(respuesta: Response){
    if (!respuesta.ok){
        if (respuesta.status === 401 && alRecibir401) {
            alRecibir401()
        }
        const cuerpo = await respuesta.json()
        throw new Error(cuerpo.detail)
    }
}

export function registrarManejador401(funcion: () => void) {
    alRecibir401 = funcion
}

export async function registrarUsuario(usuario: UsuarioEntrada): Promise<UsuarioSalida> {
    const respuesta = await fetch(`${apiUrl}/usuarios`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(usuario),
    });

    await verificarRespuesta(respuesta)
    return respuesta.json()
}

export async function iniciarSesion(datos: LoginEntrada): Promise<TokenSalida> {
    const respuesta = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(datos),
    });

    await verificarRespuesta(respuesta)
    return respuesta.json()
}

export async function obtenerPerfil(token: string): Promise<UsuarioSalida> {
    const respuesta = await fetch(`${apiUrl}/perfil`, {
        method: "GET",
        headers: cabecera(token),
    });
    await verificarRespuesta(respuesta)
    return respuesta.json()
}

export async function listarPostulaciones(token: string): Promise<PostulacionSalida[]> {
    const respuesta = await fetch(`${apiUrl}/postulaciones`, {
        method: "GET",
        headers: cabecera(token),
    });
    await verificarRespuesta(respuesta)
    return respuesta.json()
}

export async function listarMercados(): Promise<MercadoSalida[]> {
    const respuesta = await fetch(`${apiUrl}/mercados`, {
        method: "GET",
    });
    await verificarRespuesta(respuesta)
    return respuesta.json()
}

export async function listarEstados(): Promise<EstadoSalida[]> {
    const respuesta = await fetch(`${apiUrl}/estados`, {
        method: "GET",
    });
    await verificarRespuesta(respuesta)
    return respuesta.json()
}

export async function listarModalidades(): Promise<ModalidadSalida[]> {
    const respuesta = await fetch(`${apiUrl}/modalidades`, {
        method: "GET",
    });
    await verificarRespuesta(respuesta)
    return respuesta.json()
}

export async function crearPostulacion(token: string, postulacion : PostulacionEntrada): Promise<PostulacionSalida> {
    const respuesta = await fetch(`${apiUrl}/postulaciones`, {
        method: "POST",
        headers: {...cabecera(token), "Content-Type": "application/json"}, 
        body: JSON.stringify(postulacion),
    });
    await verificarRespuesta(respuesta)
    return respuesta.json()
}

export async function obtenerPostulacion(id: number, token: string): Promise<PostulacionSalida> {
    const respuesta = await fetch(`${apiUrl}/postulaciones/${id}`, {
        method: "GET",
        headers: cabecera(token),
    })
    await verificarRespuesta(respuesta)
    return respuesta.json()
}

export async function obtenerHistorial(id: number, token: string): Promise<HistorialSalida[]> {
    const respuesta = await fetch(`${apiUrl}/postulaciones/${id}/historial`, {
        method: "GET",
        headers: cabecera(token),
    })
    await verificarRespuesta(respuesta)
    return respuesta.json()
}

export async function cambiarEstado(id: number, estado: string, token: string): Promise<PostulacionSalida> {
    const respuesta = await fetch(`${apiUrl}/postulaciones/${id}/estado`, {
        method: "PATCH",
        headers: {...cabecera(token), "Content-Type": "application/json"},
        body: JSON.stringify({ estado })
    });
    await verificarRespuesta(respuesta)
    return respuesta.json()
}

export async function editarPostulacion(id: number, datos: PostulacionParche, token: string): Promise<PostulacionSalida> {
    const respuesta = await fetch(`${apiUrl}/postulaciones/${id}`, {
        method: "PATCH",
        headers: {...cabecera(token), "Content-Type": "application/json"},
        body: JSON.stringify(datos),
    });
    await verificarRespuesta(respuesta)
    return respuesta.json()
}

export async function borrarPostulacion(id: number, token: string): Promise<void> {
    const respuesta = await fetch(`${apiUrl}/postulaciones/${id}`, {
        method: "DELETE",
        headers: cabecera(token)
    })
    await verificarRespuesta(respuesta)
}