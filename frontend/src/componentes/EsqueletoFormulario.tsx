function EsqueletoFormulario() {
  return (
    <div className="max-w-xl mx-auto">
      <div className="animate-pulse bg-superficie rounded-lg p-8 border border-borde">
        
        {/* Título */}
        <div className="flex justify-center mb-6">
          <div className="h-7 w-48 bg-borde rounded-md"></div>
        </div>

        <div className="space-y-4">
          {/* Puesto */}
          <div>
            <div className="h-3.5 w-16 bg-borde rounded mb-2"></div>
            <div className="h-10 w-full bg-borde rounded-md"></div>
          </div>

          {/* Sueldo y Empresa */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="h-3.5 w-28 bg-borde rounded mb-2"></div>
              <div className="h-10 w-full bg-borde rounded-md"></div>
            </div>
            <div>
              <div className="h-3.5 w-20 bg-borde rounded mb-2"></div>
              <div className="h-10 w-full bg-borde rounded-md"></div>
            </div>
          </div>

          {/* Portal y Mercado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="h-3.5 w-24 bg-borde rounded mb-2"></div>
              <div className="h-10 w-full bg-borde rounded-md"></div>
            </div>
            <div>
              <div className="h-3.5 w-28 bg-borde rounded mb-2"></div>
              <div className="h-10 w-full bg-borde rounded-md"></div>
            </div>
          </div>

          {/* Modalidad y Fecha de postulación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="h-3.5 w-32 bg-borde rounded mb-2"></div>
              <div className="h-10 w-full bg-borde rounded-md"></div>
            </div>
            <div>
              <div className="h-3.5 w-36 bg-borde rounded mb-2"></div>
              <div className="h-10 w-full bg-borde rounded-md"></div>
            </div>
          </div>

          {/* Botón de envío */}
          <div className="pt-2">
            <div className="h-11 w-full bg-borde rounded-md"></div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default EsqueletoFormulario;