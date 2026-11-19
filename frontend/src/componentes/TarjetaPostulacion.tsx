import type { PostulacionSalida } from "../tipos/api";

interface Props {
  postulacion: PostulacionSalida;
}

export const ESTILOS_ESTADO: Record<string, string> = {
  rechazado: "bg-red-100 text-red-800 border border-red-200",
  oferta: "bg-green-100 text-green-800 border border-green-200",
  entrevista: "bg-amber-100 text-amber-800 border border-amber-200",
  postulado: "bg-gray-100 text-gray-800 border border-gray-200",
};

export const ESTILO_POR_DEFECTO = "bg-slate-100 text-slate-700 border border-slate-200";
const TEXTO_PRINCIPAL = "text-lg font-bold"
const TEXTO_SECUNDARIO = "text-sm text-texto-suave"

function TarjetaPostulacion({ postulacion }: Props) {
  const nombreEstado = postulacion.estado.nombre_estado;
  const claseColorEstado = ESTILOS_ESTADO[nombreEstado] ?? ESTILO_POR_DEFECTO;

  return (
    <div className="bg-superficie p-4 rounded-lg border border-borde space-y-4">
      <h3 className={`capitalize ${TEXTO_PRINCIPAL}`}>{postulacion.puesto}</h3>

      <p className="text-base text-texto-suave capitalize">{postulacion.empresa.nombre_empresa}</p>

      {postulacion.sueldo_centavos && (<p className={TEXTO_SECUNDARIO}>${(postulacion.sueldo_centavos / 100.0).toLocaleString("es-MX")}</p>)}

      <div>
        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize ${claseColorEstado}`}>
          {postulacion.estado.nombre_estado}
        </span>
      </div>

      {postulacion.portal && (<p className={`capitalize ${TEXTO_SECUNDARIO}`}>{postulacion.portal.nombre_portal}</p>)}

      {postulacion.mercado && (<p className={`capitalize ${TEXTO_SECUNDARIO}`}>{postulacion.mercado.nombre}</p>)}

      {postulacion.modalidad && (<p className={`capitalize ${TEXTO_SECUNDARIO}`}>{postulacion.modalidad.nombre}</p>)}
    </div>
  );
}

export default TarjetaPostulacion;