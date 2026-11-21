# Rastreador de Postulaciones

## ¿Qué es?

App para dar seguimiento a tus postulaciones, ayudando a tener un mejor control y organización de dónde has enviado solicitudes, de qué portal provienen, el tipo de mercado y su modalidad de trabajo, ya sea remoto, presencial o híbrido.

Suele ocurrir que tenemos postulaciones registradas en Indeed, LinkedIn u OCC y no sabemos dónde consultarlas. Con esta app podemos tener todo ese registro concentrado en un solo lugar.

## Enlaces de la app desplegada

Desplegué mi app usando Render para alojar tanto la API como el frontend, y para la base de datos usé Neon.

Frontend:

[https://rastreador-postulaciones-app-1.onrender.com](https://rastreador-postulaciones-app-1.onrender.com)

Documentación de la API:

[https://rastreador-postulaciones-app.onrender.com/docs](https://rastreador-postulaciones-app.onrender.com/docs)

## ¿Qué hace?

- Registro con autenticación
- CRUD de postulaciones
- Historial de cambio de estados
- Catálogos de modalidades, mercados y estados

## ¿Con qué está hecho?

- FastAPI
- Postgres
- React
- TypeScript
- Tailwind
- JWT
- SQLAlchemy
- Bcrypt
- Pytest

## ¿Cómo correrlo en local?

1. Clona este repositorio ejecutando:

```bash
git clone https://github.com/iamagustn/rastreador-postulaciones-app
```

2. Crea el entorno virtual ejecutando:

```bash
python -m venv .venv
```

Actívalo ejecutando:

Windows (CMD):

```bat
.venv\Scripts\activate.bat
```

Windows (PowerShell):

```powershell
.venv\Scripts\Activate.ps1
```

MacOS/Linux:

```bash
source .venv/bin/activate
```

3. Instala las dependencias:

```bash
pip install -r requirements.txt
```

4. Necesitarás las variables de entorno que ocupa el backend y el frontend:

- LLAVE: genera una llave usando secrets.
- DURACION_TOKEN: escribe el número de minutos que quieres que dure el token.
- FRONTEND_URL: la URL de tu frontend local.
- DATABASE_URL: el formato de una cadena de conexión de Postgres sin credenciales reales.
- VITE_API_URL: la URL de la API para Vite.
- DATABASE_URL_TEST: URL de la base de pruebas (se debe crear aparte de la BD de producción).

5. Ejecuta backend/esquema.sql y backend/datos_iniciales.sql contra la base de datos.

6. Ejecuta este comando desde la carpeta de backend:

```bash
uvicorn rastreador.main:app --reload
```

Y este desde la carpeta de frontend:

```bash
npm run dev
```

7. Para ejecutar las pruebas es necesario haber configurado primero la URL de DATABASE_URL_TEST. Una vez hecho, ejecuta este comando:

```bash
pytest -v
```

## Decisiones de Diseño

- El sueldo se guarda en centavos para evitar problemas de redondeo al mostrarlo, ya que puede haber inconsistencias al pasar de la base de datos al backend y al frontend, perdiendo decimales. Esto se debe a que JavaScript no representa todos los decimales con exactitud. Al guardar el dinero en centavos y dividirlo al mostrarlo, se evitan errores de redondeo en los sueldos registrados.
- Catálogos como mercados, estados y modalidades se guardan como tablas en vez de utilizar CHECK, porque está pensado para que, si algún día se quiere agregar un nuevo estado, modalidad o mercado, simplemente se agregue desde la tabla. En cambio, si se dejaba como un CHECK, en el peor de los casos se tendría que modificar la tabla que tuviera esa restricción o hacer un ALTER TABLE.
- El historial se guarda como tabla en vez de como un campo porque permite mostrar cómo ha ido evolucionando una postulación. Si un día está en estado de postulado y al otro pasa a entrevista, la tabla muestra ese cambio y cuánto tiempo transcurrió entre un estado y otro.

El modelo de datos completo está documentado en [MODELO.md](MODELO.md).

## Limitaciones conocidas

- Si no se utiliza la app durante un plazo de 15 minutos, el servidor se apaga y tarda alrededor de 35 segundos en volver a encenderse. Para mitigar esa espera, en las pantallas de login/registro se agregó una alerta que, después de 5 segundos sin recibir respuesta, notifica al usuario que el servidor está despertando, para que sepa que la app no está rota.
- Al intentar registrarse con un correo existente, el sistema responde con un 409, lo que permite a posibles atacantes identificar qué cuentas están registradas.