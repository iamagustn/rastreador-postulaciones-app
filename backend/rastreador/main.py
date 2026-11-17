from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse                   
from fastapi.middleware.cors import CORSMiddleware           
from rastreador.configuracion import frontend_url
import logging                                              
import uuid           
import rastreador.rutas.cuentas as cuentas  
import rastreador.rutas.postulaciones as postulaciones
import rastreador.rutas.catalogos as catalogos

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",    
)

logger = logging.getLogger(__name__)

app = FastAPI()

origins_crudos = frontend_url.split(",")
origins = [origen.strip() for origen in origins_crudos]

@app.exception_handler(RequestValidationError)
def manejador_validaciones(request, exc):       # 'request' lo que manda el cliente, 'exc' el error que registra la app
    lista_errores = []
    for error in exc.errors():
        loc = error["loc"]          
        msg = error["msg"]          
        if "body" in loc:              
            lista_errores.append(f"Error en el campo {loc[-1]}: {msg}")         
        else:
            lista_errores.append("El identificador debe ser un numero entero")      # Si no esta en el cuerpo, se asume que esta en en los parametros de la URL

    return JSONResponse(status_code=422, content={"detail": " | ".join(lista_errores)})

@app.middleware("http")
async def manejador_error_servidor_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as exc:
        clave = str(uuid.uuid4())
        logger.error("Ocurrio un error interno en el servidor con la clave %s", clave, exc_info=exc) 

        return JSONResponse(
            status_code=500,
            content={
                "detail": "Ocurrio un error en el servidor. Trabajaremos para solucionarlo pronto",
                "id_error": clave
            }
        )  

# Registrar el Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(cuentas.router)
app.include_router(postulaciones.router)
app.include_router(catalogos.router)