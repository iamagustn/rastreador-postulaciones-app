# Job Application Tracker

[Español](README.es.md)

## What is it?

An app that allows you to track your job applications, helping you keep better control of and organize where you have submitted applications, which job boards they come from, the type of job market, and their work arrangements, whether remote, on-site, or hybrid.

Sometimes we have job applications on Indeed, LinkedIn, or OCC, and we don't know where to track them. With this app, we can keep all these records in one place.

## Deployed App Links

I deployed my app using Render to host both the API and the frontend, and I used Neon for the database.

Frontend:

https://rastreador-postulaciones-app-1.onrender.com

API documentation:

https://rastreador-postulaciones-app.onrender.com/docs

## What does it do?

- User registration and authentication
- Job application CRUD operations
- Status change history
- Catalogs of work arrangements, job markets, and statuses

## What technologies is it built with?

- FastAPI
- PostgreSQL
- React
- TypeScript
- Tailwind CSS
- JWT
- SQLAlchemy
- bcrypt
- Pytest

## How to run it locally?

1. Clone this repository by running:

```bash
git clone https://github.com/iamagustn/rastreador-postulaciones-app
```

2. Create the virtual environment by running:

```bash
python -m venv .venv
```

Activate it by running:

Windows (CMD):

```bat
.venv\Scripts\activate.bat
```

Windows (PowerShell):

```powershell
.venv\Scripts\Activate.ps1
```

macOS/Linux:

```bash
source .venv/bin/activate
```

3. Install the dependencies:

```bash
pip install -r requirements.txt
```

4. You will need the environment variables required by the backend and frontend:

- LLAVE: Generate a secret key using Python's secrets module.
- DURACION_TOKEN: Enter the number of minutes you want the token to remain valid.
- FRONTEND_URL: The URL of your local frontend.
- DATABASE_URL: A PostgreSQL connection string. Do not expose real credentials in public documentation.
- VITE_API_URL: The API URL used by Vite.
- DATABASE_URL_TEST: The URL of the test database (it must be created separately from the production database).

5. Run backend/esquema.sql and backend/datos_iniciales.sql against the database.

6. Run this command from the backend directory:

```bash
uvicorn rastreador.main:app --reload
```

And this one from the frontend directory:

```bash
npm run dev
```

7. Before running the tests, you must configure the DATABASE_URL_TEST environment variable. Once this is done, run the following command:

```bash
pytest -v
```

## Design Decisions

- Salaries are stored in cents to avoid rounding errors. Inconsistencies can occur when transferring data between the database, backend, and frontend because JavaScript cannot represent all decimal values exactly. Storing monetary amounts as integer cents helps preserve their precision, and the values are divided by 100 for display.

- Catalogs such as job markets, statuses, and work arrangements are stored as tables instead of using CHECK constraints. This approach makes it easier to add new statuses, work arrangements, or job markets by simply inserting a new record into the corresponding table. If CHECK constraints were used instead, we would have to modify the constraint using ALTER TABLE.

- The status history is stored in a separate table instead of a single field because it allows us to track how a job application has progressed over time. If an application has the status "Applied" one day and changes to "Interview" the next day, the table records that change and allows us to determine how much time has passed between the two statuses.

The complete data model is documented in [MODELO.md](MODELO.md).

## Known Limitations

- If the app is not used for 15 minutes, the server shuts down and takes around 35 seconds to start up again. To mitigate this waiting time, an alert was added to the login and registration screens. After 5 seconds without receiving a response, the alert informs the user that the server is waking up, so they know that the app is not broken.

- When attempting to register with an email address that is already in use, the system returns a 409 status code, which allows potential attackers to identify which accounts are already registered.
