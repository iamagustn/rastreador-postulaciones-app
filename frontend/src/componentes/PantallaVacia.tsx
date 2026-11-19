import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface Props {
    icono: ReactNode;
    titulo: string;
    descripcion: string;
}

function PantallaVacia({ icono, titulo, descripcion }: Props) {
    return (
        <div className="bg-superficie p-12 rounded-lg border border-borde space-y-4 mt-18 text-center">
            {icono}
            <h2 className="text-lg font-bold">{titulo}</h2>
            <p className="text-texto-suave">{descripcion}</p>
            <Link to="/postulaciones" className="px-4 py-2 rounded border inline-block bg-marino text-white hover:bg-marino-oscuro transition">
                Volver a mis postulaciones
            </Link>
        </div>
    )
}

export default PantallaVacia;