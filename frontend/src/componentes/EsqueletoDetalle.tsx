function EsqueletoDetalle() {
  const tarjetasFalsas = [1];

  return (
    <div>
      {/* Título */}
      <div className="animate-pulse mb-6">
        <div className="h-7 w-48 bg-borde rounded-md"></div>
      </div>

      {/* Lista de tarjetas apiladas */}
      <div className="space-y-4">
        {tarjetasFalsas.map((item) => (
          <div 
            key={item} 
            className="animate-pulse bg-superficie rounded-lg p-6 border border-borde"
          >
            {/* Puesto, Empresa, Sueldo, Estado */}
            <div className="h-5 w-44 bg-borde rounded mb-3.5"></div>
            <div className="h-4 w-24 bg-borde rounded mb-3"></div>
            <div className="h-3.5 w-20 bg-borde rounded mb-3.5"></div>
            <div className="h-6 w-20 bg-borde rounded-full mb-4"></div>

            {/* Portal, Mercado y Modalidad */}
            <div className="space-y-2.5">
              <div className="h-3.5 w-16 bg-borde rounded"></div>
              <div className="h-3.5 w-14 bg-borde rounded"></div>
              <div className="h-3.5 w-20 bg-borde rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EsqueletoDetalle;