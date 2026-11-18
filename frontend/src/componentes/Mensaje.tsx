const ESTILOS_AVISOS: Record<string, string> = {
  error: "inline-block rounded text-sm p-3 font-medium bg-red-100 text-red-800 border border-red-200",
  exito: "inline-block rounded text-sm p-3 font-medium bg-green-100 text-green-800 border border-green-200",
  aviso: "inline-block rounded text-sm p-3 font-medium bg-amber-100 text-amber-800 border border-amber-200",
};

interface Props {
    tipo: "error" | "aviso" | "exito";
    texto: string;
    idError?: string | null;
}

function Mensaje({ tipo, texto, idError}: Props) {
    return (
        <div className={ESTILOS_AVISOS[tipo]}>
            <p>{texto}</p>
            {idError && <p className="text-xs mt-1">ID del error: {idError}</p>}
        </div>
    )
}

export default Mensaje;